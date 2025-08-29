import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  board: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
  },
  // NEW: A field for specific tags/skills like 'webops', 'ml', etc.
  tags: {
    type: [String],
    default: [],
  },
  // CORRECTED: The 'roles' array should store proper ObjectIDs, not strings.
  // This is crucial for efficiently querying role availability.
  roles: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Role'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Team", TeamSchema);
