"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem("admin-auth", "true");
      router.push("/admin");
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto text-2xl">
            ⛺
          </div>
          <h1 className="text-xl font-black tracking-tight">MovTeens Admin</h1>
          <p className="text-xs text-muted-foreground">
            Digite a senha para continuar
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="••••••••"
              autoFocus
              className={`w-full bg-background border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/40 transition-all ${
                error
                  ? "border-destructive/60 bg-destructive/5"
                  : "border-border"
              }`}
            />
            {error && (
              <p className="text-xs text-destructive mt-1.5">
                Senha incorreta.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
