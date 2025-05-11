
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { jsonToCsv } from "@/utils/conversion";
import { FileDown, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const JsonToCsv = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [csvOutput, setCsvOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonInput(value);
    setError(null);
    
    // For better UX, clear the output when input changes
    if (csvOutput) {
      setCsvOutput("");
    }
  };

  const handleConvert = () => {
    if (!jsonInput.trim()) {
      setError("Please enter JSON to convert");
      return;
    }

    const { csv, error } = jsonToCsv(jsonInput);
    
    if (error) {
      setError(error);
      setCsvOutput("");
    } else {
      setError(null);
      setCsvOutput(csv || "");
      
      if (csv) {
        toast({
          title: "Conversion successful",
          description: "JSON has been converted to CSV",
        });
      }
    }
  };

  const handleCopy = () => {
    if (!csvOutput) return;
    
    navigator.clipboard.writeText(csvOutput).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "CSV data has been copied to clipboard",
      });
    });
  };

  const handleDownload = () => {
    if (!csvOutput) return;
    
    const blob = new Blob([csvOutput], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your CSV file is being downloaded",
    });
  };

  const sampleJson = `[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "active": true
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "active": false
  }
]`;

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
          JSON to CSV Converter
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
                  <h2 className="text-xl font-medium text-blue-300">Input JSON</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setJsonInput(sampleJson)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                  >
                    Load Sample
                  </Button>
                </div>
                
                <Textarea 
                  value={jsonInput}
                  onChange={handleInputChange}
                  placeholder="Paste your JSON here..."
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
                  Convert to CSV
                </Button>
              </div>
              
              {/* Output Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium text-blue-300">Output CSV</h2>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      disabled={!csvOutput}
                      className="border-blue-800 hover:bg-blue-900/20"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      disabled={!csvOutput}
                      className="border-blue-800 hover:bg-blue-900/20"
                    >
                      <FileDown className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="relative bg-[#1A1F2C] border border-[#2C3645] rounded-lg overflow-hidden h-[500px]">
                  <Textarea
                    value={csvOutput}
                    readOnly
                    placeholder="CSV output will appear here..."
                    className="h-full font-mono text-sm bg-transparent border-0 text-gray-200 resize-none"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="about">
            <div className="bg-[#1A1F2C] border border-[#2C3645] rounded-lg p-6">
              <h2 className="text-xl font-medium text-blue-300 mb-4">About JSON to CSV Conversion</h2>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  This tool allows you to convert JSON data to CSV format. The JSON input must be an array of objects with similar structure.
                </p>
                
                <h3 className="text-lg font-medium text-blue-200">How it works:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Paste your JSON data in the input field</li>
                  <li>Click the "Convert to CSV" button</li>
                  <li>The converted CSV will appear in the output field</li>
                  <li>You can copy the output or download it as a CSV file</li>
                </ol>
                
                <h3 className="text-lg font-medium text-blue-200">Supported features:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Converts arrays of objects to CSV format</li>
                  <li>Handles nested objects by converting them to JSON strings</li>
                  <li>Properly escapes special characters in CSV</li>
                  <li>Generates headers based on all object keys in the array</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JsonToCsv;
