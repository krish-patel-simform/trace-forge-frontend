import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, Check, ChevronDown } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { type Theme } from "../../contexts/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4 text-primary-400" /> },
    { value: "system", label: "System", icon: <Monitor className="w-4 h-4 text-gray-500 dark:text-gray-400" /> },
  ];

  const currentIcon =
    theme === "system" ? (
      <Monitor className="w-4 h-4 text-gray-600 dark:text-gray-300" />
    ) : resolvedTheme === "dark" ? (
      <Moon className="w-4 h-4 text-primary-400" />
    ) : (
      <Sun className="w-4 h-4 text-amber-500" />
    );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-dark-border/60 hover:bg-gray-200 dark:hover:bg-dark-border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
        title={`Current theme: ${theme}`}
      >
        {currentIcon}
        <span className="capitalize hidden sm:inline">{theme}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 py-1 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
            Appearance
          </div>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setTheme(option.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                theme === option.value
                  ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border/50"
              }`}
            >
              <div className="flex items-center gap-2">
                {option.icon}
                <span>{option.label}</span>
              </div>
              {theme === option.value && <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
