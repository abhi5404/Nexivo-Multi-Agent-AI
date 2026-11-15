import { Bot, UserRound } from "lucide-react";

function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <article
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`chat-message-avatar ${
          isUser ? "chat-message-avatar-user" : ""
        }`}
      >
        {isUser ? <UserRound size={15} /> : <Bot size={15} />}
      </div>
      <div
        className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "rounded-tr-md bg-indigo-500/15 text-indigo-50"
            : "rounded-tl-md bg-white/[0.045] text-slate-300"
        }`}
      >
        {content}
      </div>
    </article>
  );
}

export default MessageBubble;
