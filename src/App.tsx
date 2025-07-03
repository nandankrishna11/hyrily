import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Interview from "./pages/Interview";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import CompanyLogin from "./pages/CompanyLogin";
import CompanySessionLink from "./pages/CompanySessionLink";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanySessionMonitor from "./pages/CompanySessionMonitor";
import CompanyInterviewSession from "./components/CompanyInterviewSession";
import CandidateLogin from "./pages/CandidateLogin";
import CandidateInterview from "./pages/CandidateInterview";
import JoinInterview from './pages/JoinInterview';
import AuthWrapper from "@/components/AuthWrapper";
import CompanyStackSelection from "./pages/CompanyStackSelection";
import CandidatePortal from "./pages/CandidatePortal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<AuthWrapper><div /></AuthWrapper>} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/select-role" element={<CompanyStackSelection />} />
          <Route path="/student" element={<Interview />} />
          <Route path="/company" element={<CompanyLogin />} />
          <Route path="/company/session-link" element={<CompanySessionLink />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/session/:sessionId" element={<CompanySessionMonitor />} />
          <Route path="/company/interview-session" element={<CompanyInterviewSession />} />
          <Route path="/candidate/login" element={<CandidateLogin />} />
          <Route path="/candidate/interview" element={<CandidateInterview />} />
          <Route path="/join/:sessionId" element={<JoinInterview />} />
          <Route path="/candidate-portal" element={<CandidatePortal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
