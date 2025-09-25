import { useEffect, useRef, useState } from "react";

export default function useScrollReveal() {
  const elRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    function check() {
      const el = elRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight - 80) setShow(true);
    }
    window.addEventListener("scroll", check);
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);

  return [elRef, show];
}
