import React, { FunctionComponent } from "react";
import "./Messages.scss";
import { DataType } from "../Chat/ChatPage";

type MessageType = {
  messages: DataType[];
  name: string;
};

export const Messages: FunctionComponent<MessageType> = ({
  messages,
  name,
}) => {
  // console.log(messages, "asdasdasd");
  return (
    <div className="messages">
      {messages.map(({ user, message, transactions }, i) => {
        console.log(transactions?.data);
        const isMeClass =
          user.name.trim().toLowerCase() === name.trim().toLowerCase()
            ? "messages__item-me"
            : "messages__item-user";

        return (
          <div key={i} className={isMeClass}>
            <span className={`${isMeClass}--nickName`}>{user.name}</span>
            {transactions ? (
              <div className={`${isMeClass}--text`}>
                {`ETH - ${transactions.data.ETH} `}
                <br />
                {`WalletFrom - ${transactions.data.WalletFrom}`}
                <br />
                {`WalletTo - ${transactions.data.WalletTo} `}
              </div>
            ) : (
              <div className={`${isMeClass}--text`}>{message}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};
