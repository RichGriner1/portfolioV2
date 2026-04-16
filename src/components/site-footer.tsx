export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border/60 border-t">
      <div className="text-muted-foreground mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} Richard Griner. All rights reserved.</p>
        <p className="font-mono text-xs">Designed & built by hand.</p>
      </div>
    </footer>
  );
}
