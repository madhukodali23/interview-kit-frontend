"use client";

import { KeyboardEvent, ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Accessible, keyboard-navigable tab strip (roving tabindex, arrow-key
 * navigation) that scrolls horizontally on narrow screens instead of
 * wrapping or overflowing.
 */
export const Tabs = ({ items, value, onChange, className }: TabsProps) => {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const nextItem = items[nextIndex];
      onChange(nextItem.value);
      refs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        "scrollbar-none flex gap-1 overflow-x-auto rounded-lg border border-border bg-surface-muted p-1",
        className,
      )}
    >
      {items.map((item, index) => {
        const isActive = item.value === value;

        return (
          <button
            key={item.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            role="tab"
            type="button"
            id={`tab-${item.value}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${item.value}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium whitespace-nowrap",
              isActive
                ? "bg-surface text-brand-700 shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.icon}
            {item.label}
            {item.badge}
          </button>
        );
      })}
    </div>
  );
};

export const TabPanel = ({
  value,
  activeValue,
  children,
}: {
  value: string;
  activeValue: string;
  children: ReactNode;
}) => {
  if (value !== activeValue) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      className="animate-fade-in"
      tabIndex={0}
    >
      {children}
    </div>
  );
};
