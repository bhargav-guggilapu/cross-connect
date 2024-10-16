import React from "react";

function Button({
  icon: Icon,
  bgColor,
  onClick,
  text,
  customStyles,
  buttonStyles,
  isDisabled,
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-semibold transition duration-300 flex items-center ${bgColor} ${customStyles}`}
      disabled={isDisabled}
    >
      {Icon && <Icon className={`${buttonStyles ? buttonStyles : "mr-2"}`} />}{" "}
      {text}
    </button>
  );
}

export default Button;
