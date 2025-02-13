import React from "react";

const modal = ({ isVisible, children, onClose}) => {
  if (!isVisible) return null;

    const handleClose = (e) => {
        if(e.target.id === 'wrapper') onClose();
    }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
    id="wrapper"
    onClick={handleClose}
    >
      <div className="w-[600px] flex flex-col">
        <button className="place-self-end p-1 mr-1 text-gray-100"
        onClick={() => onClose()}
        >X</button>
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default modal;
