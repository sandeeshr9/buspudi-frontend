import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { LoadingSkeleton } from "@/components/common/States";
import { AppLayout } from "@/components/layout/AppLayout";
import { TooltipProvider } from "@/components/ui/misc";
import { AppProvider, useApp } from "@/context/AppContext";
import { SimulationProvider } from "@/context/SimulationContext";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import LandingPage from "@/pages/LandingPage";
import { AboutPage, ContactPage, NotFoundPage, PrivacyPage, TermsPage } from "@/pages/InfoPages";

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const LiveTrackingPage = lazy(() => import("@/pages/LiveTrackingPage"));
const JourneyPlannerPage = lazy(() => import("@/pages/JourneyPlannerPage"));
const BusDetailsPage = lazy(() => import("@/pages/BusDetailsPage"));
const StopsPage = lazy(() => import("@/pages/StopsPage"));
const OccupancyPage = lazy(() => import("@/pages/OccupancyPage"));
const AlertsPage = lazy(() => import("@/pages/AlertsPage"));
const AccessibilityPage = lazy(() => import("@/pages/AccessibilityPage"));
const SavedPage = lazy(() => import("@/pages/SavedPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const OperatorDashboardPage = lazy(() => import("@/pages/OperatorDashboardPage"));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (!hash) window.scrollTo(0, 0); }, [pathname, hash]);
  return null;
}

function ThemedToaster() {
  const { resolvedTheme } = useApp();
  return <Toaster theme={resolvedTheme} position="top-center" richColors closeButton toastOptions={{ style: { fontFamily: "Inter, sans-serif" } }} />;
}

const Fallback = () => <div className="p-6"><LoadingSkeleton rows={4} /></div>;

export default function App() {
  return (
    <AppProvider>
      <SimulationProvider>
        <TooltipProvider>
          <BrowserRouter>
            <ScrollToTop />
            <ErrorBoundary>
              <Suspense fallback={<Fallback />}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/operator" element={<OperatorDashboardPage />} />
                  <Route path="/app" element={<AppLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="track" element={<LiveTrackingPage />} />
                    <Route path="plan" element={<JourneyPlannerPage />} />
                    <Route path="bus/:id" element={<BusDetailsPage />} />
                    <Route path="stops" element={<StopsPage />} />
                    <Route path="occupancy" element={<OccupancyPage />} />
                    <Route path="alerts" element={<AlertsPage />} />
                    <Route path="accessibility" element={<AccessibilityPage />} />
                    <Route path="saved" element={<SavedPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
          <ThemedToaster />
        </TooltipProvider>
      </SimulationProvider>
    </AppProvider>
  );
}
