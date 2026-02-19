"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Account created! Please login.");
      router.push("/login");
    } else {
      alert("User already exists");
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
      <h1 className="text-xl font-semibold mb-6">🌸 Signup</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          required
          className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-300"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          required
          className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-300"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          required
          className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-pink-300"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl text-white font-medium"
          style={{ background: "#f472b6" }}
        >
          Create Account
        </button>
      </form>

      <p className="text-sm mt-5">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          Login
        </a>
      </p>
    </div>
  </div>
);

}
