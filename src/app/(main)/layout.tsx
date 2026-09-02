"use client";

import useOnlinePVUser from "@/hooks/useOnlinePVUser";

const layout = ({ children }: { children: React.ReactNode }) => {
  useOnlinePVUser();
  
  return <div>{children}</div>;
};

export default layout;
