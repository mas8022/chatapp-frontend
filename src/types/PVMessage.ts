export interface PVReplyToType {
  id: number;
  text?: string | null;
  mediaUrl?: string | null;
}

export interface PVMessageType {
  id: number;
  senderId: number;
  text?: string | null;
  mediaUrl?: string | null;
  time: string;
  replyTo?: PVReplyToType | null;
}
