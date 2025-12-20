import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import routes from "./routes.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </BrowserRouter>
    </AppWrapper>
  </StrictMode>
);
