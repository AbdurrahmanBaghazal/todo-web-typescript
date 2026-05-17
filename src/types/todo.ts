export interface Todo {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TodoDraft = Pick<
  Todo,
  "title" | "description" | "startDate" | "endDate" | "completed"
>;

export interface TodoFilters {
  query: string;
  status: "all" | "active" | "completed";
}
