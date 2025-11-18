"use client";

import { memo } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * Theme toggle component with system/light/dark options
 * Memoized for performance optimization
 */
export const ThemeToggle = memo(function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        disabled
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[2];
  const CurrentIcon = currentTheme.icon;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          aria-label="Toggle theme"
        >
          <CurrentIcon className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1" align="end">
        <div className="space-y-1">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            return (
              <button
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  theme === themeOption.value &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{themeOption.label}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
});

