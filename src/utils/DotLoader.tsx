import React from "react";

const DotLoader: React.FC = React.memo(() => (
  <div className="dot-container flex gap-1" data-testid="dot-container">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        data-testid="dot"
        className={`dot w-2 h-2 bg-black rounded-full animate-pulse ${
          i > 0 ? `delay-${i}00` : ""
        }`}
      ></div>
    ))}
  </div>
));

export default DotLoader;