import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { todoRepository } from "./services/todoRepository";
import type { Todo, TodoDraft, TodoFilters } from "@/types/todo";

interface TodosState {
  items: Todo[];
  filters: TodoFilters;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  filters: {
    query: "",
    status: "all"
  },
  status: "idle",
  error: null
};

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  return todoRepository.list();
});

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (draft: TodoDraft) => todoRepository.create(draft)
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, draft }: { id: string; draft: TodoDraft }) =>
    todoRepository.update(id, draft)
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id: string) => todoRepository.remove(id)
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.filters.query = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<TodoFilters["status"]>) {
      state.filters.status = action.payload;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Could not load tasks";
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.items = state.items.map((todo) =>
          todo.id === action.payload.id ? action.payload : todo
        );
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo.id !== action.payload);
      });
  }
});

export const { clearError, setQuery, setStatusFilter } = todosSlice.actions;
export default todosSlice.reducer;
