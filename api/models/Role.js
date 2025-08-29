import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    timeCommitment: {
      type: Number,
      required: true,
    },
    // This now tracks the REMAINING open positions
    positionsAvailable: {
      type: Number,
      required: true,
    },
    // NEW: We need to store the original number of openings
    originalPositions: {
        type: Number,
        required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    // REFACTORED: A single array to hold all applicants.
    applicants: [
      {
        userId: { type: String, required: true },
        status: { 
          type: String, 
          default: 'Applied',
          enum: ['Applied', 'Interviewing', 'Accepted', 'Rejected'] 
        }
      }
    ] 
  },
  { timestamps: true }
);

export default mongoose.model("Role", RoleSchema);
