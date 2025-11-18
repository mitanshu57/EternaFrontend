import { TokenTradingTable } from "@/components/token-trading-table";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-4 sm:mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Token Discovery</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">
              Discover new trading opportunities
            </p>
          </div>
          <ThemeToggle />
        </div>
        <TokenTradingTable />
      </div>
    </main>
  );
}

