import { prisma } from "@/lib/prisma";
import { Prisma, TransactionStatus } from "@prisma/client";

export async function searchInventory(params: {
  categoryId?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : 20;

  const where: Prisma.EquipmentWhereInput = {
    ...(params.categoryId
      ? { categoryId: params.categoryId }
      : {}),
    ...(params.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" } },
            { sku: { contains: params.search, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const [items, total] = await Promise.all([
    prisma.equipment.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        category: true
      },
      orderBy: {
        name: "asc"
      }
    }),
    prisma.equipment.count({ where })
  ]);

  return {
    items,
    total,
    page,
    pageSize
  };
}

export async function createBorrowTransaction(args: {
  userId: string;
  equipmentId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
}) {
  if (args.endDate <= args.startDate) {
    throw new Error("End date must be after start date");
  }

  return prisma.$transaction(async (tx) => {
    const equipment = await tx.equipment.findUnique({
      where: { id: args.equipmentId }
    });

    if (!equipment) {
      throw new Error("Equipment not found");
    }

    if (equipment.availableStock <= 0) {
      throw new Error("No available stock for this equipment");
    }

    const overlapping = await tx.transaction.count({
      where: {
        equipmentId: args.equipmentId,
        status: {
          in: [
            TransactionStatus.PENDING,
            TransactionStatus.APPROVED,
            TransactionStatus.BORROWING
          ]
        },
        NOT: {
          OR: [
            { endDate: { lte: args.startDate } },
            { startDate: { gte: args.endDate } }
          ]
        }
      }
    });

    if (overlapping > 0) {
      throw new Error("Selected date range overlaps with an existing booking");
    }

    const transaction = await tx.transaction.create({
      data: {
        userId: args.userId,
        equipmentId: args.equipmentId,
        startDate: args.startDate,
        endDate: args.endDate,
        reason: args.reason,
        status: TransactionStatus.PENDING
      }
    });

    return transaction;
  });
}

export async function updateTransactionStatusWithStock(args: {
  transactionId: string;
  adminId: string;
  status: TransactionStatus;
  remarks?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.transaction.findUnique({
      where: { id: args.transactionId }
    });

    if (!existing) {
      throw new Error("Transaction not found");
    }

    const updated = await tx.transaction.update({
      where: { id: args.transactionId },
      data: {
        status: args.status,
        adminRemark: args.remarks
      }
    });

    if (
      existing.status === TransactionStatus.PENDING &&
      (args.status === TransactionStatus.APPROVED ||
        args.status === TransactionStatus.BORROWING)
    ) {
      const equipment = await tx.equipment.findUnique({
        where: { id: existing.equipmentId }
      });

      if (!equipment || equipment.availableStock <= 0) {
        throw new Error("Cannot approve, no available stock");
      }

      await tx.equipment.update({
        where: { id: equipment.id },
        data: {
          availableStock: {
            decrement: 1
          }
        }
      });
    }

    if (
      (args.status === TransactionStatus.RETURNED ||
        args.status === TransactionStatus.REJECTED) &&
      (existing.status === TransactionStatus.APPROVED ||
        existing.status === TransactionStatus.BORROWING)
    ) {
      await tx.equipment.update({
        where: { id: existing.equipmentId },
        data: {
          availableStock: {
            increment: 1
          }
        }
      });
    }

    await tx.auditLog.create({
      data: {
        action: `STATUS_CHANGE:${existing.status}->${args.status}`,
        tableName: "transactions",
        recordId: existing.id,
        performedBy: args.adminId
      }
    });

    return updated;
  });
}

export async function getDashboardStats() {
  const [totalItems, activeBorrows, overdueItems, topBorrowed] =
    await Promise.all([
      prisma.equipment.count(),
      prisma.transaction.count({
        where: {
          status: {
            in: [TransactionStatus.APPROVED, TransactionStatus.BORROWING]
          }
        }
      }),
      prisma.transaction.count({
        where: {
          status: TransactionStatus.OVERDUE
        }
      }),
      prisma.transaction.groupBy({
        by: ["equipmentId"],
        _count: {
          _all: true
        },
        orderBy: {
          _count: {
            equipmentId: "desc"
          }
        },
        take: 5
      })
    ]);

  const equipmentMap = await prisma.equipment.findMany({
    where: {
      id: {
        in: topBorrowed.map((t) => t.equipmentId)
      }
    }
  });

  return {
    total_items: totalItems,
    active_borrows: activeBorrows,
    overdue_items: overdueItems,
    top_borrowed: topBorrowed.map((t) => ({
      equipmentId: t.equipmentId,
      count: t._count._all,
      name:
        equipmentMap.find((e) => e.id === t.equipmentId)?.name ?? "Unknown"
    }))
  };
}

