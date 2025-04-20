import { FileJson, FileCode, FileSpreadsheet, FileText } from "lucide-react";
import { UtilityCard } from "@/components/UtilityCard";

const UTILITY_CARDS = [
  {
    title: "JSON Beautifier",
    description: "Format and beautify your JSON data with proper indentation and structure",
    icon: FileJson,
    route: "/json-beautifier"
  },
  {
    title: "XML Beautifier",
    description: "Clean and format XML documents for better readability",
    icon: FileCode,
  },
  {
    title: "JSON to CSV",
    description: "Convert your JSON data into CSV format easily",
    icon: FileText,
  },
  {
    title: "CSV to Excel",
    description: "Transform CSV files into Excel spreadsheets",
    icon: FileSpreadsheet,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
            ohmygosh.io
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto opacity-90 px-4">
            Developer tools that make you say "Oh My Gosh!" Simple. Fast. Beautiful.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {UTILITY_CARDS.map((card, index) => (
            <UtilityCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              route={card.route}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
