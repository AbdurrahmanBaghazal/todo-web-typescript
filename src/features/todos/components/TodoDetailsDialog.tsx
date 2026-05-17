"use client";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import { deleteTodo } from "../todosSlice";
import { formatDateRange } from "../utils/formatDate";
import { useAppDispatch } from "@/store/hooks";
import type { Todo } from "@/types/todo";

interface TodoDetailsDialogProps {
  todo: Todo | null;
  onClose: () => void;
  onEdit: (todo: Todo) => void;
}

export function TodoDetailsDialog({
  onClose,
  onEdit,
  todo
}: TodoDetailsDialogProps) {
  const dispatch = useAppDispatch();

  if (!todo) {
    return null;
  }

  const selectedTodo = todo;

  function handleDelete() {
    void dispatch(deleteTodo(selectedTodo.id));
    onClose();
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={Boolean(selectedTodo)} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: 800 }}>{selectedTodo.title}</DialogTitle>

      <DialogContent>
        <Stack spacing={2.25}>
          <Chip
            color={selectedTodo.completed ? "success" : "default"}
            label={selectedTodo.completed ? "Completed" : "Active"}
            sx={{ alignSelf: "flex-start", fontWeight: 700 }}
          />

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <CalendarMonthRoundedIcon color="action" fontSize="small" />
            <Typography color="text.secondary">
              {formatDateRange(selectedTodo.startDate, selectedTodo.endDate)}
            </Typography>
          </Stack>

          <Divider />

          <Typography color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
            {selectedTodo.description || "No description"}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          color="error"
          startIcon={<DeleteRoundedIcon />}
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button
          startIcon={<EditRoundedIcon />}
          variant="contained"
          onClick={() => onEdit(selectedTodo)}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
