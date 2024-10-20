import "./App.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import React from "react";
import { Provider } from "react-redux";
import { Buffer } from "buffer";

import store from "./redux/store";
import ClientVIew from "./view/client";

if (!Buffer) {
  window.Buffer = require("buffer").Buffer;
}

function App() {
  return (
    <div>
      <Provider store={store}>
        <ClientVIew />
      </Provider> 
    </div>
  );
}

export default App;
