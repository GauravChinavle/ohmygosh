
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { JsonViewer } from "@/components/JsonViewer";

const JsonBeautifier = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonInput(value);
    try {
      if (value.trim()) {
        JSON.parse(value);
        setError(null);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
          JSON Beautifier
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Textarea 
              value={jsonInput}
              onChange={handleInputChange}
              placeholder="Paste your JSON here..."
              className="h-[600px] font-mono text-sm bg-[#1A1F2C] border-[#2C3645] text-gray-200 resize-none"
            />
            {error && (
              <div className="mt-2 text-red-400 text-sm font-mono">
                Error: {error}
              </div>
            )}
          </div>
          
          <div className="bg-[#1A1F2C] border border-[#2C3645] rounded-lg overflow-hidden">
            <JsonViewer 
              jsonString={jsonInput} 
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonBeautifier;
