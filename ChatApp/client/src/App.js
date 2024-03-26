import React from "react";
import { Route, Routes } from "react-router-dom";
import { MainPage } from "./components/Main/MainPage";
import { ChatPage } from "./components/Chat/ChatPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/chat" element={<ChatPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
