const myWorker = new SharedWorker("/embed/worker.js");
myWorker.port.start();

window.addEventListener("message", (event) => {
  const { origin, data } = event;
  myWorker.port.postMessage({ from: 'client', origin, data });
}, false);