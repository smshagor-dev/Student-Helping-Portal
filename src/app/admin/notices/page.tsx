"use client";

import * as React from "react";
import { Plus, Bell, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { TableSkeleton } from "@/components/shared/skeletons";
import { useToast } from "@/components/ui/use-toast";
import { slugifyText, formatDateShort } from "@/lib/utils";
import { noticeTypeLabel } from "@/lib/content-meta";

interface Option {
  id: string;
  name: string;
}

interface Notice {
  id: string;
  title: string;
  slug: string;
  content: string;
  noticeType: string;
  publishDate: string;
  expiryDate: string | null;
  status: string;
  categoryId: string | null;
}

function toDateInputValue(date: string | null) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

const emptyForm = {
  title: "",
  slug: "",
  content: "",
  noticeType: "GENERAL",
  publishDate: new Date().toISOString().slice(0, 10),
  expiryDate: "",
  status: "DRAFT",
  categoryId: "",
};

export default function AdminNoticesPage() {
  const [notices, setNotices] = React.useState<Notice[]>([]);
  const [categories, setCategories] = React.useState<Option[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Notice | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);
  const { toast } = useToast();

  async function fetchData() {
    setLoading(true);
    try {
      const [noticeRes, catRes] = await Promise.all([
        fetch("/api/admin/notices"),
        fetch("/api/admin/categories"),
      ]);
      const noticeData = await noticeRes.json();
      const catData = await catRes.json();
      setNotices(noticeData.notices ?? []);
      setCategories((catData.categories ?? []).filter((c: { type: string }) => c.type === "NOTICE"));
    } catch {
      toast({ title: "Failed to load notices", variant: "destructive" });
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

  function openEdit(notice: Notice) {
    setEditing(notice);
    setForm({
      title: notice.title,
      slug: notice.slug,
      content: notice.content,
      noticeType: notice.noticeType,
      publishDate: toDateInputValue(notice.publishDate),
      expiryDate: toDateInputValue(notice.expiryDate),
      status: notice.status,
      categoryId: notice.categoryId ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = editing ? `/api/admin/notices/${editing.id}` : "/api/admin/notices";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save notice");

      toast({ title: editing ? "Notice updated" : "Notice created", variant: "success" });
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
          <h1 className="font-display text-2xl font-semibold">Notices</h1>
          <p className="text-sm text-muted-foreground">
            Publish university, exam, scholarship, and general notices.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Notice
        </Button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : notices.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notices yet"
          description="Publish your first notice for students."
          action={<Button onClick={openCreate}>Create Notice</Button>}
        />
      ) : (
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell className="font-medium max-w-[280px] truncate">{notice.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {noticeTypeLabel[notice.noticeType as keyof typeof noticeTypeLabel] ?? notice.noticeType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={notice.status as "DRAFT" | "PUBLISHED" | "ARCHIVED"} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateShort(notice.publishDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(notice)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteButton
                        endpoint={`/api/admin/notices/${notice.id}`}
                        itemName="notice"
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
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Notice" : "New Notice"}</DialogTitle>
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
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                required
                rows={5}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="noticeType">Notice Type</Label>
                <Select
                  value={form.noticeType}
                  onValueChange={(value) => setForm((f) => ({ ...f, noticeType: value }))}
                >
                  <SelectTrigger id="noticeType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(noticeTypeLabel).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  type="date"
                  required
                  value={form.publishDate}
                  onChange={(e) => setForm((f) => ({ ...f, publishDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="expiryDate">Expiry Date (optional)</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category (optional)</Label>
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

            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "Save Changes" : "Create Notice"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
