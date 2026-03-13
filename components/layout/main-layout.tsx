import Link from "next/link";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-600/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                AssetFlow
              </span>
              <span className="text-[10px] text-slate-400 -mt-0.5">
                Office Equipment
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              ค้นหาและยืม
            </Link>
            <Link 
              href="/history" 
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v4l3 3"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              ประวัติยืม
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
              แดชบอร์ด
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {children}
        </div>
      </main>
      <footer className="border-t border-slate-200/60 bg-white/50 py-6">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-slate-400">
          © 2026 AssetFlow - ระบบบริหารจัดการการยืม-คืนอุปกรณ์สำนักงาน
        </div>
      </footer>
    </div>
  );
}
