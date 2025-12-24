import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LoadingFallback } from "@/components/LoadingFallback";

// Lazy load pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const ToolPage = lazy(() => import("./pages/ToolPage"));
const Auth = lazy(() => import("./pages/Auth"));
const History = lazy(() => import("./pages/History"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin routes - rarely accessed, load separately
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminAds = lazy(() => import("./pages/admin/AdminAds"));
const AdminEmails = lazy(() => import("./pages/admin/AdminEmails"));
const AdminBanners = lazy(() => import("./pages/admin/AdminBanners"));
const AdminSEO = lazy(() => import("./pages/admin/AdminSEO"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
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
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
