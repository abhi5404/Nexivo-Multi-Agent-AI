import { Bot, UserRound } from "lucide-react";
import { useSelector } from "react-redux";

function MessageList() {
  const messages = useSelector((state) => state.message.messages);

  return (
    <section className="chat-messages" aria-live="polite">
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-6">
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300 ring-1 ring-inset ring-indigo-400/15">
              <Bot size={23} strokeWidth={1.7} />
            </div>
            <h2 className="text-lg font-medium text-slate-200">How can I help?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Start a conversation with Nexivo.
            </p>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 py-8">
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <article
                key={message._id || `${message.role}-${message.createdAt}-${message.content}`}
                className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
              >
                <div className={`chat-message-avatar ${isUser ? "chat-message-avatar-user" : ""}`}>
                  {isUser ? <UserRound size={15} /> : <Bot size={15} />}
                </div>
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                    isUser
                      ? "rounded-tr-md bg-indigo-500/15 text-indigo-50"
                      : "rounded-tl-md bg-white/[0.045] text-slate-300"
                  }`}
                >
                  {message.content}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MessageList;
