import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import getMessages from "../features/getMessages";
import { setMessages } from "../redux/messageSlice";
import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

function ChatArea() {
  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation,
  );

  useEffect(() => {
    let active = true;

    const loadMessages = async () => {
      if (!selectedConversation?._id) {
        dispatch(setMessages([]));
        return;
      }

      const messages = await getMessages(selectedConversation._id);
      if (active) {
        dispatch(setMessages(messages));
      }
    };

    loadMessages();

    return () => {
      active = false;
    };
  }, [dispatch, selectedConversation?._id]);

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-[#101217]">
      <Nav />
      <MessageList />
      <ChatInput />
    </main>
  );
}

export default ChatArea;
