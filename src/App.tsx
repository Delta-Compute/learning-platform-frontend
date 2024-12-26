import { Navigate, Route, Routes } from "react-router-dom";;

import { Toaster } from "react-hot-toast";

import { MainRouter } from "./router/MainRouter";

const App = () => {
  return (
    <>
      <Toaster />

      <Routes>
        <Route path="/:schoolName/*" element={<MainRouter />} />
        <Route path="/*" element={<Navigate to={`/:schoolName/initial`} replace />} />
      </Routes>
    </>
  );
};

export default App;
