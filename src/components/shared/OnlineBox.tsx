import useOnlinePVUser from "@/hooks/useOnlinePVUser";
import { HubConnection } from "@microsoft/signalr";

const OnlineBox = ({
  receiverId = "",
  signal,
}: {
  receiverId?: any;
  signal: HubConnection | null;
}) => {
  const { isOnline } = useOnlinePVUser(String(receiverId), signal);

  return (
    isOnline && (
      <span className="absolute bottom-0 left-0 size-3 rounded-full border-2 border-[#07101f] bg-emerald-400" />
    )
  );
};

export default OnlineBox;
