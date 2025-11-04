import { Route, Routes } from "react-router-dom";
import { Home } from "./components/Home/Home.tsx";
import { Ekonomia1 } from "./components/Ekonomia1/Ekonomia1.tsx";
import { OchronaWlasnosci } from "./components/OchronaWlasnosci/OchronaWlasnosci.tsx";

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ekonomia1" element={<Ekonomia1 />} />
        <Route path="/ochronaWlasnosci1" element={<OchronaWlasnosci />} />
      </Routes>
    </>
  );
};
