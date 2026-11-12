
import { useRef, useState } from "react";

function DirectionHover({
  title,
  textColor = "inherit",
  hoverColor = "#6E92FF",
  className = "",
}) {
  const ref = useRef(null);
  const [direction, setDirection] = useState("none");

  const handleEnter = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const y = e.clientY - rect.top;

    setDirection(y < rect.height / 2 ? "top" : "bottom");
  };

  const lineBox = "1em";

  const translate = {
    none: "-1em",
    top: "0em",
    bottom: "-2em",
  };

  return (
    <span
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setDirection("none")}
      className={`direction-hover ${className}`}
      style={{
        height: lineBox,
        cursor: "pointer",
        overflow: "hidden",
        display: "inline-block",
        verticalAlign: "top",
      }}
    >
      <span
        className="direction-hover-inner"
        style={{
          display: "flex",
          flexDirection: "column",
          transform: `translateY(${translate[direction]})`,
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <span style={{ color: hoverColor }}>{title}</span>
        <span style={{ color: textColor }}>{title}</span>
        <span style={{ color: hoverColor }}>{title}</span>
      </span>
    </span>
  );
}

export default DirectionHover;
