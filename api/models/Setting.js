import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
  },
  registration: {
    type: Map,
    of: String,
    required: true,
  },
  deletion: {
    type: Map,
    of: String,
    required: true,
  },
});

export default mongoose.model("Setting", SettingSchema);

