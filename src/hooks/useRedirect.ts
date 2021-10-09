import { useLayoutEffect } from "react";

import history from "utils/history";

/**
 * React hook to redirect to another screen given some condition
 *
 * @param to the screen that you want to redirect to
 * @param condition the condition that will trigger the redirect
 */
const useRedirect = (to: string, condition: boolean): void => {
  useLayoutEffect(() => {
    if (condition) history.push(to);
  }, [condition, to]);
};

export default useRedirect;
