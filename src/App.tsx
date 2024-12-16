import { Navigate, Route, Routes } from "react-router-dom";;

import { Toaster } from "react-hot-toast";

import { LanguageSelect } from "./components";

import { MainRouter } from "./router/MainRouter";

const App = () => {
  return (
    <>
      <Toaster />

      <div className="fixed top-[10px] right-[10px] z-40">
        <LanguageSelect />
      </div>

      <Routes>
        <Route path="/:schoolName/*" element={<MainRouter />} />
        <Route path="/*" element={<Navigate to={`/:schoolName/initial`} replace />} />
      </Routes>
    </>
  );
};

export default App;
