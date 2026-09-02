export interface PVMessage {
  id: number;
  senderId: number;
  text?: string | null;
  mediaUrl?: string | null;
  time: string;
}