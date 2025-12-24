import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import JobsAdmin from "./pages/admin/Jobs";
import AchievementsAdmin from "./pages/admin/Achievements";
import NewsAdmin from "./pages/admin/News";
import MerchandiseAdmin from "./pages/admin/Merchandise";
import MembersAdmin from "./pages/admin/Members";
import AlumniAdmin from "./pages/admin/Alumni";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/jobs" element={<JobsAdmin />} />
          <Route path="/admin/achievements" element={<AchievementsAdmin />} />
          <Route path="/admin/news" element={<NewsAdmin />} />
          <Route path="/admin/merchandise" element={<MerchandiseAdmin />} />
          <Route path="/admin/members" element={<MembersAdmin />} />
          <Route path="/admin/alumni" element={<AlumniAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
