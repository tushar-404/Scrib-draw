import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("listening", () => {
  console.log(`server is live at ws://localhost:8080`);
});

wss.on(`connection`, (ws) => {
  ws.on(`error`, console.error);
  ws.on(`message`, (e) => {
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(e.toString());
      }
    });
  });
  ws.on(`close`, () => {
    console.log(`user Disconnected`);
  });
});
