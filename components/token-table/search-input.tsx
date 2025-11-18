"use client";

import { memo, useRef, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { debounce } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Search input component with debounced onChange
 * Memoized for performance optimization
 */
export const SearchInput = memo(function SearchInput({
  value,
  onChange,
  placeholder = "Search tokens...",
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useRef(
    debounce((newValue: string) => {
      onChangeRef.current(newValue);
    }, 300)
  ).current;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-2 sm:left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        className="pl-7 sm:pl-9 h-8 sm:h-10 text-xs sm:text-sm w-full"
      />
    </div>
  );
});

