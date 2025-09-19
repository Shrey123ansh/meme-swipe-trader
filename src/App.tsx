import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TradingInterface from "./pages/TradingInterface";
import MemeFeedPage from "./pages/MemeFeedPage";
import CopyTradingPage from "./pages/CopyTradingPage";
import WalletTrackerPage from "./pages/WalletTrackerPage";
import TelegramSetupPage from "./pages/TelegramSetupPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trading" element={<TradingInterface />} />
            <Route path="/meme-feed" element={<MemeFeedPage />} />
            <Route path="/copy-trading" element={<CopyTradingPage />} />
            <Route path="/wallet-tracker" element={<WalletTrackerPage />} />
            <Route path="/telegram-setup" element={<TelegramSetupPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
