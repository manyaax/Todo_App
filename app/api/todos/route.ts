import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Todo from "../../../models/Todo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json([]);
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    let filter: any = {
      userId: session.user?.email, // ✅ FIXED (same as chatbot)
    };

    if (date) {
      const selected = new Date(date);

      // ✅ FORCE SAME FORMAT (VERY IMPORTANT)
      const start = new Date(selected);
      start.setHours(0, 0, 0, 0);

      const end = new Date(selected);
      end.setHours(23, 59, 59, 999);

      filter.date = {
        $gte: start,
        $lte: end,
      };

      // 🔍 DEBUG (optional)
      console.log("FILTER:", start, end);
    }

    const todos = await Todo.find(filter).sort({ date: 1 });

    console.log("TODOS FOUND:", todos); // 🔍 DEBUG

    return NextResponse.json(todos);
  } catch (error) {
    console.log("TODO FETCH ERROR:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const todo = await Todo.create({
    ...body,
    userId: session.user?.email, // ✅ FIXED (IMPORTANT 🔥)
  });

  console.log("TODO CREATED:", todo); // 🔍 DEBUG

  return NextResponse.json(todo);
}

export async function PUT(req: Request) {
  await connectDB();
  const body = await req.json();

  await Todo.findByIdAndUpdate(body.id, body);

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();

  await Todo.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}