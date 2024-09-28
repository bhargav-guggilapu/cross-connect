import React from "react";

function Button({
  icon: Icon,
  bgColor,
  onClick,
  text,
  customStyles,
  buttonStyles,
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-semibold transition duration-300 flex items-center ${bgColor} ${customStyles}`}
    >
      {Icon && <Icon className={`${buttonStyles ? buttonStyles : "mr-2"}`} />}{" "}
      {text}
    </button>
  );
}

export default Button;
