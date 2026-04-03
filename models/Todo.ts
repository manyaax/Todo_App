import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userId: { type: String, required: true },
});

export default mongoose.models.Todo ||
  mongoose.model("Todo", TodoSchema);
