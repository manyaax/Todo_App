"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
  window.location.href = "/dashboard";
}
else {
      alert("Invalid credentials");
    }
  };

 return (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{
      background: "linear-gradient(135deg, #fce7f3, #e0f2fe)",
      fontFamily: "ui-rounded, system-ui",
    }}
  >
    <div className="bg-white p-8 rounded-2xl shadow-xl w-[340px] text-center">
      <h1 className="text-xl font-semibold mb-6">🌸 Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          name="email"
          type="email"
          value={email}
          placeholder="Email"
          required
          className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-300"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          name="password"
          type="password"
          value={password}
          placeholder="Password"
          required
          className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-300"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl text-white font-medium"
          style={{ background: "#f472b6" }}
        >
          Login
        </button>
      </form>

      <p className="text-sm mt-5">
        Don’t have an account?{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          Create account
        </a>
      </p>
    </div>
  </div>
);

}

