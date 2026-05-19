import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { isEndDateAfterStartDate } from "@/lib/todoDates";
import { TodoModel } from "@/models/TodoModel";
import type { Todo, TodoDraft } from "@/types/todo";

export const runtime = "nodejs";

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

function validateTodoDraft(draft: Partial<TodoDraft>) {
  const missingFields = [];

  if (!draft.title?.trim()) {
    missingFields.push("title");
  }

  if (!draft.startDate) {
    missingFields.push("startDate");
  }

  if (!draft.endDate) {
    missingFields.push("endDate");
  }

  return missingFields;
}

function validateDateRange(draft: Partial<TodoDraft>) {
  if (!draft.startDate || !draft.endDate) {
    return false;
  }

  return isEndDateAfterStartDate(draft.startDate, draft.endDate);
}

export async function GET() {
  await connectMongoDB();
  const todos = await TodoModel.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json(todos.map(serializeTodo));
}

export async function POST(request: Request) {
  const draft = (await request.json()) as Partial<TodoDraft>;
  const missingFields = validateTodoDraft(draft);

  if (missingFields.length > 0) {
    return NextResponse.json(
      {
        error: "Please fill all required fields",
        missingFields
      },
      { status: 400 }
    );
  }

  if (!validateDateRange(draft)) {
    return NextResponse.json(
      { error: "End date must be after the start date" },
      { status: 400 }
    );
  }

  await connectMongoDB();
  const todo = await TodoModel.create({
    title: draft.title,
    description: draft.description ?? "",
    startDate: draft.startDate,
    endDate: draft.endDate,
    completed: draft.completed ?? false
  });

  return NextResponse.json(serializeTodo(todo), { status: 201 });
}
