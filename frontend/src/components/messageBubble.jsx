import { Bot, UserRound } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "whitespace-pre-wrap rounded-tr-md bg-indigo-500/15 text-indigo-50"
            : "rounded-tl-md bg-white/[0.045] text-slate-300"
        }`}
      >
        {isUser ? (
          content
        ) : (
          <div className="chat-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </article>
  );
}

export default MessageBubble;
