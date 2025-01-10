import { useState } from "react";

const Box = ({ children, refresh }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {/* <button className="btn-refresh" onClick={refresh}>
        ⟳
      </button> */}

      {isOpen && children}
    </div>
  );
};

export default Box;
