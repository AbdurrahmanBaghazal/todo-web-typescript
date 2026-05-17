"use client";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { formatDateRange } from "../utils/formatDate";
import { deleteTodo, updateTodo } from "../todosSlice";
import { useAppDispatch } from "@/store/hooks";
import type { Todo } from "@/types/todo";
import { useState } from "react";

interface TodoCardProps {
  todo: Todo;
  onOpen: () => void;
  onEdit: () => void;
}

export function TodoCard({ onEdit, onOpen, todo }: TodoCardProps) {
  const dispatch = useAppDispatch();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  function handleToggleCompleted() {
    void dispatch(
      updateTodo({
        id: todo.id,
        draft: {
          title: todo.title,
          description: todo.description,
          startDate: todo.startDate,
          endDate: todo.endDate,
          completed: !todo.completed
        }
      })
    );
  }

  function handleDelete() {
    setMenuAnchor(null);
    void dispatch(deleteTodo(todo.id));
  }

  return (
    <Paper
      component="article"
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        transition: "border-color 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 12px 30px rgba(17, 24, 39, 0.08)"
        }
      }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: "flex-start", gap: 1.25, p: 1.5 }}
      >
        <Checkbox
          checked={todo.completed}
          onChange={handleToggleCompleted}
          slotProps={{
            input: { "aria-label": `Mark ${todo.title} completed` }
          }}
          sx={{ mt: -0.5 }}
        />

        <Box
          role="button"
          tabIndex={0}
          onClick={onOpen}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              onOpen();
            }
          }}
          sx={{
            cursor: "pointer",
            flex: 1,
            minWidth: 0
          }}
        >
          <Stack spacing={0.75}>
            <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
              <Typography
                component="h2"
                variant="subtitle1"
                sx={{
                  flex: 1,
                  fontWeight: 800,
                  minWidth: 0,
                  overflow: "hidden",
                  textDecoration: todo.completed ? "line-through" : "none",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {todo.title}
              </Typography>

              <Chip
                color={todo.completed ? "success" : "default"}
                label={todo.completed ? "Done" : "Active"}
                size="small"
                sx={{ flexShrink: 0, fontWeight: 700 }}
              />
            </Stack>

            <Typography
              color="text.secondary"
              variant="body2"
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2
              }}
            >
              {todo.description || "No description"}
            </Typography>

            <Stack
              direction="row"
              spacing={0.75}
              sx={{ alignItems: "center" }}
            >
              <CalendarMonthRoundedIcon color="action" fontSize="small" />
              <Typography color="text.secondary" variant="caption">
                {formatDateRange(todo.startDate, todo.endDate)}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Tooltip title="Task actions">
          <IconButton
            aria-label={`Actions for ${todo.title}`}
            onClick={(event) => setMenuAnchor(event.currentTarget)}
            size="small"
          >
            <MoreHorizRoundedIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            onEdit();
          }}
        >
          <EditRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <DeleteRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
}
