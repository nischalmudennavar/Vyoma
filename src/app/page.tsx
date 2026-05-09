import { ClientYear } from "@/components/client-year";
import { LeftPane } from "@/components/left-pane";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <LeftPane />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <header className="flex w-full items-center justify-between border-b px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight">Vyoma</h1>
          <ModeToggle />
        </header>
        <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Welcome to Vyoma
          </h2>
          <p className="mt-4 max-w-175 text-muted-foreground md:text-xl">
            A modular system designed for change. Built with semantic tokens and
            scalable architecture.
          </p>
        </main>
        <footer className="flex w-full items-center justify-center border-t py-6 text-sm text-muted-foreground">
          <ClientYear />
        </footer>
      </div>
    </div>
  );
}
