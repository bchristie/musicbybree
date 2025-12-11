"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RepertoireForm } from "./RepertoireForm";
import { RepertoireStats } from "./RepertoireStats";
import type { RepertoireEntryData, RepertoireFormData } from "./types";
import type { RepertoireStatus } from "@prisma/client";

interface RepertoireManagerProps {
  songId: string;
  songTitle: string;
  originalKey: string | null;
  tempo: number | null;
  repertoireEntry: RepertoireEntryData | null;
}

const STATUS_LABELS: Record<RepertoireStatus, string> = {
  LEARNING: "Learning",
  READY: "Ready",
  FEATURED: "Featured",
  ARCHIVED: "Archived",
};

const STATUS_COLORS: Record<RepertoireStatus, string> = {
  LEARNING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  READY: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  FEATURED: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  ARCHIVED: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400",
};

export function RepertoireManager({
  songId,
  songTitle,
  originalKey,
  tempo,
  repertoireEntry,
}: RepertoireManagerProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [isPracticing, setIsPracticing] = useState(false);

  const [formData, setFormData] = useState<RepertoireFormData>(() => {
    if (repertoireEntry) {
      return {
        status: repertoireEntry.status,
        performedKey: repertoireEntry.performedKey || originalKey || "",
        performedTempo: repertoireEntry.performedTempo,
        capoPosition: repertoireEntry.capoPosition,
        typicalDuration: repertoireEntry.typicalDuration,
        difficulty: repertoireEntry.difficulty,
        vocallyDemanding: repertoireEntry.vocallyDemanding,
        energyLevel: repertoireEntry.energyLevel,
        worksWellFor: repertoireEntry.worksWellFor || "",
        avoidAfter: repertoireEntry.avoidAfter || "",
        notes: repertoireEntry.notes || "",
        arrangement: repertoireEntry.arrangement || "",
      };
    }
    return {
      status: "LEARNING",
      performedKey: originalKey || "",
      performedTempo: tempo,
      capoPosition: null,
      typicalDuration: null,
      difficulty: null,
      vocallyDemanding: false,
      energyLevel: null,
      worksWellFor: "",
      avoidAfter: "",
      notes: "",
      arrangement: "",
    };
  });

  const updateRepertoire = useCallback(async (updates: Partial<RepertoireFormData>) => {
    try {
      const response = await fetch(`/api/admin/songs/${songId}/repertoire`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update repertoire");
      }

      return true;
    } catch (error) {
      toast.error("Failed to update repertoire");
      return false;
    }
  }, [songId]);

  const handleAddToRepertoire = async () => {
    setIsAdding(true);
    try {
      const response = await fetch(`/api/admin/songs/${songId}/repertoire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "LEARNING",
          performedKey: originalKey,
          performedTempo: tempo,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to repertoire");
      }

      toast.success(`Added "${songTitle}" to repertoire`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to add to repertoire");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFromRepertoire = async () => {
    setIsRemoving(true);
    try {
      const response = await fetch(`/api/admin/songs/${songId}/repertoire`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove from repertoire");
      }

      toast.success(`Removed "${songTitle}" from repertoire`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to remove from repertoire");
    } finally {
      setIsRemoving(false);
      setShowRemoveDialog(false);
    }
  };

  const handleLogPractice = async () => {
    setIsPracticing(true);
    try {
      const response = await fetch(`/api/admin/songs/${songId}/repertoire`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logPractice: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to log practice");
      }

      toast.success("Practice session logged");
    } catch (error) {
      toast.error("Failed to log practice");
    } finally {
      setIsPracticing(false);
    }
  };

  const handleStatusChange = async (status: RepertoireStatus) => {
    setFormData(prev => ({ ...prev, status }));
    const success = await updateRepertoire({ status });
    if (success) {
      toast.success(`Status updated to ${STATUS_LABELS[status]}`);
    }
  };

  const handleFormChange = useCallback((updates: Partial<RepertoireFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Debounced auto-save
    updateRepertoire(updates);
  }, [updateRepertoire]);

  // Not in repertoire
  if (!repertoireEntry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Repertoire
          </CardTitle>
          <CardDescription>
            Add this song to your active repertoire to track practice and performances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAddToRepertoire} disabled={isAdding}>
            <Plus className="h-4 w-4 mr-2" />
            {isAdding ? "Adding..." : "Add to Repertoire"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // In repertoire
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Repertoire
              </CardTitle>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[formData.status]}`}>
                {STATUS_LABELS[formData.status]}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <Select
                value={formData.status}
                onValueChange={(value) => handleStatusChange(value as RepertoireStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEARNING">Learning</SelectItem>
                  <SelectItem value="READY">Ready</SelectItem>
                  <SelectItem value="FEATURED">Featured</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogPractice}
              disabled={isPracticing}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {isPracticing ? "Logging..." : "Log Practice"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRemoveDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </div>

          {/* Stats */}
          <RepertoireStats repertoire={repertoireEntry} />

          {/* Editable Form */}
          <RepertoireForm
            data={formData}
            onChange={handleFormChange}
            defaultKey={originalKey}
            defaultTempo={tempo}
          />
        </CardContent>
      </Card>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Repertoire?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove "{songTitle}" from your active repertoire. The song will remain in your database, but all repertoire data (practice counts, notes, etc.) will be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveFromRepertoire}
              disabled={isRemoving}
              className="bg-red-600 hover:bg-red-700"
            >
              {isRemoving ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
