import { model, models, Schema, type InferSchemaType } from "mongoose";

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    startDate: {
      type: String,
      required: true
    },
    endDate: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export type TodoDocument = InferSchemaType<typeof todoSchema>;
export const TodoModel =
  models.Todo || model<TodoDocument>("Todo", todoSchema);
