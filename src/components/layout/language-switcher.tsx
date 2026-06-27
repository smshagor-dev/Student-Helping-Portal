"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string | null;
}

export function LanguageSwitcher({
  languages,
  currentLanguage,
}: {
  languages: LanguageOption[];
  currentLanguage: string;
}) {
  const [value, setValue] = React.useState(currentLanguage);
  const [saving, setSaving] = React.useState(false);
  const router = useRouter();

  async function onChange(nextValue: string) {
    setValue(nextValue);
    setSaving(true);
    try {
      await fetch("/api/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: nextValue }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Select value={value} onValueChange={onChange} disabled={saving}>
      <SelectTrigger className="w-[122px] h-9">
        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            {language.code.toUpperCase()} - {language.nativeName || language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
