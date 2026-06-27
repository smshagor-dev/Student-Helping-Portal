"use client";

import * as React from "react";
import { Plus, ClipboardList, Loader2, Pencil } from "lucide-react";
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
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/skeletons";
import { useToast } from "@/components/ui/use-toast";
import { formatDateShort } from "@/lib/utils";

interface Option {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
  departmentId: string;
}

interface Exam {
  id: string;
  title: string;
  departmentId: string | null;
  subjectId: string | null;
  examDate: string;
  startTime: string;
  endTime: string;
  room: string | null;
  description: string | null;
  department: Option | null;
  subject: Option | null;
}

function toDateInputValue(date: string) {
  return new Date(date).toISOString().slice(0, 10);
}

const emptyForm = {
  title: "",
  departmentId: "",
  subjectId: "",
  examDate: "",
  startTime: "",
  endTime: "",
  room: "",
  description: "",
};

export default function AdminExamsPage() {
  const [exams, setExams] = React.useState<Exam[]>([]);
  const [departments, setDepartments] = React.useState<Option[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Exam | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);
  const { toast } = useToast();

  async function fetchData() {
    setLoading(true);
    try {
      const [examRes, deptRes, subRes] = await Promise.all([
        fetch("/api/admin/exams"),
        fetch("/api/admin/departments"),
        fetch("/api/admin/subjects"),
      ]);
      const examData = await examRes.json();
      const deptData = await deptRes.json();
      const subData = await subRes.json();
      setExams(examData.exams ?? []);
      setDepartments(deptData.departments ?? []);
      setSubjects(subData.subjects ?? []);
    } catch {
      toast({ title: "Failed to load exam schedule", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredSubjects = React.useMemo(
    () => subjects.filter((s) => !form.departmentId || s.departmentId === form.departmentId),
    [subjects, form.departmentId]
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(exam: Exam) {
    setEditing(exam);
    setForm({
      title: exam.title,
      departmentId: exam.departmentId ?? "",
      subjectId: exam.subjectId ?? "",
      examDate: toDateInputValue(exam.examDate),
      startTime: exam.startTime,
      endTime: exam.endTime,
      room: exam.room ?? "",
      description: exam.description ?? "",
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const endpoint = editing ? `/api/admin/exams/${editing.id}` : "/api/admin/exams";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save exam schedule");

      toast({ title: editing ? "Exam updated" : "Exam scheduled", variant: "success" });
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
          <h1 className="font-display text-2xl font-semibold">Exam Schedule</h1>
          <p className="text-sm text-muted-foreground">
            Manage upcoming exam dates, times, and rooms by department and subject.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New Exam
        </Button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : exams.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No exams scheduled"
          description="Add upcoming exam dates for students."
          action={<Button onClick={openCreate}>Schedule Exam</Button>}
        />
      ) : (
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department / Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.title}</TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      {exam.department && (
                        <Badge variant="secondary" className="font-normal">{exam.department.name}</Badge>
                      )}
                      {exam.subject && (
                        <Badge variant="outline" className="font-normal">{exam.subject.name}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateShort(exam.examDate)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {exam.startTime} - {exam.endTime}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(exam)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <DeleteButton
                        endpoint={`/api/admin/exams/${exam.id}`}
                        itemName="exam schedule"
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
            <DialogTitle>{editing ? "Edit Exam Schedule" : "New Exam Schedule"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Midterm Examination"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="department">Department (optional)</Label>
                <Select
                  value={form.departmentId || "none"}
                  onValueChange={(value) =>
                    setForm((f) => ({ ...f, departmentId: value === "none" ? "" : value, subjectId: "" }))
                  }
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
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject (optional)</Label>
                <Select
                  value={form.subjectId || "none"}
                  onValueChange={(value) => setForm((f) => ({ ...f, subjectId: value === "none" ? "" : value }))}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {filteredSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="examDate">Exam Date</Label>
                <Input
                  id="examDate"
                  type="date"
                  required
                  value={form.examDate}
                  onChange={(e) => setForm((f) => ({ ...f, examDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  required
                  value={form.startTime}
                  onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  required
                  value={form.endTime}
                  onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="room">Room (optional)</Label>
              <Input
                id="room"
                value={form.room}
                onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
                placeholder="e.g. Room 204"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? "Save Changes" : "Schedule Exam"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
