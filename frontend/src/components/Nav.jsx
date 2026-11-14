import { ChevronDown, MoreHorizontal, Share2, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";

function Nav() {
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation,
  );
  

  return (
    <header className="chat-nav">
      <div className="flex min-w-0 items-center gap-2">
        <div className="chat-nav-icon">
          <Sparkles size={15} strokeWidth={2} />
        </div>
        <h1 className="truncate text-sm font-medium text-slate-200">
          {selectedConversation?.title || "New Chat"}
        </h1>
        <ChevronDown
          className="shrink-0 text-slate-500"
          size={15}
          strokeWidth={1.8}
        />
      </div>
      <div className="flex items-center gap-1">
        <button type="button" className="chat-nav-button" title="Share chat">
          <Share2 size={15} strokeWidth={1.8} />
        </button>
        <button type="button" className="chat-nav-button" title="More options">
          <MoreHorizontal size={18} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}

export default Nav;
