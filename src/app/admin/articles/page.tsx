"use client";

import * as React from "react";
import { Plus, Newspaper, Loader2, Pencil } from "lucide-react";
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

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string | null;
  status: string;
  viewCount: number;
  categoryId: string | null;
}

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  thumbnailUrl: "",
  status: "DRAFT",
  categoryId: "",
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [categories, setCategories] = React.useState<Option[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Article | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);
  const { toast } = useToast();

  async function fetchData() {
    setLoading(true);
    try {
      const [artRes, catRes] = await Promise.all([
        fetch("/api/admin/articles"),
        fetch("/api/admin/categories"),
      ]);
      const artData = await artRes.json();
      const catData = await catRes.json();
      setArticles(artData.articles ?? []);
      setCategories((catData.categories ?? []).filter((c: { type: string }) => c.type === "ARTICLE"));
    } catch {
      toast({ title: "Failed to load articles", variant: "destructive" });
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

  function openEdit(article: Article) {
    setEditing(article);
    setForm({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      thumbnailUrl: article.thumbnailUrl ?? "",
      status: article.status,
      categoryId: article.categoryId ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = editing ? `/api/admin/articles/${editing.id}` : "/api/admin/articles";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save article");

      toast({ title: editing ? "Article updated" : "Article created", variant: "success" });
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
          <h1 className="font-display text-2xl font-semibold">Articles</h1>
          <p className="text-sm text-muted-foreground">
            Publish study tips, technology, programming, and research articles.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Article
        </Button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : articles.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No articles yet"
          description="Publish your first article for students."
          action={<Button onClick={openCreate}>Create Article</Button>}
        />
      ) : (
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium max-w-[320px] truncate">{article.title}</TableCell>
                  <TableCell>
                    <StatusBadge status={article.status as "DRAFT" | "PUBLISHED" | "ARCHIVED"} />
                  </TableCell>
                  <TableCell>{article.viewCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(article)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteButton
                        endpoint={`/api/admin/articles/${article.id}`}
                        itemName="article"
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
            <DialogTitle>{editing ? "Edit Article" : "New Article"}</DialogTitle>
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
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                required
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="A short summary shown in article previews"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                required
                rows={6}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              />
            </div>
            <FileUploadField
              id="thumbnailUrl"
              label="Thumbnail"
              value={form.thumbnailUrl}
              onChange={(value) => setForm((f) => ({ ...f, thumbnailUrl: value }))}
              accept="image/*"
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
                {editing ? "Save Changes" : "Create Article"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
