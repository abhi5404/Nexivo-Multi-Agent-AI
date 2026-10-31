import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
    },
    content: String
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;