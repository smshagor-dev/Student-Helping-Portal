"use client";

import * as React from "react";
import { Plus, FileText, Loader2, Pencil, Star } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { slugifyText } from "@/lib/utils";
import { resourceTypeMeta } from "@/lib/content-meta";

interface Option {
  id: string;
  name: string;
}

interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  resourceType: string;
  fileUrl: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  isFeatured: boolean;
  status: string;
  viewCount: number;
  downloadCount: number;
  categoryId: string | null;
  departmentId: string | null;
  category: Option | null;
  department: Option | null;
}

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  resourceType: "NOTES",
  fileUrl: "",
  videoUrl: "",
  thumbnailUrl: "",
  isFeatured: false,
  status: "DRAFT",
  categoryId: "",
  departmentId: "",
};

export default function AdminResourcesPage() {
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [categories, setCategories] = React.useState<Option[]>([]);
  const [departments, setDepartments] = React.useState<Option[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Resource | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);
  const { toast } = useToast();

  async function fetchData() {
    setLoading(true);
    try {
      const [resRes, catRes, deptRes] = await Promise.all([
        fetch("/api/admin/resources"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/departments"),
      ]);
      const resData = await resRes.json();
      const catData = await catRes.json();
      const deptData = await deptRes.json();
      setResources(resData.resources ?? []);
      setCategories((catData.categories ?? []).filter((c: { type: string }) => c.type === "RESOURCE"));
      setDepartments(deptData.departments ?? []);
    } catch {
      toast({ title: "Failed to load resources", variant: "destructive" });
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

  function openEdit(resource: Resource) {
    setEditing(resource);
    setForm({
      title: resource.title,
      slug: resource.slug,
      description: resource.description,
      resourceType: resource.resourceType,
      fileUrl: resource.fileUrl ?? "",
      videoUrl: resource.videoUrl ?? "",
      thumbnailUrl: resource.thumbnailUrl ?? "",
      isFeatured: resource.isFeatured,
      status: resource.status,
      categoryId: resource.categoryId ?? "",
      departmentId: resource.departmentId ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = editing ? `/api/admin/resources/${editing.id}` : "/api/admin/resources";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save resource");

      toast({ title: editing ? "Resource updated" : "Resource created", variant: "success" });
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
          <h1 className="font-display text-2xl font-semibold">Resources</h1>
          <p className="text-sm text-muted-foreground">
            Manage study notes, books, previous questions, assignments, and video tutorials.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Resource
        </Button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : resources.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No resources yet"
          description="Add your first study resource for students."
          action={<Button onClick={openCreate}>Create Resource</Button>}
        />
      ) : (
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium max-w-[280px]">
                    <div className="flex items-center gap-1.5">
                      {resource.isFeatured && <Star className="h-3.5 w-3.5 text-accent shrink-0" />}
                      <span className="truncate">{resource.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {resourceTypeMeta[resource.resourceType as keyof typeof resourceTypeMeta]?.label ?? resource.resourceType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={resource.status as "DRAFT" | "PUBLISHED" | "ARCHIVED"} />
                  </TableCell>
                  <TableCell>{resource.viewCount}</TableCell>
                  <TableCell>{resource.downloadCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(resource)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteButton
                        endpoint={`/api/admin/resources/${resource.id}`}
                        itemName="resource"
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
            <DialogTitle>{editing ? "Edit Resource" : "New Resource"}</DialogTitle>
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
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="resourceType">Resource Type</Label>
                <Select
                  value={form.resourceType}
                  onValueChange={(value) => setForm((f) => ({ ...f, resourceType: value }))}
                >
                  <SelectTrigger id="resourceType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(resourceTypeMeta).map(([key, meta]) => (
                      <SelectItem key={key} value={key}>
                        {meta.label}
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
              <div className="space-y-1.5">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={form.departmentId || "none"}
                  onValueChange={(value) => setForm((f) => ({ ...f, departmentId: value === "none" ? "" : value }))}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fileUrl">File URL</Label>
              <Input
                id="fileUrl"
                type="url"
                value={form.fileUrl}
                onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                type="url"
                value={form.videoUrl}
                onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
              <Input
                id="thumbnailUrl"
                type="url"
                value={form.thumbnailUrl}
                onChange={(e) => setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isFeatured"
                checked={form.isFeatured}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, isFeatured: !!checked }))}
              />
              <Label htmlFor="isFeatured" className="cursor-pointer">
                Mark as featured
              </Label>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "Save Changes" : "Create Resource"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
