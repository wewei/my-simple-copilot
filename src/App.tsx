import { Stack, TextField, ITextField, PrimaryButton } from "@fluentui/react";
// import "./App.css";
import { useCallback, useState, useRef } from "react";
import { MessageStream, Message } from "./MessageStream";

// const content =
//   "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui";
// const user = "OpenAI";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [canSend, setCanSend] = useState(true);

  const send = useCallback(() => {
    if (canSend) {
      console.log(input);
      setMessages([...messages, { content: input, user: 'user' }]);
      setInput("");
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
        <MessageStream
          messages={messages}
        ></MessageStream>
      </Stack.Item>
      <Stack.Item>
        <Stack horizontal tokens={{ childrenGap: 5 }}>
          <Stack.Item grow={1}>
            <TextField
              value={input}
              onChange={useCallback((_: any, value: string = "") => setInput(value || ""), [])}
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
