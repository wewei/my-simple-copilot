import { ReactNode, useEffect, useRef } from "react";
import { MessageList, ITextMessage, MessageType } from "react-chat-elements";

export type Message = {
  content: string;
  user: string;
};

export type MessageStreamProps = {
  messages: Message[];
};

const MessageBlock: React.FunctionComponent<Message> = ({
  content,
  user,
}) => {
  return <div>{user}: {content}</div>

}

export const MessageStream: React.FunctionComponent<MessageStreamProps> = ({
  messages,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <MessageList
      referance={ref}
      lockable={true}
      toBottomHeight={"100%"}
      dataSource={messages.map(
        ({ content, user }, i): MessageType => ({
          id: i,
          date: new Date(),
          focus: true,
          forwarded: false,
          titleColor: "blue",
          replyButton: false,
          position: "left",
          type: "text",
          title: user,
          text: content,
          removeButton: false,
          status: "read",
          notch: false,
          retracted: false,
        })
      )}
    />
  );
}
