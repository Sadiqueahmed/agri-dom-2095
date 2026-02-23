import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "./i18n";
import Index from "./pages/Index";
import ParcelsPage from "./pages/ParcelsPage";
import ParcelsDetailsPage from "./pages/ParcelsDetailsPage";
import CropsPage from "./pages/CropsPage";
import InventoryPage from "./pages/InventoryPage";
import FinancePage from "./pages/FinancePage";
import StatsPage from "./pages/StatsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import { useEffect } from "react";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { CRMProvider } from "./contexts/CRMContext";
import { StatisticsProvider } from "./contexts/StatisticsContext";
import { AppSettingsProvider, useAppSettings } from "./contexts/AppSettingsContext";
import { trackPageView } from "./utils/analytics";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Define routes configuration with redirects
const publicRoutes = [
  { path: "/", element: <LandingPage /> },
  { path: "/sign-in/*", element: <SignInPage /> },
  { path: "/sign-up/*", element: <SignUpPage /> },
];

const protectedRoutes = [
  { path: "/dashboard", element: <Index /> },
  { path: "/parcelles", element: <ParcelsPage /> },
  { path: "/parcelles/:id", element: <ParcelsDetailsPage /> },
  { path: "/cultures", element: <CropsPage /> },
  { path: "/inventaire", element: <InventoryPage /> },
  { path: "/finances", element: <FinancePage /> },
  { path: "/statistiques", element: <StatisticsProvider><StatsPage /></StatisticsProvider> },
  { path: "/rapports", element: <ReportsPage /> },
  { path: "/parametres", element: <SettingsPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "*", element: <NotFound /> }
];

// Hardcode the test key provided by the user if the environment variable setup isn't active
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_ZnVsbC1kcmFrZS0zNS5jbGVyay5hY2NvdW50cy5kZXYk";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Create query client with enhanced configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Router change handler component
const RouterChangeHandler = () => {
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    // Track page view for analytics
    const currentPath = window.location.pathname;
    const pageName = currentPath === '/' ? 'dashboard' : currentPath.replace(/^\//, '');
    trackPageView(pageName);
  }, [location.pathname]);

  return null;
};

// Global settings applier component
const GlobalSettingsApplier = () => {
  const { settings } = useAppSettings();
  const { i18n } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    // Apply Dark Mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply Language
    if (settings.locale && settings.locale !== i18n.language) {
      i18n.changeLanguage(settings.locale);
    }
  }, [settings.darkMode, settings.locale, i18n]);

  // Mock Auto-Sync feature
  useEffect(() => {
    let syncIntervalId: ReturnType<typeof setInterval>;

    if (settings.dataSync.autoSync && settings.dataSync.syncInterval > 0) {
      // Convert minutes to milliseconds
      const intervalMs = settings.dataSync.syncInterval * 60 * 1000;

      syncIntervalId = setInterval(() => {
        console.log(`[Sync] Performing background sync every ${settings.dataSync.syncInterval}m...`);
        // We might not want to toast every time in a real app, 
        // but for demonstration that the setting works:
        toast({
          title: "Background Sync Complete",
          description: "Data synchronized successfully.",
          variant: "default"
        });
      }, intervalMs);
    }

    return () => {
      if (syncIntervalId) {
        clearInterval(syncIntervalId);
      }
    };
  }, [settings.dataSync.autoSync, settings.dataSync.syncInterval, toast]);

  return null;
};

// Application main component with properly nested providers
const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <AppSettingsProvider>
          <CRMProvider>
            <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
              <BrowserRouter>
                <TooltipProvider>
                  <RouterChangeHandler />
                  <GlobalSettingsApplier />
                  <Routes>
                    {/* Public Routes */}
                    {publicRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                      />
                    ))}

                    {/* Protected Routes */}
                    {protectedRoutes.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        element={
                          <>
                            <SignedIn>
                              {route.element}
                            </SignedIn>
                            <SignedOut>
                              <RedirectToSignIn />
                            </SignedOut>
                          </>
                        }
                      />
                    ))}
                  </Routes>
                  <Toaster />
                </TooltipProvider>
              </BrowserRouter>
            </ClerkProvider>
          </CRMProvider>
        </AppSettingsProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default App;