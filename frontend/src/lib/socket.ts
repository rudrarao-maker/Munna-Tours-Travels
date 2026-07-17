import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 10,
    });

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.warn('🔌 Socket connection error:', error.message);
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Helper to join a tracking room
export function trackBooking(bookingId: string) {
  const s = getSocket();
  s.emit('track-booking', bookingId);
}

// Helper to join fleet tracking
export function trackFleet() {
  const s = getSocket();
  s.emit('track-fleet');
}

// Helper to identify user type
export function identifyUser(type: 'customer' | 'driver' | 'admin', userId?: string, driverId?: string) {
  const s = getSocket();
  s.emit('identify', { type, userId, driverId });
}

// Helper to broadcast driver location
export function broadcastDriverLocation(data: {
  driverId: string;
  vehicleId?: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
}) {
  const s = getSocket();
  s.emit('driver-location', data);
}
