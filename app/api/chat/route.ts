import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Todo from "@/models/Todo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 🔥 STEP 2: helper functions
function extractTask(message: string) {
  let task = message
    .replace(/add|create|task|todo|i want to|please/gi, "")
    .replace(/today|tomorrow|\d{1,2}[\/-]\d{1,2}[\/-]\d{4}/gi, "")
    .trim();

  return task;
}

function extractDate(message: string) {
  const lower = message.toLowerCase();

  const date = new Date();

  if (lower.includes("today")) {
    return date;
  }

  if (lower.includes("tomorrow")) {
    date.setDate(date.getDate() + 1);
    return date;
  }

  const match = message.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);
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

    // ✅ STEP 4: keep existing follow-up date logic
    if (step === "date" && task) {
      let parsedDate = extractDate(message);

      if (!parsedDate) {
        return NextResponse.json({
          reply: "Please enter valid date (today, tomorrow or dd-mm-yyyy) ❌",
        });
      }

      const cleanDate = new Date(parsedDate);
      cleanDate.setHours(0, 0, 0, 0);

      await Todo.create({
        text: task,
        date: cleanDate,
        userId: session.user?.email,
      });

      return NextResponse.json({
        reply: `Task "${task}" added for ${cleanDate.toDateString()} ✅`,
      });
    }

    // ✅ STEP 3: improved ADD logic
    const lower = message.toLowerCase();

    if (
      lower.includes("add") ||
      lower.includes("create") ||
      lower.includes("task")
    ) {
      const newTask = extractTask(message);
      const parsedDate = extractDate(message);

      if (!newTask) {
        return NextResponse.json({
          reply: "What task do you want to add? 🤔",
        });
      }

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