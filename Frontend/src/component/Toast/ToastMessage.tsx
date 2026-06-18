import React from "react";
import { createRoot } from "react-dom/client";
import Toast from "./Toast";
import { MessageType } from "../../Data/AppEnum"; // adjust path

const CONTAINER_ID = "toast-container";


const getContainer = () => {
  let container = document.getElementById(CONTAINER_ID);
  if (!container) {
    container = document.createElement("div");
    container.id = CONTAINER_ID;
    container.style.cssText = "position:fixed; top:16px; right:16px; z-index:9999;";
    document.body.appendChild(container);
  }
  return container;
};

const ToastMessage = (type: MessageType, message: string, duration = 3000) => {
  const container = getContainer();
  const wrapper = document.createElement("div");
  container.appendChild(wrapper);

  const root = createRoot(wrapper);
  root.render(
    <Toast
      type={type}
      message={message}
      duration={duration}
      onClose={() => {
        root.unmount();
        wrapper.remove();
      }}
    />
  );
};

export default ToastMessage;