import { Stack, TextField, PrimaryButton } from "@fluentui/react";
// import "./App.css";
import { useCallback, useMemo, useState } from "react";
import { MessageStream, Message } from "./MessageStream";
import { chat } from "./api";

// const content =
//   "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui";
// const user = "OpenAI";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const canSend = useMemo(() => input && !waiting, [input, waiting]);

  const send = useCallback(async () => {
    if (canSend) {
      console.log(input);
      const newMessages = [...messages, { content: input, user: "user" }];
      setMessages(newMessages);
      setInput("");
      setWaiting(true);

      const res = await chat(newMessages.map(({ content, user }) => ({
        role: user === 'user' ? 'user' : 'assistant',
        content,
      })), {});

      const content = res.choices[0]?.message?.content
      if (content) {
        setMessages(msgs => [...msgs, { content, user: 'assistant' }]);
      }
      setWaiting(false);
    }
  }, [canSend, input]);

  return (
    <Stack
      styles={{
        root: {
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
        },
      }}
    >
      <Stack.Item
        styles={{
          root: {
            overflow: "scroll",
          },
        }}
        grow={1}
      >
        <MessageStream messages={messages}></MessageStream>
      </Stack.Item>
      <Stack.Item>
        <Stack horizontal tokens={{ childrenGap: 5 }}>
          <Stack.Item grow={1}>
            <TextField
              value={input}
              onChange={useCallback(
                (_: any, value: string = "") => setInput(value || ""),
                []
              )}
              onKeyDown={useCallback(
                (e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter" && canSend) {
                    send();
                  }
                },
                [canSend, send]
              )}
            ></TextField>
          </Stack.Item>
          <Stack.Item>
            <PrimaryButton
              text="Send"
              disabled={!canSend}
              onClick={send}
            ></PrimaryButton>
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
}

export default App;
