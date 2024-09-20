import { useInfiniteScrollTop } from "6pp";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IconButton, Skeleton, Stack } from "@mui/material";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import FileMenu from "../components/dialog/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import { TypingLoader } from "../components/layout/Loaders";
import MessageComponent from "../components/shared/MessageComponent";
import { InputBox } from "../components/styles/StyledComponents";
import { grayColor, orange } from "../constants/color";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEFT,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { useErrors, useSocketEvents } from "../hooks/hook";
import {
  useGetChatDetailsQuery,
  useGetOldMessagesQuery,
} from "../redux/api/api";
import { removeNewMessagesAlert } from "../redux/Reducer/chat";
import { setIsFileMenu } from "../redux/Reducer/misc";
import { getSocket } from "../socket";

const Chat = ({ chatId, user }) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [IamTyping, setIamTyping] = useState(false);
  const [usersTyping, setUsersTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useGetChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetOldMessagesQuery({
    chatId,
    page,
  });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];
  const members = chatDetails.data?.chat.members;
  const messageOnChange = (e) => {
    setMessage(e.target.value);
    // EMITTING THE TYPING EVENT when user starts typing a event to socket(Server) is send
    // from socket it is send to all members of the chat except the sender(typer_user) and that is listened at line 146 Chat.jsx and then handler
    if (!IamTyping) {
      socket.emit(START_TYPING, { chatId, members });
      setIamTyping(true);
    }
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { chatId, members });
      setIamTyping(false);
    }, 2000);
  };
  const handleFileMenuOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    // EMITTING THE MESSAGE to server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };
  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    // this is because previous chat on changing chatid is not displayed
    //some issue with fetching previous chat messages
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setPage(1);
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      socket.emit(CHAT_LEFT, { userId: user._id, members });
    };
  }, [chatId]);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, usersTyping]);

  useEffect(() => {
    if (chatDetails.isError) {
      navigate("/");
    }
  }, [chatDetails.isError]);
  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );
  const startTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUsersTyping(true);
  }, []);
  const stopTypingListener = useCallback((data) => {
    // this is for the chat which is open and the id received from socket is same as the chat id
    if (data.chatId !== chatId) return;
    setUsersTyping(false);
  }, []);
  const alertListener = useCallback(
    (data) => {
      if (data?.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "alert_dada",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };
  useSocketEvents(socket, eventHandler);
  useErrors(errors);
  const allMessages = [...oldMessages, ...messages];
  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages.map((message) => (
          <MessageComponent key={message._id} message={message} user={user} />
        ))}
        {usersTyping && <TypingLoader />}
        <div ref={bottomRef} />
      </Stack>
      <form style={{ height: "10%" }} onSubmit={submitHandler}>
        <Stack
          direction={"row"}
          height={"100%"}
          alignItems={"center"}
          position={"relative"}
          padding={"1rem"}
        >
          <IconButton
            sx={{ position: "absolute", left: "1.5rem", rotate: "30deg" }}
            onClick={handleFileMenuOpen}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox
            placeholder="Type Message Here..."
            value={message}
            onChange={messageOnChange}
          />
          <IconButton
            type="submit"
            sx={{
              rotate: "-23deg",
              backgroundColor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": { backgroundColor: "#e64141" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
};

export default AppLayout()(Chat);
