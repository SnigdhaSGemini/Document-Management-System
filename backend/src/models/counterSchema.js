import mongoose from "mongoose";

export const Counter = mongoose.model("Counter", new mongoose.Schema({
    counter: {
        type: Number,
        default: 1
    },
    name: { type: String, required: true, unique: true, default: 'userId' },
}));