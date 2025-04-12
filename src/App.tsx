import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import SuperAdminDashboard from "./pages/dashboard/SuperAdminDashboard";
import SubAdminDashboard from "./pages/dashboard/SubAdminDashboard";
import SecretaryDashboard from "./pages/dashboard/SecretaryDashboard";
import ClinicPage from "./pages/dashboard/ClinicPage";
import ReportsPage from "./pages/dashboard/ReportsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import PaymentsPage from "./pages/dashboard/PaymentsPage";
import AppointmentsPage from "./pages/dashboard/AppointmentsPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Super Admin Routes */}
            <Route path="/SuperAdmin" element={<SuperAdminDashboard />} />
            <Route path="/SuperAdmin/clinics" element={<ClinicPage />} />
            <Route path="/SuperAdmin/reports" element={<ReportsPage />} />
            <Route path="/SuperAdmin/settings" element={<SettingsPage />} />

            {/* Sub Admin Routes */}
            <Route path="/SubAdmin" element={<SubAdminDashboard />} />
            <Route path="/SubAdmin/clinics" element={<ClinicPage />} />
            <Route path="/SubAdmin/payments" element={<PaymentsPage />} />
            <Route path="/SubAdmin/reports" element={<ReportsPage />} />
            <Route path="/SubAdmin/settings" element={<SettingsPage />} />

            {/* Secretary Routes */}
            <Route path="/Secretary" element={<SecretaryDashboard />} />
            <Route
              path="/Secretary/appointments"
              element={<AppointmentsPage />}
            />
            <Route path="/Secretary/settings" element={<SettingsPage />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </UserProvider>
    </Router>
  </QueryClientProvider>
);

export default App;
