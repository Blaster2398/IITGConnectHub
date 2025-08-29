import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // ADDED: A field for student skills
    skills: {
      type: [String],
      default: [],
    },
    password: {
      type: String,
      required: true,
    },
    // MODIFIED: Replaced isAdmin with a more flexible role system
    role: {
      type: String,
      default: "Student", // Possible values: Student, BoardAdmin, SuperAdmin
      enum: ["Student", "BoardAdmin", "SuperAdmin"],
    },
    // NEW: If the user is a BoardAdmin, this specifies which board they manage
    adminOf: {
      type: String, // e.g., "Cultural", "Technical"
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
