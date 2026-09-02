export default interface ContactType {
  id: number;
  name: string;
  avatar?: string | null;
  lastMessage?: string | null;
  lastMessageTime?: string | null;
};
