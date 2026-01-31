interface TopBarProps {
  title: string;
  children?: React.ReactNode;
}

export function TopBar({ title, children }: TopBarProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </header>
  );
}
