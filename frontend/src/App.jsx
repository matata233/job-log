import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import JobBoard from "./pages/JobBoard";
import DocumentsPage from "./pages/DocumentsPage";
import DashboardPage from "./pages/DashboardPage";
import BoardReports from "./pages/board/BoardReports";
import JobDetailsModal from "./pages/JobDetailsModal";
import JobEdit from "./pages/jobDetails/JobEdit";
import JobDocuments from "./pages/jobDetails/JobDocuments";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import ResetPwdPage from "./pages/auth/ResetPwdPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivateRoute from "./components/routes/PrivateRoute";
import AuthRedirect from "./components/routes/AuthRedirect";
import CommonLayout from "./components/routes/CommonLayout";
import DocumentDetailsModal from "./pages/DocumentDetailsModal";
import AddDocModal from "./pages/AddDocModal";
import AddJobMethodSelectModal from "./pages/addJob/AddJobMethodSelectModal";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "./App.css";

function App() {
  NProgress.configure({
    minimum: 0.08,
    speed: 500,
    easing: "ease",
    trickleSpeed: 200,
    showSpinner: false,
  });

  return (
    <div className="font-poppins">
      <Router>
        <main>
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <AuthRedirect>
                  <LandingPage />
                </AuthRedirect>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRedirect>
                  <SignupPage />
                </AuthRedirect>
              }
            />
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <LoginPage />
                </AuthRedirect>
              }
            />

            <Route
              path="/reset-pwd"
              element={
                <AuthRedirect>
                  <ResetPwdPage />
                </AuthRedirect>
              }
            />

            {/* Private routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<CommonLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route
                  path="/documents/:documentId"
                  element={<DocumentDetailsModal />}
                />

                <Route path="/add-doc" element={<AddDocModal />} />
                <Route path="/add-doc/:jobId" element={<AddDocModal />} />

                <Route path="/settings" element={<SettingsPage />} />

                <Route path="/board/:boardId" element={<JobBoard />}>
                  <Route
                    path="column/:columnId/add-job"
                    element={<AddJobMethodSelectModal />}
                  />
                  <Route path="job/:jobId" element={<JobDetailsModal />}>
                    <Route path="edit" element={<JobEdit />} />
                    <Route path="documents" element={<JobDocuments />} />
                  </Route>
                </Route>
                <Route
                  path="/board/:boardId/reports"
                  element={<BoardReports />}
                />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
