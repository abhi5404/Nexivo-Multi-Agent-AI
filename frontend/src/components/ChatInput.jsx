import { Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/axios";
import { addMessage } from "../redux/messageSlice";

function ChatInput() {
  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation,
  );
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const content = prompt.trim();
    if (!content || !selectedConversation?._id || isSending) return;

    setIsSending(true);
    setPrompt("");
    dispatch(addMessage({ role: "user", content }));

    try {
      const { data } = await api.post("/api/agent/chat", {
        prompt: content,
        conversationId: selectedConversation._id,
      });
      if (data?.response) {
        dispatch(addMessage({ role: "assistant", content: data.response }));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setPrompt(content);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-composer-wrap">
      <form className="chat-composer" onSubmit={handleSubmit}>
        <button type="button" className="chat-composer-button" title="Attach file">
          <Paperclip size={17} strokeWidth={1.8} />
        </button>
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          disabled={!selectedConversation || isSending}
          placeholder={
            selectedConversation ? "Message Nexivo..." : "Select or create a chat"
          }
          aria-label="Message"
          className="chat-composer-input"
        />
        <button
          type="submit"
          disabled={!prompt.trim() || !selectedConversation || isSending}
          className="chat-send-button"
          title="Send message"
        >
          <Send size={16} strokeWidth={2} />
        </button>
      </form>
      <p className="mt-2 text-center text-[10px] text-slate-600">
        Nexivo can make mistakes. Check important information.
      </p>
    </div>
  );
}

export default ChatInput;
