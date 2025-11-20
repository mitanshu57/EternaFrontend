import { TokenTradingTable } from "@/components/token-trading-table";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-border flex items-center justify-between bg-card">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Pulse</h1>
          </div>
          <ThemeToggle />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <TokenTradingTable />
        </div>
      </div>
    </main>
  );
}

