
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { csvToJson } from "@/utils/conversion";
import { FileDown, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JsonViewer } from "@/components/JsonViewer";

const CsvToJson = () => {
  const [csvInput, setCsvInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"text" | "visual">("text");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCsvInput(value);
    setError(null);
    
    // For better UX, clear the output when input changes
    if (jsonOutput) {
      setJsonOutput("");
    }
  };

  const handleConvert = () => {
    if (!csvInput.trim()) {
      setError("Please enter CSV to convert");
      return;
    }

    const { json, error } = csvToJson(csvInput);
    
    if (error) {
      setError(error);
      setJsonOutput("");
    } else {
      setError(null);
      setJsonOutput(json || "");
      
      if (json) {
        toast({
          title: "Conversion successful",
          description: "CSV has been converted to JSON",
        });
      }
    }
  };

  const handleCopy = () => {
    if (!jsonOutput) return;
    
    navigator.clipboard.writeText(jsonOutput).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "JSON data has been copied to clipboard",
      });
    });
  };

  const handleDownload = () => {
    if (!jsonOutput) return;
    
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your JSON file is being downloaded",
    });
  };

  const sampleCsv = `id,name,email,active
1,John Doe,john@example.com,true
2,Jane Smith,jane@example.com,false`;

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
          CSV to JSON Converter
        </h1>
        
        <Tabs defaultValue="convert" className="mb-6">
          <TabsList className="bg-[#1A1F2C] border border-[#2C3645]">
            <TabsTrigger value="convert">Convert</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="convert">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium text-blue-300">Input CSV</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCsvInput(sampleCsv)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                  >
                    Load Sample
                  </Button>
                </div>
                
                <Textarea 
                  value={csvInput}
                  onChange={handleInputChange}
                  placeholder="Paste your CSV here..."
                  className="h-[500px] font-mono text-sm bg-[#1A1F2C] border-[#2C3645] text-gray-200 resize-none"
                />
                
                {error && (
                  <div className="mt-2 text-red-400 text-sm font-mono">
                    Error: {error}
                  </div>
                )}
                
                <Button 
                  onClick={handleConvert} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Convert to JSON
                </Button>
              </div>
              
              {/* Output Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium text-blue-300">Output JSON</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex bg-[#1A1F2C] border border-[#2C3645] rounded p-1">
                      <button
                        className={`px-3 py-1 rounded ${viewMode === 'text' ? 'bg-blue-900/50 text-blue-300' : 'text-gray-400'}`}
                        onClick={() => setViewMode("text")}
                      >
                        Text
                      </button>
                      <button
                        className={`px-3 py-1 rounded ${viewMode === 'visual' ? 'bg-blue-900/50 text-blue-300' : 'text-gray-400'}`}
                        onClick={() => setViewMode("visual")}
                        disabled={!jsonOutput}
                      >
                        Visual
                      </button>
                    </div>
                    
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        disabled={!jsonOutput}
                        className="border-blue-800 hover:bg-blue-900/20"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        disabled={!jsonOutput}
                        className="border-blue-800 hover:bg-blue-900/20"
                      >
                        <FileDown className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
                
                {viewMode === "text" ? (
                  <div className="relative bg-[#1A1F2C] border border-[#2C3645] rounded-lg overflow-hidden h-[500px]">
                    <Textarea
                      value={jsonOutput}
                      readOnly
                      placeholder="JSON output will appear here..."
                      className="h-full font-mono text-sm bg-transparent border-0 text-gray-200 resize-none"
                    />
                  </div>
                ) : (
                  <div className="bg-[#1A1F2C] border border-[#2C3645] rounded-lg overflow-hidden h-[500px]">
                    <JsonViewer 
                      jsonString={jsonOutput} 
                      error={null}
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="about">
            <div className="bg-[#1A1F2C] border border-[#2C3645] rounded-lg p-6">
              <h2 className="text-xl font-medium text-blue-300 mb-4">About CSV to JSON Conversion</h2>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  This tool allows you to convert CSV data to JSON format. The CSV input should have a header row that defines the property names.
                </p>
                
                <h3 className="text-lg font-medium text-blue-200">How it works:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Paste your CSV data in the input field</li>
                  <li>Click the "Convert to JSON" button</li>
                  <li>The converted JSON will appear in the output field</li>
                  <li>You can switch between text and visual views</li>
                  <li>Copy the output or download it as a JSON file</li>
                </ol>
                
                <h3 className="text-lg font-medium text-blue-200">Supported features:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Converts CSV to an array of JSON objects</li>
                  <li>Automatically detects data types (numbers, booleans, strings)</li>
                  <li>Handles quoted fields and escaped quotes in CSV</li>
                  <li>Properly formats the resulting JSON output</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CsvToJson;
