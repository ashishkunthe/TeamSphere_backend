import WebSocket from "ws";

const rooms = new Map<string, Set<WebSocket>>();

export function addConnectionsToRoom(roomId: string, socket: WebSocket) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }

  rooms.get(roomId)!.add(socket);
}

export function removeConnectionFromRoom(roomId: string, socket: WebSocket) {
  const room = rooms.get(roomId);

  if (!room) return;

  room.delete(socket);

  if (room.size === 0) {
    rooms.delete(roomId);
  }
}

export function broadCastToRoom(roomId: string, message: unknown) {
  const room = rooms.get(roomId);

  if (!room) return;

  const data = JSON.stringify(message);

  for (const socket of room) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(data);
    }
  }
}
