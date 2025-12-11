"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RepertoireFormData } from "./types";

interface RepertoireFormProps {
  data: RepertoireFormData;
  onChange: (data: Partial<RepertoireFormData>) => void;
  defaultKey?: string | null;
  defaultTempo?: number | null;
}

const KEYS = [
  "C", "C♯", "D♭", "D", "D♯", "E♭", "E", "F", "F♯", "G♭", "G", "G♯", "A♭", "A", "A♯", "B♭", "B",
  "C Minor", "C♯ Minor", "D Minor", "D♯ Minor", "E♭ Minor", "E Minor", "F Minor", "F♯ Minor",
  "G Minor", "G♯ Minor", "A Minor", "A♯ Minor", "B♭ Minor", "B Minor"
];

export function RepertoireForm({ data, onChange, defaultKey, defaultTempo }: RepertoireFormProps) {
  const [duration, setDuration] = useState(() => {
    if (!data.typicalDuration) return "";
    const mins = Math.floor(data.typicalDuration / 60);
    const secs = data.typicalDuration % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  });

  const handleDurationChange = (value: string) => {
    setDuration(value);
    const parts = value.split(":");
    if (parts.length === 2) {
      const mins = parseInt(parts[0]) || 0;
      const secs = parseInt(parts[1]) || 0;
      onChange({ typicalDuration: mins * 60 + secs });
    }
  };

  return (
    <Accordion type="multiple" className="w-full">
      {/* Performance Settings */}
      <AccordionItem value="performance-settings">
        <AccordionTrigger className="text-sm font-medium">
          Performance Settings
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Performed Key */}
              <div className="space-y-2">
                <Label htmlFor="performedKey">Performed Key</Label>
                <Select
                  value={data.performedKey || ""}
                  onValueChange={(value) => onChange({ performedKey: value })}
                >
                  <SelectTrigger id="performedKey">
                    <SelectValue placeholder={defaultKey || "Select key"} />
                  </SelectTrigger>
                  <SelectContent>
                    {KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Performed Tempo */}
              <div className="space-y-2">
                <Label htmlFor="performedTempo">Performed Tempo (BPM)</Label>
                <Input
                  id="performedTempo"
                  type="number"
                  min="40"
                  max="240"
                  placeholder={defaultTempo?.toString() || "120"}
                  value={data.performedTempo || ""}
                  onChange={(e) => onChange({ performedTempo: parseInt(e.target.value) || null })}
                />
              </div>

              {/* Capo Position */}
              <div className="space-y-2">
                <Label htmlFor="capoPosition">Capo Position</Label>
                <Input
                  id="capoPosition"
                  type="number"
                  min="0"
                  max="12"
                  placeholder="0"
                  value={data.capoPosition || ""}
                  onChange={(e) => onChange({ capoPosition: parseInt(e.target.value) || null })}
                />
              </div>

              {/* Typical Duration */}
              <div className="space-y-2">
                <Label htmlFor="typicalDuration">Typical Duration (MM:SS)</Label>
                <Input
                  id="typicalDuration"
                  type="text"
                  placeholder="3:45"
                  value={duration}
                  onChange={(e) => handleDurationChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Performance Details */}
      <AccordionItem value="performance-details">
        <AccordionTrigger className="text-sm font-medium">
          Performance Details
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Difficulty */}
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty (1-5)</Label>
                <Input
                  id="difficulty"
                  type="number"
                  min="1"
                  max="5"
                  placeholder="3"
                  value={data.difficulty || ""}
                  onChange={(e) => onChange({ difficulty: parseInt(e.target.value) || null })}
                />
              </div>

              {/* Energy Level */}
              <div className="space-y-2">
                <Label htmlFor="energyLevel">Energy Level (1-5)</Label>
                <Input
                  id="energyLevel"
                  type="number"
                  min="1"
                  max="5"
                  placeholder="3"
                  value={data.energyLevel || ""}
                  onChange={(e) => onChange({ energyLevel: parseInt(e.target.value) || null })}
                />
              </div>
            </div>

            {/* Vocally Demanding */}
            <div className="flex items-center gap-2">
              <input
                id="vocallyDemanding"
                type="checkbox"
                checked={data.vocallyDemanding}
                onChange={(e) => onChange({ vocallyDemanding: e.target.checked })}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <Label htmlFor="vocallyDemanding" className="cursor-pointer">
                Vocally Demanding
              </Label>
            </div>

            {/* Works Well For */}
            <div className="space-y-2">
              <Label htmlFor="worksWellFor">Works Well For</Label>
              <Input
                id="worksWellFor"
                type="text"
                placeholder="weddings, jazz clubs, corporate events"
                value={data.worksWellFor}
                onChange={(e) => onChange({ worksWellFor: e.target.value })}
              />
            </div>

            {/* Avoid After */}
            <div className="space-y-2">
              <Label htmlFor="avoidAfter">Avoid After</Label>
              <Input
                id="avoidAfter"
                type="text"
                placeholder="Don't follow another ballad"
                value={data.avoidAfter}
                onChange={(e) => onChange({ avoidAfter: e.target.value })}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Notes & Arrangement */}
      <AccordionItem value="notes-arrangement">
        <AccordionTrigger className="text-sm font-medium">
          Notes & Arrangement
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 pt-2">
            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Performance Notes</Label>
              <Textarea
                id="notes"
                placeholder="Capo 3, fingerstyle intro, vocal harmony on chorus..."
                value={data.notes}
                onChange={(e) => onChange({ notes: e.target.value })}
                rows={3}
              />
            </div>

            {/* Arrangement */}
            <div className="space-y-2">
              <Label htmlFor="arrangement">Arrangement Structure</Label>
              <Textarea
                id="arrangement"
                placeholder="Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus x2"
                value={data.arrangement}
                onChange={(e) => onChange({ arrangement: e.target.value })}
                rows={2}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
