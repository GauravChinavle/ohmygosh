
import { FileJson, FileCode, FileSpreadsheet, FileText } from "lucide-react";
import { UtilityCard } from "@/components/UtilityCard";

const UTILITY_CARDS = [
  {
    title: "JSON Beautifier",
    description: "Format and beautify your JSON data with proper indentation and structure",
    icon: FileJson,
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
    <div className="min-h-screen bg-[#121212] text-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Developer Data Utilities
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Streamline your data transformation workflow with powerful, developer-friendly tools
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {UTILITY_CARDS.map((card, index) => (
            <UtilityCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
