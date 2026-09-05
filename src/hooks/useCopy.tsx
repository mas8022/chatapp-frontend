import { useState } from "react";

const useCopy = (username?: string, duration: number = 2000) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(`${username}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), duration);
  };

  return { copy, isCopied };
};

export default useCopy;
