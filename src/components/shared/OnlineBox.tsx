import useOnlinePVUser from "@/hooks/useOnlinePVUser";

const OnlineBox = ({ receiverId = "" }: { receiverId?: any }) => {
  const { isOnline } = useOnlinePVUser(String(receiverId));

  return (
    isOnline && (
      <span className="absolute bottom-0 left-0 size-3 rounded-full border-2 border-[#07101f] bg-emerald-400" />
    )
  );
};

export default OnlineBox;
