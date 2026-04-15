import { useState } from "react";
import { ToggleButton } from "./ToggleButton";

export function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <ToggleButton
        isOpen={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      />
      {isOpen && children}
    </div>
  );
}
