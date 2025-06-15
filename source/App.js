import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const Gmap = lazy(() => import("./structures/gmap/gmap.jsx"));
const Home = lazy(() => import("./Home.jsx"));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gmap" element={<Gmap />} />
      </Routes>
    </Suspense>
  </Router>
);

export default App;
