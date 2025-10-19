// Simple websocket helper for lesson real-time updates
// Usage:
// const ws = connectLessonSocket(lessonId, (msg) => { ... })
// ws.close() to disconnect

export interface LessonSocketMessage {
  type: string;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function connectLessonSocket(
  lessonId: string,
  onMessage: (data: LessonSocketMessage) => void,
  options: {
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (e: Event) => void;
  } = {}
) {
  // Derive ws base from current origin (supports local dev without config)
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const host = window.location.host; // adjust if backend served elsewhere
  const url = `${protocol}://${host}/ws/lesson/${lessonId}/`;
  const socket = new WebSocket(url);

  socket.onopen = () => options.onOpen?.();
  socket.onclose = () => options.onClose?.();
  socket.onerror = (e) => options.onError?.(e);
  socket.onmessage = (event) => {
    try {
      const data: LessonSocketMessage = JSON.parse(event.data);
      onMessage(data);
    } catch {
      // ignore malformed
    }
  };

  return socket;
}
