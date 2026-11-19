import { Mic, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createConversation } from "../features/createConversation";
import sendMessage from "../features/sendMessage";
import {
  addConversation,
  selectConversation,
  setConvTitle,
} from "../redux/conversationSlice";
import { updateConversation } from "../features/updateConversations";
import { addMessage } from "../redux/messageSlice";

function ChatInput() {
  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation,
  );
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);

  const getConversationTitle = (text) => {
    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized.length <= 48) return normalized;
    return `${normalized.slice(0, 45).trimEnd()}...`;
  };

  const handleSendMessage = async (event) => {
    event?.preventDefault();
    const content = prompt.trim();
    if (!content || isSending) return;

    setIsSending(true);

    try {
      let conversation = selectedConversation;
      if (!conversation?._id) {
        conversation = await createConversation();
        dispatch(addConversation(conversation));
        dispatch(selectConversation(conversation));
      }

      if (
        !conversation.title ||
        conversation.title === "New Conversation" ||
        conversation.title === "New Chat"
      ) {
        const title = getConversationTitle(content);
        try {
          const updatedConversation = await updateConversation({
            id: conversation._id,
            title,
          });
          dispatch(
            setConvTitle({
              conversationId: conversation._id,
              title: updatedConversation.title,
            }),
          );
          conversation = updatedConversation;
        } catch (error) {
          console.error("Failed to update conversation title:", error);
          dispatch(setConvTitle({ conversationId: conversation._id, title }));
          conversation = { ...conversation, title };
        }
      }

      setPrompt("");
      dispatch(
        addMessage({
          conversationId: conversation._id,
          role: "user",
          content,
        }),
      );

      const data = await sendMessage({
        prompt: content,
        conversationId: conversation._id,
      });
      console.log("AI response:", data?.response);
      if (data?.response) {
        dispatch(
          addMessage({
            conversationId: conversation._id,
            role: "assistant",
            content: data.response,
          }),
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setPrompt(content);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full border-t border-white/[0.06] bg-[#0d0f14] px-4 pb-4 pt-3 md:px-6">
      <form
        className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-white/[0.1] bg-[#171a21] px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-colors focus-within:border-indigo-400/30"
        onSubmit={handleSendMessage}
      >
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent bg-transparent text-slate-600 transition-all duration-150 hover:border-white/[0.06] hover:bg-white/[0.05] hover:text-slate-300"
          title="Attach file"
          aria-label="Attach file"
        >
          <Paperclip size={16} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent bg-transparent text-slate-600 transition-all duration-150 hover:border-white/[0.06] hover:bg-white/[0.05] hover:text-slate-300"
          title="Voice input"
          aria-label="Voice input"
        >
          <Mic size={16} strokeWidth={1.8} />
        </button>
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          disabled={isSending}
          placeholder="Ask anything..."
          aria-label="Message"
          className="min-w-0 flex-1 border-0 bg-transparent px-1 text-sm text-slate-200 outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={!prompt.trim() || isSending}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-0 bg-indigo-500 text-white transition-colors duration-150 hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-slate-600"
          title="Send message"
          aria-label="Send message"
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
