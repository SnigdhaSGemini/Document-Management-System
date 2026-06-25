import mongoose from "mongoose";

export const AuditLog = mongoose.model("AuditLog", new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    metadata: {
        type: String,
        required: true
    }},
{
    timestamps: true 
}));