"use client";

import { useState } from "react";
import { TokenCategory } from "@/types/token";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

// Protocol Icons - Using colored circles/badges to represent different protocols
const ProtocolIcon = ({ color, children }: { color: string; children?: React.ReactNode }) => (
  <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold", color)}>
    {children}
  </div>
);

// Quote Token Icons
const SolanaIcon = () => (
  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
    <span className="text-[8px] font-bold text-white">S</span>
  </div>
);

const USDCIcon = () => (
  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
    <span className="text-[8px] font-bold text-white">U</span>
  </div>
);

const USD1Icon = () => (
  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
    <span className="text-[8px] font-bold text-white">1</span>
  </div>
);

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const protocols = [
  { id: "pump", name: "Pump", icon: <ProtocolIcon color="bg-green-500" /> },
  { id: "bags", name: "Bags", icon: <ProtocolIcon color="bg-green-500" /> },
  { id: "daos-fun", name: "Daos.fun", icon: <ProtocolIcon color="bg-blue-500"><span className="text-white">D</span></ProtocolIcon> },
  { id: "believe", name: "Believe", icon: <ProtocolIcon color="bg-green-500"><span className="text-white">B</span></ProtocolIcon> },
  { id: "boop", name: "Boop", icon: <ProtocolIcon color="bg-blue-500" /> },
  { id: "mayhem", name: "Mayhem", icon: <ProtocolIcon color="bg-red-500" /> },
  { id: "moonshot", name: "Moonshot", icon: <ProtocolIcon color="bg-purple-500" /> },
  { id: "candle", name: "Candle", icon: <ProtocolIcon color="bg-orange-500" /> },
  { id: "jupiter-studio", name: "Jupiter Studio", icon: <ProtocolIcon color="bg-orange-500" /> },
  { id: "launchlab", name: "LaunchLab", icon: <ProtocolIcon color="bg-red-500"><span className="text-white">R</span></ProtocolIcon> },
  { id: "bonk", name: "Bonk", icon: <ProtocolIcon color="bg-orange-500" /> },
  { id: "heaven", name: "Heaven", icon: <ProtocolIcon color="bg-gray-400" /> },
  { id: "sugar", name: "Sugar", icon: <ProtocolIcon color="bg-pink-500" /> },
  { id: "moonit", name: "Moonit", icon: <ProtocolIcon color="bg-green-500" /> },
  { id: "dynamic-bc", name: "Dynamic BC", icon: <ProtocolIcon color="bg-red-500" /> },
];

const quoteTokens = [
  { id: "sol", name: "SOL", icon: <SolanaIcon /> },
  { id: "usdc", name: "USDC", icon: <USDCIcon /> },
  { id: "usd1", name: "USD1", icon: <USD1Icon /> },
];

const categories: Array<{ value: TokenCategory | "all"; label: string }> = [
  { value: "new-pairs", label: "New Pairs" },
  { value: "final-stretch", label: "Final Stretch" },
  { value: "migrated", label: "Migrated" },
];

