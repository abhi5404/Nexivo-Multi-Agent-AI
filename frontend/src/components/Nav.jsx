import { MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

function Nav() {
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation,
  );
  const messages = useSelector((state) => state.message.messages);

  return (
    <>
      {selectedConversation && (
        <header className="flex h-14 items-center gap-2.5 border-b border-white/[0.06] bg-[#0d0f14] px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
            <MessageSquare
              size={13}
              className="text-indigo-400"
              strokeWidth={2}
            />
          </div>
          <div className="text-[14px] font-semibold tracking-tight text-slate-100">
            {selectedConversation.title || "New Chat"}
          </div>
          <div className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-600">
            {messages?.length || 0} Messages
          </div>
        </header>
      )}
    </>
  );
}

export default Nav;
