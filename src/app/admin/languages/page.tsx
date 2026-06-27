"use client";

import * as React from "react";
import { Languages, Loader2, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/skeletons";
import { useToast } from "@/components/ui/use-toast";

interface LanguageRow {
  id: string;
  code: string;
  name: string;
  nativeName: string | null;
  isActive: boolean;
  isDefault: boolean;
  _count?: { translations: number };
}

interface TranslationState {
  language: {
    id: string;
    code: string;
    name: string;
    nativeName: string | null;
  };
  translations: Record<string, string>;
}

const emptyForm = {
  code: "",
  name: "",
  nativeName: "",
  isActive: true,
  isDefault: false,
};

export default function AdminLanguagesPage() {
  const [languages, setLanguages] = React.useState<LanguageRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [translationState, setTranslationState] = React.useState<TranslationState | null>(null);
  const [editing, setEditing] = React.useState<LanguageRow | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [savingTranslations, setSavingTranslations] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);
  const [newTranslationKey, setNewTranslationKey] = React.useState("");
  const [newTranslationValue, setNewTranslationValue] = React.useState("");
  const { toast } = useToast();

  async function fetchLanguages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/languages");
      const data = await res.json();
      setLanguages(data.languages ?? []);
    } catch {
      toast({ title: "Failed to load languages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchLanguages();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(language: LanguageRow) {
    setEditing(language);
    setForm({
      code: language.code,
      name: language.name,
      nativeName: language.nativeName ?? "",
      isActive: language.isActive,
      isDefault: language.isDefault,
    });
    setDialogOpen(true);
  }

  async function openTranslations(language: LanguageRow) {
    try {
      const res = await fetch(`/api/admin/languages/${language.id}/translations`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load translations");
      setTranslationState(data);
      setNewTranslationKey("");
      setNewTranslationValue("");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to load translations",
        variant: "destructive",
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = editing ? `/api/admin/languages/${editing.id}` : "/api/admin/languages";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save language");

      toast({ title: editing ? "Language updated" : "Language created", variant: "success" });
      setDialogOpen(false);
      fetchLanguages();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  async function saveTranslations() {
    if (!translationState) return;
    setSavingTranslations(true);
    try {
      const res = await fetch(`/api/admin/languages/${translationState.language.id}/translations`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ translations: translationState.translations }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save translations");
      toast({ title: "Translations saved", variant: "success" });
      fetchLanguages();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save translations",
        variant: "destructive",
      });
    } finally {
      setSavingTranslations(false);
    }
  }

  function addTranslationKey() {
    const key = newTranslationKey.trim();

    if (!key) {
      toast({ title: "Key is required", variant: "destructive" });
      return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(key)) {
      toast({
        title: "Invalid key",
        description: "Use letters, numbers, dots, underscores, and hyphens only.",
        variant: "destructive",
      });
      return;
    }

    if (translationState?.translations[key] !== undefined) {
      toast({ title: "Key already exists", variant: "destructive" });
      return;
    }

    setTranslationState((state) =>
      state
        ? {
            ...state,
            translations: {
              ...state.translations,
              [key]: newTranslationValue,
            },
          }
        : state
    );
    setNewTranslationKey("");
    setNewTranslationValue("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Languages</h1>
          <p className="text-sm text-muted-foreground">
            Add a language with New Language, then use Translation Keys to add or edit UI text.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Language
        </Button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : languages.length === 0 ? (
        <EmptyState
          icon={Languages}
          title="No languages yet"
          description="Create your first language to enable the header switcher."
          action={<Button onClick={openCreate}>Create Language</Button>}
        />
      ) : (
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Language</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Translations</TableHead>
                <TableHead className="w-44">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {languages.map((language) => (
                <TableRow key={language.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{language.name}</p>
                      {language.nativeName && (
                        <p className="text-xs text-muted-foreground">{language.nativeName}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="uppercase">{language.code}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={language.isActive ? "success" : "secondary"}>
                        {language.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {language.isDefault && <Badge variant="accent">Default</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>{language._count?.translations ?? 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => openTranslations(language)}>
                        Translation Keys
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(language)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteButton
                        endpoint={`/api/admin/languages/${language.id}`}
                        itemName="language"
                        onDeleted={fetchLanguages}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Language" : "New Language"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  required
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toLowerCase() }))}
                  placeholder="en"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="English"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nativeName">Native Name</Label>
              <Input
                id="nativeName"
                value={form.nativeName}
                onChange={(e) => setForm((f) => ({ ...f, nativeName: e.target.value }))}
                placeholder="বাংলা"
              />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-xs text-muted-foreground">Show this language in the user header dropdown.</p>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, isActive: checked }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="text-sm font-medium">Default Language</p>
                <p className="text-xs text-muted-foreground">Used when a user has not selected any language yet.</p>
              </div>
              <Switch
                checked={form.isDefault}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, isDefault: checked }))}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "Save Changes" : "Create Language"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!translationState} onOpenChange={(open) => !open && setTranslationState(null)}>
        <DialogContent className="max-w-4xl">
          {translationState && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Translation Keys: {translationState.language.name} ({translationState.language.code})
                </DialogTitle>
              </DialogHeader>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Edit translation values</CardTitle>
                  <CardDescription>
                    Add custom keys here, then save translations. New keys appear in the app when the UI uses that key.
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[60vh] overflow-y-auto space-y-4">
                  <div className="rounded-md border p-3">
                    <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                      <div className="space-y-1.5">
                        <Label htmlFor="newTranslationKey">New Key</Label>
                        <Input
                          id="newTranslationKey"
                          value={newTranslationKey}
                          onChange={(e) => setNewTranslationKey(e.target.value)}
                          placeholder="section.label"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="newTranslationValue">Value</Label>
                        <Input
                          id="newTranslationValue"
                          value={newTranslationValue}
                          onChange={(e) => setNewTranslationValue(e.target.value)}
                          placeholder="Translation value"
                        />
                      </div>
                      <Button type="button" className="self-end" onClick={addTranslationKey}>
                        <Plus className="h-4 w-4" /> Add Key
                      </Button>
                    </div>
                  </div>
                  {Object.entries(translationState.translations).map(([key, value]) => (
                    <div key={key} className="space-y-1.5">
                      <Label htmlFor={key} className="font-mono text-xs">
                        {key}
                      </Label>
                      {value.length > 80 ? (
                        <Textarea
                          id={key}
                          rows={3}
                          value={value}
                          onChange={(e) =>
                            setTranslationState((state) =>
                              state
                                ? {
                                    ...state,
                                    translations: {
                                      ...state.translations,
                                      [key]: e.target.value,
                                    },
                                  }
                                : state
                            )
                          }
                        />
                      ) : (
                        <Input
                          id={key}
                          value={value}
                          onChange={(e) =>
                            setTranslationState((state) =>
                              state
                                ? {
                                    ...state,
                                    translations: {
                                      ...state.translations,
                                      [key]: e.target.value,
                                    },
                                  }
                                : state
                            )
                          }
                        />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
              <DialogFooter>
                <Button onClick={saveTranslations} disabled={savingTranslations}>
                  {savingTranslations && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Translations
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
