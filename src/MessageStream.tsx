import Markdown from "react-markdown";

export type Message = {
  content: string;
  user: string;
};

export type MessageStreamProps = {
  messages: Message[];
};

const MessageBlock: React.FunctionComponent<Message> = ({ content, user }) => {
  return (
    <div>
      <div><em>[{user}]:</em></div>
      <Markdown>{content}</Markdown>
    </div>
  );
};

export const MessageStream: React.FunctionComponent<MessageStreamProps> = ({
  messages,
}) => {
  return (
    <>{messages.map(({ content, user }, i) => (<MessageBlock content={content} user={user} key={i}/>))}</>
  );
}
