import { MessageSquare, PanelLeft, PenSquare, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createConversation } from "../features/createConversation";
import {
  addConversation,
  selectConversation,
  setConversations,
} from "../redux/conversationSlice";
import { useEffect } from "react";
import { getConversations } from "../features/getConversations";

function SideBar() {
  const dispatch = useDispatch();
  const { conversations , selectedConversation } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.user);

  const handleCreateConversation = async () => {
    const data = await createConversation();
    dispatch(addConversation(data));
  };

    useEffect(() => {
      if (!user) {
        return;
      }

      const loadConversations = async () => {
        try {
          const data = await getConversations();
          dispatch(setConversations(data));
        } catch (error) {
          console.error("Failed to load conversations:", error);
          dispatch(setConversations([]));
        }
      };

      loadConversations();
    }, [dispatch, user]);

  return (
    <div className="fixed lg:static inset-y-0 left-0 z-50 w-[270px] h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06]">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]">
          <div className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer">
            <PanelLeftIcon />
          </div>
          <span className="text-[16px] font-semibold text-slate-100 tracking-tight flex-1">
            Nexivo
          </span>
          <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide">
            free
          </span>
          <button className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer">
            <PenSquare size={14} />
          </button>
        </div>
        <div className="px-4 pt-5">
          <button
            className="group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-3 text-left text-sm font-medium text-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-200 hover:border-indigo-400/30 hover:bg-white/[0.07] hover:shadow-[0_10px_28px_rgba(79,70,229,0.12)]"
            onClick={handleCreateConversation}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-400/20 transition-colors duration-200 group-hover:bg-indigo-500/25">
              <Plus size={16} strokeWidth={2.2} />
            </span>
            <span className="flex flex-col">
              <span className="leading-5">New chat</span>
              <span className="text-[11px] font-normal text-slate-500 transition-colors duration-200 group-hover:text-slate-400">
                Start a fresh conversation
              </span>
            </span>
          </button>
        </div>
        <div className="flex-1 px-4 py-6">
          {conversations.length === 0 ? (
            <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
              No Recent Conversations
            </div>
          ) : (
            <>
              <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
                Recents
              </div>
              <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {conversations.map((conversation) => {
                  const isActive = selectedConversation?._id === conversation?._id;

                  return (
                    <button
                      key={conversation._id}
                      type="button"
                      onClick={() => dispatch(selectConversation(conversation))}
                      className={`group mb-1 flex w-full cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors duration-200 ${
                        isActive
                          ? "border-indigo-400/15 bg-indigo-500/[0.08]"
                          : "border-transparent text-slate-400 hover:border-indigo-300/10 hover:bg-indigo-400/[0.07] hover:text-slate-200"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors duration-200 ${
                          isActive
                            ? "bg-indigo-400/15 text-indigo-300"
                            : "bg-white/[0.035] text-slate-600 group-hover:bg-indigo-400/15 group-hover:text-indigo-300"
                        }`}
                      >
                        <MessageSquare size={13} strokeWidth={1.7} />
                      </span>
                      <span
                        className={`truncate text-[13px] font-medium tracking-[-0.01em] ${
                          isActive ? "text-slate-100" : "text-slate-400"
                        }`}
                      >
                        {conversation.title || "New Chat"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-3 border-t border-white/[0.06] px-4 py-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || "User"}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-semibold text-indigo-300">
                {(user.name || user.email || "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-200">
                {user.name || "User"}
              </p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PanelLeftIcon() {
  return <PanelLeft size={16} />;
}

export default SideBar;
