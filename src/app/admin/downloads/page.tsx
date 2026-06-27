"use client";

import * as React from "react";
import { Plus, Download as DownloadIcon, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { FileUploadField } from "@/components/shared/file-upload-field";
import { TableSkeleton } from "@/components/shared/skeletons";
import { useToast } from "@/components/ui/use-toast";
import { slugifyText } from "@/lib/utils";

interface Option {
  id: string;
  name: string;
}

interface DownloadItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  fileUrl: string;
  downloadCount: number;
  status: string;
  categoryId: string | null;
}

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  fileUrl: "",
  status: "DRAFT",
  categoryId: "",
};

export default function AdminDownloadsPage() {
  const [downloads, setDownloads] = React.useState<DownloadItem[]>([]);
  const [categories, setCategories] = React.useState<Option[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<DownloadItem | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);
  const { toast } = useToast();

  async function fetchData() {
    setLoading(true);
    try {
      const [dlRes, catRes] = await Promise.all([
        fetch("/api/admin/downloads"),
        fetch("/api/admin/categories"),
      ]);
      const dlData = await dlRes.json();
      const catData = await catRes.json();
      setDownloads(dlData.downloads ?? []);
      setCategories((catData.categories ?? []).filter((c: { type: string }) => c.type === "DOWNLOAD"));
    } catch {
      toast({ title: "Failed to load downloads", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(item: DownloadItem) {
    setEditing(item);
    setForm({
      title: item.title,
      slug: item.slug,
      description: item.description,
      fileUrl: item.fileUrl,
      status: item.status,
      categoryId: item.categoryId ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = editing ? `/api/admin/downloads/${editing.id}` : "/api/admin/downloads";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save download");

      toast({ title: editing ? "Download updated" : "Download created", variant: "success" });
      setDialogOpen(false);
      fetchData();
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">Downloads</h1>
          <p className="text-sm text-muted-foreground">
            Manage forms, syllabus, templates, and important documents.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Download
        </Button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : downloads.length === 0 ? (
        <EmptyState
          icon={DownloadIcon}
          title="No downloads yet"
          description="Add your first downloadable document."
          action={<Button onClick={openCreate}>Create Download</Button>}
        />
      ) : (
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {downloads.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-[320px] truncate">{item.title}</TableCell>
                  <TableCell>
                    <StatusBadge status={item.status as "DRAFT" | "PUBLISHED" | "ARCHIVED"} />
                  </TableCell>
                  <TableCell>{item.downloadCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteButton
                        endpoint={`/api/admin/downloads/${item.id}`}
                        itemName="download"
                        onDeleted={fetchData}
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
            <DialogTitle>{editing ? "Edit Download" : "New Download"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({ ...f, title, slug: editing ? f.slug : slugifyText(title) }));
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <FileUploadField
              id="fileUrl"
              label="File"
              value={form.fileUrl}
              onChange={(value) => setForm((f) => ({ ...f, fileUrl: value }))}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm((f) => ({ ...f, status: value }))}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={form.categoryId || "none"}
                  onValueChange={(value) => setForm((f) => ({ ...f, categoryId: value === "none" ? "" : value }))}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "Save Changes" : "Create Download"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
