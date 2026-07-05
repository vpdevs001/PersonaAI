"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { PERSONAS } from "@/constants";
import { PersonaAvatar } from "@/features/chat/components/PersonaAvatar";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const onDone = () => {
      setLoading(false);
      router.push("/");
      router.refresh();
    };
    const onFail = (message?: string) => {
      setLoading(false);
      setError(message || "Something went wrong. Please try again.");
    };

    if (mode === "signup") {
      await authClient.signUp.email(
        { email, password, name: name || email.split("@")[0] },
        { onSuccess: onDone, onError: (ctx) => onFail(ctx.error.message) },
      );
    } else {
      await authClient.signIn.email(
        { email, password },
        { onSuccess: onDone, onError: (ctx) => onFail(ctx.error.message) },
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-10 text-[#f7f2eb]">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex -space-x-3">
            {PERSONAS.map((persona) => (
              <PersonaAvatar key={persona.id} persona={persona} size={48} />
            ))}
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#ff7a1a]">Persona AI</p>
          <h1 className="mt-1 text-2xl font-semibold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-[#8f857d]">
            Chat with Hitesh &amp; Piyush, in their own voice.
          </p>
        </div>

        <div className="mb-6 flex rounded-full border border-orange-500/20 bg-[#0d0d0d] p-1">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
              mode === "signin" ? "bg-[#ff7a1a] text-black" : "text-[#8f857d]"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
              mode === "signup" ? "bg-[#ff7a1a] text-black" : "text-[#8f857d]"
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border border-orange-500/20 bg-[#111111] px-4 py-3 text-sm text-[#f7f2eb] outline-none placeholder:text-[#7c736b] focus:border-orange-500/50"
            />
          )}
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-orange-500/20 bg-[#111111] px-4 py-3 text-sm text-[#f7f2eb] outline-none placeholder:text-[#7c736b] focus:border-orange-500/50"
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-orange-500/20 bg-[#111111] px-4 py-3 text-sm text-[#f7f2eb] outline-none placeholder:text-[#7c736b] focus:border-orange-500/50"
          />

          {error && <p className="text-center text-xs text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-[#ff7a1a] py-3 text-sm font-semibold text-black transition hover:bg-[#ff9a3c] disabled:opacity-50"
          >
            {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
