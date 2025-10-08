import { WebSocket, WebSocketServer } from "ws";
import { parse } from "url";
import type { IncomingMessage } from "http";

const rooms = new Map<string, Set<WebSocket>>();

const wss = new WebSocketServer({ port: 8080 });

wss.on("listening", () => {
  console.log(`WebSocket server is live at ws://localhost:8080`);
});

function broadcastUserCount(roomId: string, newClient?: WebSocket) {
  const room = rooms.get(roomId);
  if (!room) return;

  const payloadForExisting = JSON.stringify({
    type: "userCount",
    count: room.size,
    ImNew: false,
  });
  const payloadForNew = JSON.stringify({
    type: "userCount",
    count: room.size,
    ImNew: true,
  });

  room.forEach((client) => {
    if (client.readyState !== WebSocket.OPEN) return;

    if (client === newClient) {
      client.send(payloadForNew);
    } else {
      client.send(payloadForExisting);
    }
  });
}

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  if (!req.url) {
    ws.close(1008, "URL is required");
    return;
  }

  const { query } = parse(req.url, true);
  const roomId = query.roomId;
  if (!roomId || typeof roomId !== "string") {
    ws.close(1008, "Room ID is required");
    return;
  }

  if (!rooms.has(roomId)) rooms.set(roomId, new Set());
  const room = rooms.get(roomId)!;
  room.add(ws);

  broadcastUserCount(roomId, ws);

  ws.on("error", console.error);

  ws.on("message", (message) => {
    room.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => {
    room.delete(ws);
    broadcastUserCount(roomId);

    if (room.size === 0) {
      rooms.delete(roomId);
      console.log(`Room ${roomId} is now empty.`);
    }
  });
});
