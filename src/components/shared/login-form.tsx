"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const demoAccounts = [
  {
    label: "Admin Demo",
    email: "admin@studentportal.com",
    password: "admin123456",
  },
  {
    label: "Student Demo",
    email: "student@studentportal.com",
    password: "student123456",
  },
];

interface AuthLabels {
  welcomeBack: string;
  loginDescription: string;
  invalidCredentials: string;
  genericError: string;
  email: string;
  password: string;
  login: string;
  noAccount: string;
  signup: string;
  demoCredentials: string;
  use: string;
}

export function LoginForm({ labels }: { labels: AuthLabels }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ email: "", password: "" });
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin" || result.error === "CallbackRouteError") {
          setError(labels.invalidCredentials);
        } else {
          setError(result.error);
        }
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError(labels.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="font-display text-2xl">{labels.welcomeBack}</CardTitle>
        <CardDescription>{labels.loginDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">{labels.email}</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{labels.password}</Label>
            <Input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            {labels.login}
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          {labels.noAccount}{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            {labels.signup}
          </Link>
        </p>

        <div className="mt-5 rounded-lg border bg-secondary/40 p-4">
          <p className="text-sm font-medium">{labels.demoCredentials}</p>
          <div className="mt-3 space-y-3">
            {demoAccounts.map((account) => (
              <div key={account.email} className="rounded-md bg-background p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{account.label}</p>
                    <p className="text-muted-foreground">{account.email}</p>
                    <p className="text-muted-foreground">Password: {account.password}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setForm({ email: account.email, password: account.password })}
                  >
                    {labels.use}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
