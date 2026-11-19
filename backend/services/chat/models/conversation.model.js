import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
     title: 
    {
        type: String,
         default: "New Conversation",
         trim: true,
         maxlength: 48,
    },
    userId: {
        type: String,
        required: true,
        index: true,
    },
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;