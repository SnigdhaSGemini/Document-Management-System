import mongoose from "mongoose";

export const User = mongoose.model("User", new mongoose.Schema({

    userId: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        require: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },

}, {
    timestamps: true 
    }));