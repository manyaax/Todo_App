import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Todo from "../../../models/Todo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todos = await Todo.find({ userId: session.user.id });
  return NextResponse.json(todos);
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
    userId: session.user.id,
  });

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
