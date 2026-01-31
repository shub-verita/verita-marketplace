"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  id?: string;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter",
  id,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-2 border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white min-h-[42px]">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          id={id}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none text-sm"
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Press Enter or comma to add tags
      </p>
    </div>
  );
}
