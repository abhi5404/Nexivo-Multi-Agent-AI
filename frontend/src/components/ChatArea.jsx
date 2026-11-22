import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import getMessages from "../features/getMessages";
import { setMessages, setArtifacts } from "../redux/messageSlice";
import Nav from "./Nav";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

function ChatArea() {
  const dispatch = useDispatch();
  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation,
  );
  const messages = useSelector((state) => state.message.messages);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    let active = true;
    const conversationId = selectedConversation?._id;

    const loadMessages = async () => {
      if (!conversationId) {
        dispatch(setMessages([]));
        return;
      }

      dispatch(setMessages([]));
      const loadedMessages = await getMessages(conversationId);
      if (active) {
        const localMessages = messagesRef.current.filter(
          (message) => message.conversationId === conversationId,
        );
        const mergedMessages = [...loadedMessages];

        for (const localMessage of localMessages) {
          const alreadyLoaded = mergedMessages.some(
            (message) =>
              message._id === localMessage._id ||
              (message.role === localMessage.role &&
                message.content === localMessage.content),
          );
          if (!alreadyLoaded) {
            mergedMessages.push(localMessage);
          }
        }

        mergedMessages.sort(
          (left, right) =>
            new Date(left.createdAt || 0) - new Date(right.createdAt || 0),
        );
        dispatch(setMessages(mergedMessages));
        const latestArtifactMessage = [...mergedMessages]
          .reverse()
          .find((message) => message.artifacts?.length);
        dispatch(setArtifacts(latestArtifactMessage?.artifacts || []));
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
