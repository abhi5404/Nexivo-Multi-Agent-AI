import { Mic, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createConversation } from "../features/createConversation";
import sendMessage from "../features/sendMessage";
import { MessageSquare, Code2, Image, FileText, Presentation, Zap , Globe } from "lucide-react";
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
  const [selectedAgent, setSelectedAgent] = useState("auto");
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
        agent: selectedAgent,
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

  const agents = [
    {
      id:"auto",
      icon:Zap,
      label:"Auto",
    },
    {
      id:"chat",
      icon:MessageSquare,
      label:"Chat",
    },
    {
      id : "coding",
      icon:Code2,
      label:"Coding",
    },
    {
      id:"image",
      icon:Image,
      label:"Image",
    },
    {
      id : "pdf",
      icon:FileText,
      label:"PDF",
    },
    {
      id:"ppt",
      icon:Presentation,
      label:"PPT",
    },
    {
      id:"search",
      icon:Globe,
      label:"Search",
    },
  ]

  return (
    <div className="w-full border-t border-white/[0.06] bg-[#0d0f14] px-4 pb-4 pt-3 md:px-6">
      <form
        className="mx-auto flex max-w-3xl flex-col gap-2 rounded-2xl border border-white/[0.1] bg-[#171a21] px-3 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-colors focus-within:border-indigo-400/30"
        onSubmit={handleSendMessage}
      >
        <div className="flex w-full gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isActive = selectedAgent === agent.id;

            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setSelectedAgent(agent.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150 ${
                  isActive
                    ? "border border-indigo-400/20 bg-gradient-to-r from-indigo-500/20 to-violet-600/20 text-white shadow-[0_4px_14px_rgba(99,102,241,0.12)]"
                    : "border border-transparent text-slate-500 hover:border-white/[0.06] hover:bg-white/[0.05] hover:text-slate-300"
                }`}
                title={`${agent.label} agent`}
              >
                <Icon
                  size={14}
                  className={isActive ? "text-indigo-300" : "text-slate-500"}
                />
                {agent.label}
              </button>
            );
          })}
        </div>
        <div className="flex w-full items-center gap-2">
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
        </div>
      </form>
      <p className="mt-2 text-center text-[10px] text-slate-600">
        Nexivo can make mistakes. Check important information.
      </p>
    </div>
  );
}

export default ChatInput;
