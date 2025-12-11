"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, Save, Sparkles, ChevronDown } from "lucide-react";
import type { ArtistDetailData, ArtistFormData } from "./types";

interface ArtistFormProps {
  artist?: ArtistDetailData;
  onSave?: (data: ArtistFormData) => void;
}

export function ArtistForm({ artist, onSave }: ArtistFormProps) {
  const router = useRouter();
  const isNew = !artist;

  const [formData, setFormData] = useState<ArtistFormData>({
    name: artist?.name || "",
    genre: artist?.genre || "",
    era: artist?.era || "",
    description: artist?.description || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      name: "",
      genre: "",
      era: "",
      description: "",
    });
    setErrors({});
  };

  const handleChange = (field: keyof ArtistFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Artist name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAutoFill = async () => {
    if (!formData.name.trim()) {
      setErrors({ name: "Enter an artist name to auto-fill" });
      return;
    }

    setIsAutoFilling(true);
    try {
      const response = await fetch("/api/admin/artists/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
      });

      if (response.ok) {
        const data = await response.json();
        const artistInfo = data.artist;
        setFormData((prev) => ({
          ...prev,
          genre: artistInfo.genre || prev.genre,
          era: artistInfo.era || prev.era,
          description: artistInfo.description || prev.description,
        }));
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || "Failed to auto-fill artist information" });
      }
    } catch (error) {
      console.error("Auto-fill failed:", error);
      setErrors({ submit: "Failed to auto-fill artist information" });
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, continueCreating = false) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        // Custom save handler
        await onSave(formData);
      } else {
        // Default API behavior
        const url = isNew ? "/api/admin/artists" : `/api/admin/artists/${artist.id}`;
        const method = isNew ? "POST" : "PATCH";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to save artist");
        }

        const result = await response.json();
        
        // Navigate based on mode
        if (isNew) {
          if (continueCreating) {
            toast.success("Artist saved successfully");
            // Reset form and stay on create page
            resetForm();
          } else {
            toast.success("Artist created successfully");
            // Navigate to the artist detail page
            router.push(`/admin/artists/${result.artist.id}`);
          }
        } else {
          toast.success("Artist updated successfully");
        }
        // For existing artist edits, no action needed - state is already updated
      }
    } catch (error) {
      console.error("Save failed:", error);
      setErrors({ submit: error instanceof Error ? error.message : "Failed to save artist" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)}>
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? "Create New Artist" : "Edit Artist"}</CardTitle>
          <CardDescription>
            {isNew
              ? "Add a new artist to your repertoire"
              : "Update artist information and metadata"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Artist Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Artist Name <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Frank Sinatra"
                className={errors.name ? "border-red-500" : ""}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAutoFill}
                disabled={isAutoFilling || !formData.name.trim()}
              >
                {isAutoFilling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span className="ml-2 hidden sm:inline">Auto-fill</span>
              </Button>
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={formData.genre}
              onChange={(e) => handleChange("genre", e.target.value)}
              placeholder="e.g., Jazz, Pop, Classical"
            />
          </div>

          {/* Era */}
          <div className="space-y-2">
            <Label htmlFor="era">Era</Label>
            <Input
              id="era"
              value={formData.era}
              onChange={(e) => handleChange("era", e.target.value)}
              placeholder="e.g., 1950s, Modern, Golden Age"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief description of the artist..."
              rows={4}
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-400">
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            
            {isNew ? (
              <div className="flex">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-r-none"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Artist
                    </>
                  )}
                </Button>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      disabled={isSaving}
                      className="rounded-l-none border-l-0 px-2"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as any;
                        formEvent.preventDefault = () => {};
                        handleSubmit(formEvent, true);
                      }}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Create & Continue
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
