import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Initial check after component mounts
    checkDevice();

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", checkDevice);

    // Cleanup listener on component unmount
    return () => mql.removeEventListener("change", checkDevice);
  }, []); // Empty dependency array ensures this runs only once on mount

  return isMobile === undefined ? false : isMobile; // Return false during SSR or initial client render before state is set
}
