"use client";

import { FormEvent, useRef, useState } from "react";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField
} from "@mui/material";
import { createTodo, updateTodo } from "../todosSlice";
import { useAppDispatch } from "@/store/hooks";
import { getDateAfter, isEndDateAfterStartDate } from "@/lib/todoDates";
import type { TodoDraft } from "@/types/todo";

const emptyDraft: TodoDraft = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  completed: false
};

interface TodoFormDialogProps {
  initialValue?: TodoDraft;
  mode: "create" | "edit";
  open: boolean;
  todoId?: string;
  onClose: () => void;
  onSaved: () => void;
}

export function TodoFormDialog({
  initialValue,
  mode,
  onClose,
  onSaved,
  open,
  todoId
}: TodoFormDialogProps) {
  const dispatch = useAppDispatch();
  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<TodoDraft>(initialValue ?? emptyDraft);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const endDateMin = getDateAfter(draft.startDate);
  const hasInvalidDateRange =
    Boolean(draft.startDate && draft.endDate) &&
    !isEndDateAfterStartDate(draft.startDate, draft.endDate);

  function openDatePicker(input: HTMLInputElement | null) {
    if (!input) {
      return;
    }

    try {
      input.showPicker();
    } catch {
      input.focus();
    }
  }

  function updateStartDate(value: string) {
    setDraft((current) => ({
      ...current,
      startDate: value
    }));
  }

  function updateEndDate(value: string) {
    setDraft((current) => ({
      ...current,
      endDate: value
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (
      !draft.title.trim() ||
      !draft.startDate ||
      !draft.endDate ||
      hasInvalidDateRange
    ) {
      return;
    }

    setSaving(true);
    try {
      if (mode === "edit" && todoId) {
        await dispatch(updateTodo({ id: todoId, draft })).unwrap();
      } else {
        await dispatch(createTodo(draft)).unwrap();
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle sx={{ fontWeight: 800 }}>
        {mode === "edit" ? "Edit task" : "Add task"}
      </DialogTitle>

      <DialogContent>
        <Stack
          id="todo-form"
          component="form"
          spacing={2}
          onSubmit={handleSubmit}
          sx={{ pt: 1 }}
        >
          <TextField
            autoFocus
            fullWidth
            label="Title"
            value={draft.title}
            error={submitted && !draft.title.trim()}
            helperText={submitted && !draft.title.trim() ? "Title is required" : " "}
            onChange={(event) =>
              setDraft((current) => ({ ...current, title: event.target.value }))
            }
          />

          <TextField
            fullWidth
            label="Description"
            minRows={4}
            multiline
            value={draft.description}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                description: event.target.value
              }))
            }
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              inputRef={startDateInputRef}
              label="Start date"
              type="date"
              value={draft.startDate}
              error={submitted && !draft.startDate}
              helperText={submitted && !draft.startDate ? "Required" : " "}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Open start date calendar"
                        edge="end"
                        onClick={() => openDatePicker(startDateInputRef.current)}
                      >
                        <CalendarMonthRoundedIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                },
                inputLabel: { shrink: true }
              }}
              onChange={(event) =>
                updateStartDate(event.target.value)
              }
              onInput={(event) =>
                updateStartDate((event.target as HTMLInputElement).value)
              }
            />

            <TextField
              fullWidth
              inputRef={endDateInputRef}
              label="End date"
              type="date"
              value={draft.endDate}
              error={(submitted && !draft.endDate) || hasInvalidDateRange}
              helperText={
                submitted && !draft.endDate
                  ? "Required"
                  : hasInvalidDateRange
                    ? "End date must be after the start date"
                    : " "
              }
              slotProps={{
                htmlInput: { min: endDateMin },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Open end date calendar"
                        edge="end"
                        onClick={() => openDatePicker(endDateInputRef.current)}
                      >
                        <CalendarMonthRoundedIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                },
                inputLabel: { shrink: true }
              }}
              onChange={(event) =>
                updateEndDate(event.target.value)
              }
              onInput={(event) =>
                updateEndDate((event.target as HTMLInputElement).value)
              }
            />
          </Stack>

          <FormControlLabel
            control={
              <Checkbox
                checked={draft.completed}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    completed: event.target.checked
                  }))
                }
              />
            }
            label="Completed"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          form="todo-form"
          type="submit"
          variant="contained"
          startIcon={<SaveRoundedIcon />}
          disabled={saving}
        >
          {saving ? "Saving" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
