
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">
          Data Formatting Utilities
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Simple and powerful tools for your data transformation needs
        </p>
        
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
