import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Todo from "@/models/Todo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function parseDate(text: string) {
  const lower = text.toLowerCase();

  const today = new Date();

  if (lower.includes("today")) {
    return today;
  }

  if (lower.includes("tomorrow")) {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t;
  }

  // dd-mm-yyyy or dd/mm/yyyy
  const match = text.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
  if (match) {
    const [_, d, m, y] = match;
    return new Date(`${y}-${m}-${d}`);
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const { message, task, step } = await req.json();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({
        reply: "Please login first 🔐",
      });
    }

    await connectDB();

    // 🧠 STEP 2: user replying with date
    if (step === "date" && task) {
      let parsedDate = parseDate(message);

      if (!parsedDate) {
        return NextResponse.json({
          reply: "Please enter valid date (today, tomorrow or dd-mm-yyyy) ❌",
        });
      }

      const cleanDate = new Date(parsedDate);
      cleanDate.setUTCHours(0, 0, 0, 0);

      await Todo.create({
        text: task,
        date: cleanDate,
        userId: session.user?.email,
      });

      return NextResponse.json({
        reply: `Task "${task}" added for ${cleanDate.toDateString()} ✅`,
      });
    }

    // 🧠 STEP 1: user sends full sentence
    if (message.toLowerCase().includes("add")) {
      let text = message.replace("add", "").trim();

      const parsedDate = parseDate(text);

      // remove date words from task
      text = text
        .replace("today", "")
        .replace("tomorrow", "")
        .replace(/\d{1,2}[\/-]\d{1,2}[\/-]\d{4}/, "")
        .trim();

      const newTask = text;

      // ❌ no date → ask user
      if (!parsedDate) {
        return NextResponse.json({
          reply: "For which date? 📅 (today, tomorrow or dd-mm-yyyy)",
          askDate: true,
          task: newTask,
        });
      }

      const cleanDate = new Date(parsedDate);
      cleanDate.setHours(0, 0, 0, 0);

      await Todo.create({
        text: newTask,
        date: cleanDate,
        userId: session.user?.email,
      });

      return NextResponse.json({
        reply: `Task "${newTask}" added for ${cleanDate.toDateString()} ✅`,
      });
    }

    return NextResponse.json({
      reply: "Try: Add meeting today 📅",
    });

  } catch (error: any) {
    console.log("CHAT ERROR:", error);
    return NextResponse.json({
      reply: "Something went wrong ❌",
    });
  }
}