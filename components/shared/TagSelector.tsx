"use client";

import { Label } from "@/components/ui/label";

export type Tag = {
  id: string;
  name: string;
  category: string;
  color: string | null;
};

interface TagSelectorProps {
  tags: Tag[];
  selectedTags: string[];
  onToggle: (tagId: string) => void;
  label?: string;
  category?: string;
}

export function TagSelector({ tags, selectedTags, onToggle, label, category }: TagSelectorProps) {
  // Filter tags by category if provided
  const filteredTags = category 
    ? tags.filter(tag => tag.category === category)
    : tags;

  // Group tags by category
  const groupedTags = filteredTags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  if (filteredTags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {label && <Label>{label}</Label>}
      
      {Object.entries(groupedTags).map(([categoryName, categoryTags]) => (
        <div key={categoryName} className="space-y-2">
          {!category && (
            <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 capitalize">
              {categoryName}
            </h4>
          )}
          <div className="flex flex-wrap gap-2">
            {categoryTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => onToggle(tag.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isSelected
                      ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {tag.name}
                  {tag.color && (
                    <span
                      className="inline-block w-2 h-2 rounded-full ml-2"
                      style={{ backgroundColor: tag.color }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
