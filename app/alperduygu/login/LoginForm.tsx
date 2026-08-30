"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/i18n";
import AdminLangSwitcher from "@/components/AdminLangSwitcher";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const a = t.admin;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/alperduygu/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : a.loginFailed);
        return;
      }
      const from = searchParams.get("from");
      router.push(from && from.startsWith("/alperduygu") ? from : "/alperduygu");
      router.refresh();
    } catch {
      setError(a.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper-cream flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-6">
          <AdminLangSwitcher />
        </div>
        <div className="text-center mb-10">
          <p className="font-[family-name:var(--font-serif)] text-2xl text-warm mb-2">
            D &amp; A
          </p>
          <h1 className="font-[family-name:var(--font-serif)] text-xl text-warm">
            {a.loginTitle}
          </h1>
          <p className="text-sm text-warm-light mt-2">{a.loginSubtitle}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-paper-white rounded-2xl shadow-sm border border-cream-dark p-8 space-y-5"
        >
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="admin-user"
              className="block text-sm text-warm-light mb-1.5"
            >
              {a.usernameLabel}
            </label>
            <input
              id="admin-user"
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-paper-cream focus:outline-none focus:ring-2 focus:ring-rose/40"
              required
            />
          </div>

          <div>
            <label
              htmlFor="admin-pass"
              className="block text-sm text-warm-light mb-1.5"
            >
              {a.passwordLabel}
            </label>
            <input
              id="admin-pass"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-paper-cream focus:outline-none focus:ring-2 focus:ring-rose/40"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-rose text-white font-medium hover:bg-rose-dark transition-colors disabled:opacity-60"
          >
            {loading ? a.loginLoading : a.loginButton}
          </button>
        </form>

        <p className="text-center mt-8">
          <Link
            href="/"
            className="text-sm text-rose hover:text-rose-dark underline underline-offset-4"
          >
            {a.backHome}
          </Link>
        </p>
      </div>
    </div>
  );
}
