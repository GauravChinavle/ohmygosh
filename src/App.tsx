
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JsonBeautifier from "./pages/JsonBeautifier";
import XmlBeautifier from "./pages/XmlBeautifier";
import JsonToCsv from "./pages/JsonToCsv";
import CsvToJson from "./pages/CsvToJson";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/json-beautifier" element={<JsonBeautifier />} />
          <Route path="/xml-beautifier" element={<XmlBeautifier />} />
          <Route path="/json-to-csv" element={<JsonToCsv />} />
          <Route path="/csv-to-json" element={<CsvToJson />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
