import React from "react";

const colors = ["red", "green", "black", "blue", "yellow"];

const ColorPicker = ({ onSelectColor }) => {
  return (
    <div>
      {colors.map((color) => (
        <button
          key={color}
          style={{ backgroundColor: color, width: "30px", height: "30px", margin: "5px" }}
          onClick={() => onSelectColor(color)}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
