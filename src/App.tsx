import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import CoursesPage from "./pages/dashboard/CoursesPage";
import SchemesPage from "./pages/dashboard/SchemesPage";
import MarketplacePage from "./pages/dashboard/MarketplacePage";
import EventsPage from "./pages/dashboard/EventsPage";
import CertificationPage from "./pages/dashboard/CertificationPage";
import MentorshipPage from "./pages/dashboard/MentorshipPage";
import AIAssistantPage from "./pages/dashboard/AIAssistantPage";
import CommunityPage from "./pages/dashboard/CommunityPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import DocumentsPage from "./pages/dashboard/DocumentsPage";
import AchievementsPage from "./pages/dashboard/AchievementsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="schemes" element={<SchemesPage />} />
            <Route path="marketplace" element={<MarketplacePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="certification" element={<CertificationPage />} />
            <Route path="mentorship" element={<MentorshipPage />} />
            <Route path="ai-assistant" element={<AIAssistantPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="achievements" element={<AchievementsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
