import mongoose from "mongoose";

export const Document = mongoose.model("Document", new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Draft'
    },
    owner: {
        type: String,
        required: true
    },
    reviewer: {
        type: String,
        default: null
    },
    ownerId: {
        type: String,
        required: true
    },
    reviewerId: {
        type: String,
        default: null
    },
    currentVersion: {
        type: Number,
        required: true,
        default: 1
    }},
    {
    timestamps: true 
    }));