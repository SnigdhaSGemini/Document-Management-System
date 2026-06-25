import mongoose from "mongoose";

export const Comment = mongoose.model("Comment", new mongoose.Schema({
   documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
   },
   userId: {
    type: String,
    required: true
   },
   body: {
    type: String,
    required: true
   }, 
},
{
    timestamps: true 
}));