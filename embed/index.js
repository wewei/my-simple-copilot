const bc = new BroadcastChannel("register");

window.addEventListener("message", (event) => {
  const { origin, data } = event;
  bc.postMessage({ from: 'client', origin, data });
  window.close();
}, false);
