import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

async function post(url: string, body: any): Promise<any> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status !== 200) {
    throw await res.json();
  }

  return res.json();
}

async function get(url: string): Promise<any> {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (res.status !== 200) {
    throw await res.json();
  }

  return res.json();
}
async function main() {
  try {
    console.log(
      await post("/api/chat", {
        messages: [
          {
            role: "system",
            content:
              "You are involved in a chat with 2 users, you need to figure out who is more aggresive, and who is more planned. You can give your score to them from 1 to 10. (1 for less aggressive, less planned, 10 on the other side).",
          },
          {
            role: "user",
            name: "Lucy",
            content:
              "John, I am glad we're in the same group for the history class assignment.",
          },
          {
            role: "user",
            name: "John",
            content: "What topic should we choose?",
          },
          {
            role: "user",
            name: "Lucy",
            content:
              "I want to do a survey of Roman emperors. What's your opinion?",
          },
          {
            role: "user",
            name: "John",
            content: "I've no preferences. I'll do whatever you choose.",
          },
        ],
        options: { maxTokens: 1000 },
      })
    );
  } catch (e: any) {
    console.error("[Server Error]", e.message);
    console.error("[Server Error]", e.stack);
  }
}

// main();
