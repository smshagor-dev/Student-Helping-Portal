"use client";

import * as React from "react";
import { Mail, MailOpen, Eye } from "lucide-react";
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
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/skeletons";
import { useToast } from "@/components/ui/use-toast";
import { formatDate, cn } from "@/lib/utils";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = React.useState<ContactMessage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [viewing, setViewing] = React.useState<ContactMessage | null>(null);
  const { toast } = useToast();

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch {
      toast({ title: "Failed to load messages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchMessages();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function toggleRead(message: ContactMessage) {
    try {
      const res = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !message.isRead }),
      });
      if (!res.ok) throw new Error("Failed to update message");
      fetchMessages();
    } catch {
      toast({ title: "Failed to update message", variant: "destructive" });
    }
  }

  async function openMessage(message: ContactMessage) {
    setViewing(message);
    if (!message.isRead) {
      await toggleRead(message);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold">Contact Messages</h1>
        <p className="text-sm text-muted-foreground">
          Messages submitted through the public contact form.
        </p>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : messages.length === 0 ? (
        <EmptyState icon={Mail} title="No messages yet" />
      ) : (
        <div className="rounded-lg border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow
                  key={msg.id}
                  className={cn(!msg.isRead && "bg-primary/5")}
                >
                  <TableCell>
                    {msg.isRead ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary" />
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{msg.name}</p>
                    <p className="text-xs text-muted-foreground">{msg.email}</p>
                  </TableCell>
                  <TableCell className="max-w-[280px] truncate">
                    {msg.subject}
                    {!msg.isRead && <Badge variant="accent" className="ml-2 text-xs">New</Badge>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(msg.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openMessage(msg)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DeleteButton
                        endpoint={`/api/admin/messages/${msg.id}`}
                        itemName="message"
                        onDeleted={fetchMessages}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent>
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.subject}</DialogTitle>
              </DialogHeader>
              <div className="text-sm">
                <p>
                  <span className="font-medium">{viewing.name}</span>{" "}
                  <span className="text-muted-foreground">&lt;{viewing.email}&gt;</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(viewing.createdAt)}
                </p>
                <Separator className="my-4" />
                <p className="whitespace-pre-line leading-relaxed">{viewing.message}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