export function FilterModal({ open, onOpenChange }: FilterModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<TokenCategory | "all">("final-stretch");
  const [selectedProtocols, setSelectedProtocols] = useState<Set<string>>(new Set());
  const [selectedQuoteTokens, setSelectedQuoteTokens] = useState<Set<string>>(new Set(["sol"]));
  const [searchKeywords, setSearchKeywords] = useState("");
  const [excludeKeywords, setExcludeKeywords] = useState("");
  const [activeMetricTab, setActiveMetricTab] = useState<"audit" | "metrics" | "socials">("audit");
  const [dexPaid, setDexPaid] = useState(false);
  const [caEndsInPump, setCaEndsInPump] = useState(false);
  const [ageMin, setAgeMin] = useState("");
  const [ageMinUnit, setAgeMinUnit] = useState<"m" | "h" | "d">("m");
  const [ageMax, setAgeMax] = useState("");
  const [ageMaxUnit, setAgeMaxUnit] = useState<"m" | "h" | "d">("m");

  const toggleProtocol = (protocolId: string) => {
    const newSet = new Set(selectedProtocols);
    if (newSet.has(protocolId)) {
      newSet.delete(protocolId);
    } else {
      newSet.add(protocolId);
    }
    setSelectedProtocols(newSet);
  };

  const toggleQuoteToken = (tokenId: string) => {
    const newSet = new Set(selectedQuoteTokens);
    if (newSet.has(tokenId)) {
      newSet.delete(tokenId);
    } else {
      newSet.add(tokenId);
    }
    setSelectedQuoteTokens(newSet);
  };

  const unselectAllProtocols = () => {
    setSelectedProtocols(new Set());
  };

  const unselectAllQuoteTokens = () => {
    setSelectedQuoteTokens(new Set());
  };

  const handleApplyAll = () => {
    // TODO: Apply filters to the store
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed right-0 top-0 h-full w-[500px] max-w-[90vw] translate-x-0 translate-y-0 rounded-none border-l border-t-0 border-r-0 border-b-0 max-h-screen overflow-y-auto bg-card p-6 [&>button]:hidden data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
          <DialogTitle className="text-xl font-bold">Filters</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Category Tabs */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex gap-6">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={cn(
                    "text-sm font-medium pb-2 border-b-2 transition-colors",
                    selectedCategory === category.value
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Protocols Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Protocols</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                onClick={unselectAllProtocols}
              >
                Unselect All
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {protocols.map((protocol) => (
                <button
                  key={protocol.id}
                  onClick={() => toggleProtocol(protocol.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs transition-colors",
                    selectedProtocols.has(protocol.id)
                      ? "bg-primary/10 border-primary text-foreground"
                      : "bg-muted/50 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {protocol.icon}
                  <span className="truncate">{protocol.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quote Tokens Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Quote Tokens</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
                onClick={unselectAllQuoteTokens}
              >
                Unselect All
              </Button>
            </div>
            <div className="flex gap-2">
              {quoteTokens.map((token) => (
                <button
                  key={token.id}
                  onClick={() => toggleQuoteToken(token.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs transition-colors",
                    selectedQuoteTokens.has(token.id)
                      ? "bg-primary/10 border-primary text-foreground"
                      : "bg-muted/50 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  {token.icon}
                  <span>{token.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Keyword Search Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Search Keywords</label>
              <Input
                placeholder="keyword1, keyword2..."
                value={searchKeywords}
                onChange={(e) => setSearchKeywords(e.target.value)}
                className="h-9 bg-muted/50 border-border text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Exclude Keywords</label>
              <Input
                placeholder="keyword1, keyword2..."
                value={excludeKeywords}
                onChange={(e) => setExcludeKeywords(e.target.value)}
                className="h-9 bg-muted/50 border-border text-sm"
              />
            </div>
          </div>

          {/* Metric/Social Filters */}
          <div className="space-y-4">
            <div className="flex gap-6 border-b border-border">
              {(["audit", "metrics", "socials"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveMetricTab(tab)}
                  className={cn(
                    "text-sm font-medium pb-2 border-b-2 transition-colors capitalize",
                    activeMetricTab === tab
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab === "metrics" ? "$ Metrics" : tab}
                </button>
              ))}
            </div>

            {activeMetricTab === "audit" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="dex-paid"
                    checked={dexPaid}
                    onChange={(e) => setDexPaid(e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <label htmlFor="dex-paid" className="text-sm">
                    Dex Paid
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ca-ends-pump"
                    checked={caEndsInPump}
                    onChange={(e) => setCaEndsInPump(e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <label htmlFor="ca-ends-pump" className="text-sm">
                    CA ends in &lsquo;pump&rsquo;
                  </label>
                </div>

                {/* Age Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Age</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">Min</span>
                      <Input
                        type="number"
                        value={ageMin}
                        onChange={(e) => setAgeMin(e.target.value)}
                        className="w-16 h-8 bg-muted/50 border-border text-sm"
                      />
                      <select
                        value={ageMinUnit}
                        onChange={(e) => setAgeMinUnit(e.target.value as "m" | "h" | "d")}
                        className="h-8 px-2 rounded-md border border-border bg-muted/50 text-sm text-foreground"
                      >
                        <option value="m">m</option>
                        <option value="h">h</option>
                        <option value="d">d</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">Max</span>
                      <Input
                        type="number"
                        value={ageMax}
                        onChange={(e) => setAgeMax(e.target.value)}
                        className="w-16 h-8 bg-muted/50 border-border text-sm"
                      />
                      <select
                        value={ageMaxUnit}
                        onChange={(e) => setAgeMaxUnit(e.target.value as "m" | "h" | "d")}
                        className="h-8 px-2 rounded-md border border-border bg-muted/50 text-sm text-foreground"
                      >
                        <option value="m">m</option>
                        <option value="h">h</option>
                        <option value="d">d</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeMetricTab === "metrics" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Top 10 Holders %</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      className="w-24 h-8 bg-muted/50 border-border text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      className="w-24 h-8 bg-muted/50 border-border text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeMetricTab === "socials" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Social filters coming soon...</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 bg-muted/50 border-border text-sm"
            >
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4 bg-muted/50 border-border text-sm"
            >
              Export
            </Button>
            <Button
              size="sm"
              onClick={handleApplyAll}
              className="h-9 px-4 bg-primary text-primary-foreground text-sm"
            >
              Apply All
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

