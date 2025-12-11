import type { RepertoireStatus } from "@prisma/client";

export type RepertoireEntryData = {
  id: string;
  songId: string;
  status: RepertoireStatus;
  performedKey: string | null;
  performedTempo: number | null;
  capoPosition: number | null;
  typicalDuration: number | null;
  difficulty: number | null;
  vocallyDemanding: boolean;
  energyLevel: number | null;
  worksWellFor: string | null;
  avoidAfter: string | null;
  notes: string | null;
  arrangement: string | null;
  addedAt: Date;
  lastPracticed: Date | null;
  lastPerformed: Date | null;
  practiceCount: number;
  performanceCount: number;
};

export type RepertoireFormData = {
  status: RepertoireStatus;
  performedKey: string;
  performedTempo: number | null;
  capoPosition: number | null;
  typicalDuration: number | null;
  difficulty: number | null;
  vocallyDemanding: boolean;
  energyLevel: number | null;
  worksWellFor: string;
  avoidAfter: string;
  notes: string;
  arrangement: string;
};
