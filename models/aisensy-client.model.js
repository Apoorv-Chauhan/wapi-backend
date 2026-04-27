import mongoose from "mongoose";

const aisensyClientSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true },
    phone: String,
    company: String,

    businessId: { type: String, required: true },
    projectId: { type: String, required: true },

    website: String,
    address: mongoose.Schema.Types.Mixed,
    timezone: String,

    token: String, // optional (campaign token if needed later)
    isWabaConnected: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true },
);

export default mongoose.model("AisensyClient", aisensyClientSchema);
