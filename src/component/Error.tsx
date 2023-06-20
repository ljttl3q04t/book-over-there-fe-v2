import { useEffect, useState } from "react";

export const useBeforeRender = (callback: any, deps: any) => {
  const [isRun, setIsRun] = useState(false);

  if (!isRun) {
    callback();
    setIsRun(true);
  }

  useEffect(() => () => setIsRun(false), deps);
};
