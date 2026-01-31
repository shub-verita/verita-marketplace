"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type ApplicationStatus = "NEW" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "HIRED";

const statusConfig: Record<
  ApplicationStatus,
  { bg: string; text: string; label: string }
> = {
  NEW: { bg: "bg-blue-100", text: "text-blue-700", label: "New" },
  REVIEWING: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Reviewing" },
  SHORTLISTED: { bg: "bg-green-100", text: "text-green-700", label: "Shortlisted" },
  REJECTED: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
  HIRED: { bg: "bg-purple-100", text: "text-purple-700", label: "Hired" },
};

const allStatuses: ApplicationStatus[] = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
];

interface StatusBadgeProps {
  status: ApplicationStatus;
  onChange?: (status: ApplicationStatus) => void;
  size?: "sm" | "md";
}

export function StatusBadge({
  status,
  onChange,
  size = "sm",
}: StatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const config = statusConfig[status];

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  if (!onChange) {
    return (
      <span
        className={`inline-flex items-center font-medium rounded ${config.bg} ${config.text} ${sizeClasses}`}
      >
        {config.label}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1 font-medium rounded ${config.bg} ${config.text} ${sizeClasses}`}
      >
        {config.label}
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 min-w-[140px]">
            {allStatuses.map((s) => {
              const sConfig = statusConfig[s];
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onChange(s);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-sm hover:bg-slate-50 flex items-center gap-2 ${
                    s === status ? "bg-slate-50" : ""
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${sConfig.bg.replace(
                      "100",
                      "500"
                    )}`}
                  />
                  {sConfig.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
