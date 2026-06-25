import mongoose from "mongoose";

export const Counter = mongoose.model("Counter", new mongoose.Schema({
    userId: {
        type: Number,
        require: true,
        default: 1
    },
    name: { type: String, required: true, unique: true, default: 'userId' },
}));