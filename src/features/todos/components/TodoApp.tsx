"use client";

import { useEffect, useMemo, useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { TodoCard } from "./TodoCard";
import { TodoDetailsDialog } from "./TodoDetailsDialog";
import { TodoFormDialog } from "./TodoFormDialog";
import { clearError, fetchTodos, setQuery, setStatusFilter } from "../todosSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { Todo, TodoDraft, TodoFilters } from "@/types/todo";

type DialogMode =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; todo: Todo };

export function TodoApp() {
  const dispatch = useAppDispatch();
  const { error, filters, items, status } = useAppSelector((state) => state.todos);
  const [formDialog, setFormDialog] = useState<DialogMode>({ type: "closed" });
  const [detailsTodo, setDetailsTodo] = useState<Todo | null>(null);

  useEffect(() => {
    void dispatch(fetchTodos());
  }, [dispatch]);

  const filteredTodos = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();

    return items.filter((todo) => {
      const matchesQuery =
        !normalizedQuery ||
        todo.title.toLowerCase().includes(normalizedQuery) ||
        todo.description.toLowerCase().includes(normalizedQuery);
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "completed" && todo.completed) ||
        (filters.status === "active" && !todo.completed);

      return matchesQuery && matchesStatus;
    });
  }, [filters, items]);

  const completedCount = items.filter((todo) => todo.completed).length;
  const activeCount = items.length - completedCount;
  const isLoading = status === "loading";

  function handleStatusChange(value: TodoFilters["status"]) {
    dispatch(setStatusFilter(value));
  }

  function handleEdit(todo: Todo) {
    setDetailsTodo(null);
    setFormDialog({ type: "edit", todo });
  }

  function handleSaved() {
    setFormDialog({ type: "closed" });
  }

  const editingDraft: TodoDraft | undefined =
    formDialog.type === "edit"
      ? {
          title: formDialog.todo.title,
          description: formDialog.todo.description,
          startDate: formDialog.todo.startDate,
          endDate: formDialog.todo.endDate,
          completed: formDialog.todo.completed
        }
      : undefined;

  return (
    <Box component="main" sx={{ minHeight: "100vh", pb: 6 }}>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          px: 2,
          pb: 4,
          pt: { xs: 3, sm: 5 }
        }}
      >
        <Container maxWidth="sm" disableGutters>
          <Stack spacing={3}>
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                gap: 2,
                justifyContent: "space-between"
              }}
            >
              <Box>
                <Typography variant="overline" sx={{ opacity: 0.85 }}>
                  Task manager
                </Typography>
                <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
                  ToDo
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddRoundedIcon />}
                onClick={() => setFormDialog({ type: "create" })}
                sx={{ minWidth: 124 }}
              >
                Add task
              </Button>
            </Stack>

            <Stack
              direction="row"
              sx={{
                flexWrap: "wrap",
                gap: 1
              }}
            >
              <Chip
                icon={<TaskAltRoundedIcon />}
                label={`${items.length} total`}
                sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "inherit" }}
              />
              <Chip
                label={`${activeCount} active`}
                sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "inherit" }}
              />
              <Chip
                label={`${completedCount} done`}
                sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "inherit" }}
              />
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ mt: -2.5 }}>
        <Stack spacing={2.5}>
          <Stack
            spacing={1.5}
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 1.5,
              boxShadow: "0 12px 30px rgba(17, 24, 39, 0.08)"
            }}
          >
            <TextField
              fullWidth
              placeholder="Search tasks"
              value={filters.query}
              onChange={(event) => dispatch(setQuery(event.target.value))}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon color="action" />
                    </InputAdornment>
                  )
                }
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                label="Status"
                value={filters.status}
                onChange={(event) =>
                  handleStatusChange(event.target.value as TodoFilters["status"])
                }
              >
                <MenuItem value="all">All tasks</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {error ? (
            <Alert severity="error" onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          ) : null}

          <Stack spacing={1.5}>
            {filteredTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onOpen={() => setDetailsTodo(todo)}
                onEdit={() => handleEdit(todo)}
              />
            ))}
          </Stack>

          {!isLoading && filteredTodos.length === 0 ? (
            <Stack
              spacing={1.5}
              sx={{
                alignItems: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
                px: 3,
                py: 6,
                textAlign: "center",
                bgcolor: "background.paper"
              }}
            >
              <TaskAltRoundedIcon color="primary" fontSize="large" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                No tasks found
              </Typography>
              <Typography color="text.secondary">
                Add a new task or adjust your filters.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => setFormDialog({ type: "create" })}
              >
                Add task
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </Container>

      {formDialog.type !== "closed" ? (
        <TodoFormDialog
          key={formDialog.type === "edit" ? formDialog.todo.id : "create"}
          mode={formDialog.type === "edit" ? "edit" : "create"}
          initialValue={editingDraft}
          open
          todoId={formDialog.type === "edit" ? formDialog.todo.id : undefined}
          onClose={() => setFormDialog({ type: "closed" })}
          onSaved={handleSaved}
        />
      ) : null}

      <TodoDetailsDialog
        todo={detailsTodo}
        onClose={() => setDetailsTodo(null)}
        onEdit={handleEdit}
      />
    </Box>
  );
}
