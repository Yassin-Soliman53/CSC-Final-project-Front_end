import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_URL;

const socket = URL
  ? io(URL.replace(/\/$/, ""), {
      autoConnect: false,
      withCredentials: true,
    })
  : {
      connected: false,
      on: () => undefined,
      off: () => undefined,
      connect: () => undefined,
      disconnect: () => undefined,
      emit: () => undefined,
      timeout: () => ({
        emit: () => undefined,
      }),
    };
export default socket;
