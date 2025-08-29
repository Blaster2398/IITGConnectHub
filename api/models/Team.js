import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // RENAMED: 'type' now represents the team's board (e.g., Technical, Cultural)
  board: {
    type: String,
    required: true,
  },
  // RENAMED: 'city' is now 'category' (e.g., Fest, Club, Project)
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
  // RENAMED: 'rooms' are now 'roles'
  roles: {
    type: [String],
  },
  // ADDED: A field for the team's rating or reputation
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
