"use client";

import { agent } from "~/_lib/bsky";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        try {
          await agent.login({ identifier, password });
          router.push("/");
        } catch {
          alert("Invalid credentials");
        }
      }}
    >
      <label>
        Username:
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}
