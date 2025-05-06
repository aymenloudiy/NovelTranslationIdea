import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Terms from "./pages/TermsPage.tsx";
import Error from "./pages/ErrorPage.tsx";
import Home from "./pages/HomePage.tsx";
import Library from "./pages/LibraryPage.tsx";
import Settings from "./pages/SettingsPage.tsx";
import ChaptersPage from "./pages/ChaptersPage.tsx";
import ChapterDetailPage from "./pages/ChapterDetailPage.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallback={<Error />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="home" element={<Home />} />
            <Route path="library" element={<Library />} />
            <Route path="library/:novelId" element={<ChaptersPage />} />
            <Route
              path="library/:novelId/:chapterNumber"
              element={<ChapterDetailPage />}
            />
            <Route path="terms" element={<Terms />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
