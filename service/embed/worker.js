let serverPort = null;

onconnect = (e) => {
  const port = e.ports[0];

  port.addEventListener("message", e => {
    const data = e.data;
    console.log(data);
    if (data.from === "server") {
      console.log("register erver");
      serverPort = port;
    } else if (data.from === "client" && serverPort) {
      console.log("send message to server", data);
      serverPort.postMessage(data);
    }
  });

  port.start();
}