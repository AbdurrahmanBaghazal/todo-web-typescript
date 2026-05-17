import { apiClient, shouldUseLocalStorage } from "@/lib/apiClient";
import type { Todo, TodoDraft } from "@/types/todo";

const STORAGE_KEY = "todo-web.tasks";

export interface TodoRepository {
  list(): Promise<Todo[]>;
  create(draft: TodoDraft): Promise<Todo>;
  update(id: string, draft: TodoDraft): Promise<Todo>;
  remove(id: string): Promise<string>;
}

function normalizeTodo(value: Partial<Todo> & { id?: string | number }): Todo {
  const now = new Date().toISOString();

  return {
    id: String(value.id ?? crypto.randomUUID()),
    title: value.title ?? "",
    description: value.description ?? "",
    startDate: value.startDate ?? "",
    endDate: value.endDate ?? "",
    completed: Boolean(value.completed),
    createdAt: value.createdAt ?? now,
    updatedAt: value.updatedAt ?? now
  };
}

function readLocalTodos(): Todo[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Array<Partial<Todo>>;
    return parsedValue.map(normalizeTodo);
  } catch {
    return [];
  }
}

function writeLocalTodos(todos: Todo[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

class LocalTodoRepository implements TodoRepository {
  async list() {
    return readLocalTodos();
  }

  async create(draft: TodoDraft) {
    const now = new Date().toISOString();
    const todo: Todo = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    const todos = [todo, ...readLocalTodos()];
    writeLocalTodos(todos);
    return todo;
  }

  async update(id: string, draft: TodoDraft) {
    const todos = readLocalTodos();
    const current = todos.find((todo) => todo.id === id);

    if (!current) {
      throw new Error("Task not found");
    }

    const updatedTodo: Todo = {
      ...current,
      ...draft,
      updatedAt: new Date().toISOString()
    };

    writeLocalTodos(
      todos.map((todo) => (todo.id === id ? updatedTodo : todo))
    );

    return updatedTodo;
  }

  async remove(id: string) {
    writeLocalTodos(readLocalTodos().filter((todo) => todo.id !== id));
    return id;
  }
}

class AxiosTodoRepository implements TodoRepository {
  async list() {
    const response = await apiClient.get<Todo[]>("/todos");
    return response.data.map(normalizeTodo);
  }

  async create(draft: TodoDraft) {
    const response = await apiClient.post<Todo>("/todos", draft);
    return normalizeTodo(response.data);
  }

  async update(id: string, draft: TodoDraft) {
    const response = await apiClient.put<Todo>(`/todos/${id}`, draft);
    return normalizeTodo(response.data);
  }

  async remove(id: string) {
    await apiClient.delete(`/todos/${id}`);
    return id;
  }
}

export const todoRepository: TodoRepository = shouldUseLocalStorage()
  ? new LocalTodoRepository()
  : new AxiosTodoRepository();
