import mongoose from "mongoose";

export const Timeline = mongoose.model("Timeline", new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "draft",
        "submitted",
        "approved",
        "rejected",
        "archived",
        "assigned",
        "reassigned"
      ],
    },

    userId: {
      type: String,
      required: true,
    },

    user: {
      type: String,
      required: true,
    },

    reviewerId: {
      type: String,
      default: null,
    },

    reviewer: {
      type: String, 
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
));