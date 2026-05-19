import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { isEndDateAfterStartDate } from "@/lib/todoDates";
import { TodoModel } from "@/models/TodoModel";
import type { Todo, TodoDraft } from "@/types/todo";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function serializeTodo(todo: {
  _id: unknown;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Todo {
  return {
    id: String(todo._id),
    title: todo.title,
    description: todo.description,
    startDate: todo.startDate,
    endDate: todo.endDate,
    completed: todo.completed,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString()
  };
}

function invalidIdResponse() {
  return NextResponse.json({ error: "Task not found" }, { status: 404 });
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  const draft = (await request.json()) as TodoDraft;

  if (!isEndDateAfterStartDate(draft.startDate, draft.endDate)) {
    return NextResponse.json(
      { error: "End date must be after the start date" },
      { status: 400 }
    );
  }

  await connectMongoDB();
  const todo = await TodoModel.findByIdAndUpdate(
    id,
    {
      title: draft.title,
      description: draft.description,
      startDate: draft.startDate,
      endDate: draft.endDate,
      completed: draft.completed
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!todo) {
    return invalidIdResponse();
  }

  return NextResponse.json(serializeTodo(todo));
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  await connectMongoDB();
  const todo = await TodoModel.findByIdAndDelete(id);

  if (!todo) {
    return invalidIdResponse();
  }

  return NextResponse.json({ id });
}
