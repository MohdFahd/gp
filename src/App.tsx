
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Super Admin Routes */}
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/super-admin/clinics" element={<ClinicPage />} />
            <Route path="/super-admin/reports" element={<ReportsPage />} />
            <Route path="/super-admin/settings" element={<SettingsPage />} />

            {/* Sub Admin Routes */}
            <Route path="/sub-admin" element={<SubAdminDashboard />} />
            <Route path="/sub-admin/clinics" element={<ClinicPage />} />
            <Route path="/sub-admin/payments" element={<PaymentsPage />} />
            <Route path="/sub-admin/reports" element={<ReportsPage />} />
            <Route path="/sub-admin/settings" element={<SettingsPage />} />

            {/* Secretary Routes */}
            <Route path="/secretary" element={<SecretaryDashboard />} />
            <Route path="/secretary/appointments" element={<AppointmentsPage />} />
            <Route path="/secretary/settings" element={<SettingsPage />} />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
