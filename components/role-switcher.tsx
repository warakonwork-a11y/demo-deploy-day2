"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type UserRole = "USER" | "ADMIN";

interface RoleSwitcherProps {
  onRoleChange?: (role: UserRole) => void;
}

export function RoleSwitcher({ onRoleChange }: RoleSwitcherProps) {
  const [role, setRole] = useState<UserRole>("USER");

  useEffect(() => {
    const savedRole = localStorage.getItem("demo-role") as UserRole | null;
    if (savedRole) {
      setRole(savedRole);
      onRoleChange?.(savedRole);
    }
  }, [onRoleChange]);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem("demo-role", newRole);
    onRoleChange?.(newRole);
    // Trigger a custom event so other components can react
    window.dispatchEvent(new CustomEvent("role-change", { detail: newRole }));
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">Demo:</span>
      <Button
        size="sm"
        variant={role === "USER" ? "default" : "outline"}
        onClick={() => handleRoleChange("USER")}
        className="h-7 px-2.5 text-xs"
      >
        พนักงาน
      </Button>
      <Button
        size="sm"
        variant={role === "ADMIN" ? "default" : "outline"}
        onClick={() => handleRoleChange("ADMIN")}
        className="h-7 px-2.5 text-xs"
      >
        ผู้ดูแล
      </Button>
      <Badge variant={role === "ADMIN" ? "warning" : "default"} className="ml-1">
        {role === "ADMIN" ? "Admin" : "User"}
      </Badge>
    </div>
  );
}

export function getDemoRole(): UserRole {
  if (typeof window === "undefined") return "USER";
  return (localStorage.getItem("demo-role") as UserRole) || "USER";
}
