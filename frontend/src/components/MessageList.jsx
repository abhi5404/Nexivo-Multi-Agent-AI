import { Bot } from "lucide-react";
import { useSelector } from "react-redux";
import MessageBubble from "./messageBubble";

function MessageList() {
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation,
  );
  const messages = useSelector((state) => state.message.messages);

  return (
    <section
      className="flex-1 overflow-y-auto px-6 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-live="polite"
    >
      {messages.length === 0 || !selectedConversation ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/15 bg-indigo-500/10 text-indigo-300 shadow-[0_0_24px_rgba(99,102,241,0.12)]">
            <Bot size={23} strokeWidth={1.7} />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[20px] font-semibold tracking-tight text-slate-200">
              Nexivo
            </h2>
            <p className="text-[15px] font-semibold tracking-tight text-slate-400">
              How can I help you?
            </p>
            <p className="max-w-[260px] text-[13px] leading-relaxed text-slate-600">
              Ask me anything - code, ideas, explanations, or just a quick
              question.
            </p>
          </div>
          <div className="mt-1 flex flex-wrap justify-center gap-2">
            {["Write a Netflix clone", "Explain Redis", "Build a dashboard"].map(
              (suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="cursor-pointer rounded-lg border border-white/[0.07] bg-white/[0.04] px-2 py-1.5 text-[12px] text-slate-400 transition-colors duration-150 hover:bg-white/[0.08] hover:text-slate-200"
                >
                  {suggestion}
                </button>
              ),
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 py-8">
          {messages.map((message, index) => {
            return (
              <MessageBubble
                key={
                  message._id ||
                  `${message.role}-${message.createdAt || "pending"}-${index}`
                }
                role={message.role}
                content={message.content}
                images={message.images || []}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MessageList;
