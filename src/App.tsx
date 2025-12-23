import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import ToolPage from "./pages/ToolPage";
import Auth from "./pages/Auth";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import { AdminDashboard, AdminAds, AdminEmails, AdminBanners, AdminSEO, AdminAnalytics, AdminSettings } from "./pages/admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/history" element={<History />} />
            <Route path="/tool/:toolId" element={<ToolPage />} />
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/ads" element={<AdminAds />} />
            <Route path="/admin/emails" element={<AdminEmails />} />
            <Route path="/admin/banners" element={<AdminBanners />} />
            <Route path="/admin/seo" element={<AdminSEO />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
