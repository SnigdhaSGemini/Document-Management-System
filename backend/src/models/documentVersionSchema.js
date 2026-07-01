import mongoose from "mongoose";

export const DocumentVersion = mongoose.model("DocumentVersion", new mongoose.Schema({
   documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
   },
   version: {
    type: Number,
    required: true
   },
   title: {
        type: String,
        required: true
    },
   content: {
    type: String,
    required: true
   }
},
{
    timestamps: true 
}
));