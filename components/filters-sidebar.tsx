"use client";

import { memo, useState } from "react";
import { X, RefreshCw, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TokenCategory } from "@/types/token";
import { cn } from "@/lib/utils";

interface FiltersSidebarProps {
  open: boolean;
  onClose: () => void;
  selectedCategory: TokenCategory;
  onCategoryChange: (category: TokenCategory) => void;
}

const protocols = [
  { id: "pump", name: "Pump", icon: "💉", color: "bg-green-500" },
  { id: "mayhem", name: "Mayhem", icon: "💊", color: "bg-red-500" },
  { id: "bonk", name: "Bonk", icon: "☀️", color: "bg-orange-500" },
  { id: "bags", name: "Bags", icon: "👜", color: "bg-green-500" },
  { id: "moonshot", name: "Moonshot", icon: "🌙", color: "bg-purple-500" },
  { id: "heaven", name: "Heaven", icon: "—", color: "bg-gray-500" },
  { id: "daos", name: "Daos.fun", icon: "🏛️", color: "bg-blue-500" },
  { id: "candle", name: "Candle", icon: "🕯️", color: "bg-orange-500" },
  { id: "sugar", name: "Sugar", icon: "🍩", color: "bg-pink-500" },
  { id: "believe", name: "Believe", icon: "✓", color: "bg-green-500" },
  { id: "jupiter", name: "Jupiter Studio", icon: "🪐", color: "bg-orange-500" },
  { id: "moonit", name: "Moonit", icon: "✈️", color: "bg-green-500" },
  { id: "boop", name: "Boop", icon: "😊", color: "bg-blue-500" },
  { id: "launchlab", name: "LaunchLab", icon: "🚀", color: "bg-cyan-500" },
  { id: "dynamic", name: "Dynamic BC", icon: "⚡", color: "bg-red-500" },
  { id: "wavebreak", name: "Wavebreak", icon: "🌊", color: "bg-amber-700" },
];

const quoteTokens = [
  { id: "sol", name: "SOL", icon: "🟣", color: "bg-green-500" },
  { id: "usdc", name: "USDC", icon: "💵", color: "bg-blue-500" },
  { id: "usd1", name: "USD1", icon: "1", color: "bg-yellow-500" },
];

const filterTabs = ["Audit", "$ Metrics", "Socials"];

/**
 * Filters sidebar component with comprehensive filtering options
 * Memoized for performance optimization
 */
export const FiltersSidebar = memo(function FiltersSidebar({
  open,
  onClose,
  selectedCategory,
  onCategoryChange,
}: FiltersSidebarProps) {
  const [selectedProtocols, setSelectedProtocols] = useState<Set<string>>(new Set());
  const [selectedQuoteTokens, setSelectedQuoteTokens] = useState<Set<string>>(new Set(["sol"]));
  const [searchKeywords, setSearchKeywords] = useState("");
  const [excludeKeywords, setExcludeKeywords] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState("Audit");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [ageUnit, setAgeUnit] = useState<"m" | "d" | "h">("m");
  const [dexPaid, setDexPaid] = useState(false);
  const [caEndsPump, setCaEndsPump] = useState(false);

  const toggleProtocol = (id: string) => {
    const newSet = new Set(selectedProtocols);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedProtocols(newSet);
  };

  const toggleQuoteToken = (id: string) => {
    const newSet = new Set(selectedQuoteTokens);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedQuoteTokens(newSet);
  };

  const selectAllProtocols = () => {
    setSelectedProtocols(new Set(protocols.map((p) => p.id)));
  };

  const unselectAllQuoteTokens = () => {
    setSelectedQuoteTokens(new Set());
  };

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border shadow-lg overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-2">
          {(["new-pairs", "final-stretch", "migrated"] as TokenCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "px-3 py-1 text-sm font-medium transition-colors",
                selectedCategory === cat
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {cat === "new-pairs" ? "New Pairs" : cat === "final-stretch" ? "Final Stretch" : "Migrated"}
            </button>
          ))}
          <Button variant="ghost" size="icon" className="ml-auto h-6 w-6">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Protocols */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Protocols</h3>
            <Button variant="ghost" size="sm" onClick={selectAllProtocols} className="text-xs h-6">
              Select All
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {protocols.map((protocol) => (
              <button
                key={protocol.id}
                onClick={() => toggleProtocol(protocol.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-colors",
                  selectedProtocols.has(protocol.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                <span>{protocol.icon}</span>
                <span className="truncate">{protocol.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quote Tokens */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Quote Tokens</h3>
            <Button variant="ghost" size="sm" onClick={unselectAllQuoteTokens} className="text-xs h-6">
              Unselect All
            </Button>
          </div>
          <div className="flex gap-2">
            {quoteTokens.map((token) => (
              <button
                key={token.id}
                onClick={() => toggleQuoteToken(token.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-colors",
                  selectedQuoteTokens.has(token.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                <span>{token.icon}</span>
                <span>{token.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Keywords */}
        <div>
          <label className="text-sm font-medium mb-2 block">Search Keywords</label>
          <Input
            placeholder="keyword1, keyword2..."
            value={searchKeywords}
            onChange={(e) => setSearchKeywords(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        {/* Exclude Keywords */}
        <div>
          <label className="text-sm font-medium mb-2 block">Exclude Keywords</label>
          <Input
            placeholder="keyword1, keyword2..."
            value={excludeKeywords}
            onChange={(e) => setExcludeKeywords(e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div>
          <div className="flex gap-2 border-b border-border mb-3">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilterTab(tab)}
                className={cn(
                  "px-3 py-1 text-sm font-medium transition-colors",
                  activeFilterTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeFilterTab === "Audit" && (
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={dexPaid}
                  onChange={(e) => setDexPaid(e.target.checked)}
                  className="rounded"
                />
                <span>Dex Paid</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={caEndsPump}
                  onChange={(e) => setCaEndsPump(e.target.checked)}
                  className="rounded"
                />
                <span>CA ends in &apos;pump&apos;</span>
              </label>
            </div>
          )}

          {activeFilterTab === "$ Metrics" && (
            <div className="text-sm text-muted-foreground">
              <p>Metrics filters coming soon...</p>
            </div>
          )}

          {activeFilterTab === "Socials" && (
            <div className="text-sm text-muted-foreground">
              <p>Social filters coming soon...</p>
            </div>
          )}
        </div>

        {/* Age */}
        <div>
          <h3 className="text-sm font-medium mb-3">Age</h3>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Min</label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  className="h-8 text-sm"
                  placeholder="0"
                />
                <select
                  value={ageUnit}
                  onChange={(e) => setAgeUnit(e.target.value as "m" | "d" | "h")}
                  className="h-8 px-2 text-xs rounded-md border border-input bg-background"
                >
                  <option value="h">h</option>
                  <option value="d">d</option>
                  <option value="m">m</option>
                </select>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Max</label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  className="h-8 text-sm"
                  placeholder="0"
                />
                <select
                  value={ageUnit}
                  onChange={(e) => setAgeUnit(e.target.value as "m" | "d" | "h")}
                  className="h-8 px-2 text-xs rounded-md border border-input bg-background"
                >
                  <option value="h">h</option>
                  <option value="d">d</option>
                  <option value="m">m</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
            Apply All
          </Button>
        </div>
      </div>
    </div>
  );
});

