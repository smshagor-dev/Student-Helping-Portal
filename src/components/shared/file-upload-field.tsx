"use client";

import * as React from "react";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function FileUploadField({
  id,
  label,
  value,
  onChange,
  accept,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  required?: boolean;
}) {
  const [uploading, setUploading] = React.useState(false);
  const { toast } = useToast();
  const isImage = /\.(gif|jpe?g|png|webp)$/i.test(value);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload file");

      onChange(data.url);
      toast({ title: "File uploaded", variant: "success" });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          type="file"
          accept={accept}
          required={required && !value}
          disabled={uploading}
          onChange={handleFileChange}
        />
        {value && (
          <Button type="button" variant="outline" size="icon" onClick={() => onChange("")} disabled={uploading}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex min-h-5 items-center gap-2 text-xs text-muted-foreground">
        {uploading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Uploading...
          </>
        ) : value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="truncate text-primary hover:underline">
            {value}
          </a>
        ) : (
          <span>
            <Upload className="mr-1 inline h-3.5 w-3.5" />
            Choose a file to upload.
          </span>
        )}
      </div>
      {isImage && (
        <div className="overflow-hidden rounded-md border bg-secondary">
          <img src={value} alt={label} className="h-32 w-full object-cover" />
        </div>
      )}
    </div>
  );
}
