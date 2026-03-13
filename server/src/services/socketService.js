let ioRef;

export const setSocketServer = (io) => {
  ioRef = io;
};

export const getSocketServer = () => ioRef;

export const emitRealtimeEvent = (eventName, payload) => {
  if (!ioRef) return;
  ioRef.emit(eventName, payload);
};
