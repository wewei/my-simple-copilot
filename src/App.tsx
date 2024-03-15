import { Stack, TextField, PrimaryButton, MessageBar, Link, MessageBarType, MessageBarButton } from "@fluentui/react";
// import "./App.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageStream, Message } from "./MessageStream";
import { post, chat } from "./api";
import { ChatCompletionsToolDefinition, ChatRequestMessage } from "@azure/openai";

// const content =
//   "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui";
// const user = "OpenAI";

type Register = {
  origin: string;
  functions: {
    name: string;
    target: string;
    description: string;
    parameters: any;
    require: string[];
    interpret?: string;
  }[]
};

// const myWorker = new SharedWorker('/embed/worker.js');
const bc = new BroadcastChannel("register");

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const canSend = useMemo(() => input && !waiting, [input, waiting]);
  const [registers, setRegisters] = useState<Register[]>([]);
  const [tools, setTools] = useState<ChatCompletionsToolDefinition[]>([]);
  const [funcs, setFuncs] = useState<Record<string, string>>({});
  const [interprets, setInterprets] = useState<Record<string, string>>({});

  useEffect(() => {
    bc.addEventListener("message", ({ data }) => {
      if (data.from === "client") {
        if (data.data.func === "register") {
          console.log(data.data);
          const orig = data.origin;

          setRegisters((regs) =>
            regs.findIndex(({ origin }) => origin === orig) < 0
              ? [
                  ...regs,
                  {
                    origin: orig,
                    functions: data.data.functions,
                  },
                ]
              : regs
          );
          console.log("from broadcast channel", data.data);
        }
      }
    });

    return () => {
      bc.close();
    };
  }, [bc]);

  const send = useCallback(async () => {
    if (canSend) {
      console.log(input);
      const newMessages = [...messages, { content: input, user: "user" }];
      setMessages(newMessages);
      setInput("");
      setWaiting(true);
      const oaiMessages: ChatRequestMessage[] = 
        newMessages.map(({ content, user }) => ({
          role: user === "user" ? "user" : "assistant",
          content,
        }));

      const res = await chat(
        oaiMessages,
        tools.length > 0
          ? {
              toolChoice: "auto",
              tools,
            }
          : {}
      );

      const message = res.choices[0]?.message;
      if (message) {
        const content = message.content;
        if (content) {
          setMessages((msgs) => [...msgs, { content, user: "assistant" }]);
        }
        const toolCall = message.toolCalls[0];
        if (toolCall) {
          const { name } = toolCall.function;
          const target = funcs[name];
          const interpret = interprets[name];
          const args = JSON.parse(toolCall.function.arguments);

          const data = await post(target, args);

          if (interpret) {
            const res2 = await chat([
              {
                role: "system",
                content: `${interpret} ${JSON.stringify(data)}`,
              },
            ], {});
            const msg2 = res2.choices[0]?.message;
            if (msg2) {
              const content = msg2.content;
              if (content) {
                setMessages((msgs) => [...msgs, { content, user: "assistant" }]);
              }
            }
          } else {
            setMessages((msgs) => [
              ...msgs,
              { content: JSON.stringify(data), user: "assistant" },
            ]);
          }
        }
      }
      setWaiting(false);
    }
  }, [canSend, input, funcs]);

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
      <Stack.Item>
        {registers.map(({ origin, functions }) => {
          return (
            <MessageBar
              messageBarType={MessageBarType.warning}
              actions={
                <span>
                  <MessageBarButton
                    onClick={() => {
                      setTools((tls) =>
                        tls.concat(
                          functions.map(
                            ({ name, description, parameters, require }) => ({
                              type: "function",
                              function: {
                                name,
                                description,
                                parameters: {
                                  type: "object",
                                  properties: parameters,
                                  require,
                                },
                              },
                            })
                          )
                        )
                      );
                      setRegisters((regs) =>
                        regs.filter((reg) => reg.origin !== origin)
                      );
                      setFuncs((funcs) =>
                        functions.reduce(
                          (m, { name, target }) => {
                            m[name] = target;
                            return m;
                          },
                          { ...funcs }
                        )
                      );
                      setInterprets((interprets) =>
                        functions.reduce(
                          (m, { name, interpret }) => {
                            if (interpret) {
                              m[name] = interpret;
                            }
                            return m;
                          },
                          { ...interprets }
                        )
                      );
                    }}
                  >
                    Accept
                  </MessageBarButton>
                  <MessageBarButton
                    onClick={() => {
                      setRegisters((regs) =>
                        regs.filter((reg) => reg.origin !== origin)
                      );
                    }}
                  >
                    Reject
                  </MessageBarButton>
                </span>
              }
            >
              Site &nbsp;
              <Link href={origin}>{origin}</Link>
              &nbsp;is requesting to add {functions.length} function
              {functions.length > 1 ? "s" : ""} into your copilot.
            </MessageBar>
          );
        })}
      </Stack.Item>
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
