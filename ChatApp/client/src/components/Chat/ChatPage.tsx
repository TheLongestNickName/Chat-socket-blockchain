import React, { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as io from "socket.io-client";
import "./ChatPage.scss";
// @ts-ignore
import icon from "../../images/emoji.svg";
import EmojiPicker from "emoji-picker-react";
import { Messages } from "../Message/Messages";

const socket = io.connect("http://localhost:5000");

export type DataType = {
  user: {
    name: string;
  };
  message: string;
  transactions?: {
    hash: string;
    index: number;
    previousHash: string;
    timestamp: string;
    data: {
      ETH: Number;
      WalletFrom: string;
      WalletTo: string;
    };
  };
};

export const ChatPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState<DataType[] | []>([]);
  const [message, setMessage] = useState("");
  const [isShowEmoji, setShowEmoji] = useState(false);
  const [numberUsers, setNumberUsers] = useState(0);
  const [query, setQuery] = useState<{ [k: string]: string }>({
    room: "",
    user: "",
  });
  const [params, setParams] = useState("");

  useEffect(() => {
    setParams(search);
  }, [search]);

  useEffect(() => {
    if (params.length) {
      const searchParams = Object.fromEntries(new URLSearchParams(params));
      setQuery(searchParams);
      socket.emit("join", searchParams);
    }

    return () => {
      socket.off("message");
    };
  }, [params]);

  useEffect(() => {
    socket.on("message", ({ data }) => {
      setData((prevState) => {
        return [...prevState, data];
      });
    });
  }, [params]);

  useEffect(() => {
    socket.on("room", ({ data: { users } }) => {
      setNumberUsers(users.length);
    });
  }, []);

  const leftRoom = () => {
    socket.emit("leftRoom", { params: query });
    navigate("/");
  };

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setMessage(value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) return;

    socket.emit("sendMessage", { message, params: query });

    setMessage("");
  };
  // @ts-ignore
  const onEmojiClick = ({ emoji }) => setMessage(`${message} ${emoji}`);

  return (
    <div className="chat">
      <div className="chat-head">
        <div className="chat-head--title">Room's name - {query.room}</div>
        <div className="chat-head--user">Users - {numberUsers}</div>
        <button className="chat-head--left" onClick={leftRoom}>
          Left the room
        </button>
      </div>

      <div
        className="chat-messages"
        onClick={() => {
          setShowEmoji((prev) => {
            if (!prev) {
              return prev;
            }
            return !prev;
          });
        }}
      >
        <Messages messages={data} name={query.name} />
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <div className="chat-form__input">
          <input
            type="text"
            name="message"
            placeholder="What do you want to say?"
            value={message}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className="chat-form__emojies">
          <img src={icon} alt="" onClick={() => setShowEmoji(!isShowEmoji)} />
          {isShowEmoji && (
            <div className="chat-form__emojies--emoji">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
        <div className="chat-form__emojies--button">
          <input type="submit" value="Send a message" />
        </div>
      </form>
    </div>
  );
};
