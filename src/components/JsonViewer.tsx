
import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface JsonViewerProps {
  jsonString: string;
  error: string | null;
}

export function JsonViewer({ jsonString, error }: JsonViewerProps) {
  if (!jsonString.trim()) {
    return (
      <div className="h-[600px] flex items-center justify-center text-gray-500">
        Paste JSON to see the formatted output
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[600px] flex items-center justify-center text-red-400">
        Invalid JSON
      </div>
    );
  }

  // Parse JSON
  const parsedJson = useMemo(() => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return null;
    }
  }, [jsonString]);

  return (
    <ScrollArea className="h-[600px] w-full">
      <div className="relative font-mono text-sm">
        <div className="absolute left-0 top-0 bottom-0 w-[50px] border-r border-[#2C3645] bg-[#1A1F2C]">
          {/* Line number column background */}
        </div>
        <div className="grid">
          <JsonNode value={parsedJson} depth={0} path="root" lineNumber={1} />
        </div>
      </div>
    </ScrollArea>
  );
}

interface JsonNodeProps {
  value: any;
  depth: number;
  path: string;
  keyName?: string;
  lineNumber: number;
}

function JsonNode({ value, depth, path, keyName, lineNumber }: JsonNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const indentation = depth * 1.5;
  
  // Format key with quotes and colon if it exists
  const formattedKey = keyName !== undefined ? (
    <span className="text-[#5DB0D7]">"{keyName}"</span>
  ) : null;
  
  const keyPrefix = formattedKey ? (
    <span>{formattedKey}<span className="text-white">: </span></span>
  ) : null;
  
  // Render line number and content
  const renderLine = (content: React.ReactNode, showArrow = false, toggleOpen?: () => void) => (
    <div className="grid grid-cols-[50px_1fr] hover:bg-[#1E2530] group">
      <div className="text-right pr-1 text-[#4B5563] select-none relative">
        {lineNumber}
        {showArrow && (
          <div className="absolute right-[-12px] top-1/2 -translate-y-1/2">
            <button 
              onClick={toggleOpen} 
              className="hover:text-blue-400 focus-visible:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isOpen ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          </div>
        )}
      </div>
      <div 
        className="flex items-center" 
        style={{ paddingLeft: `${indentation}rem` }}
      >
        {keyPrefix}{content}
      </div>
    </div>
  );
  
  // Handle different types of values
  if (value === null) {
    return renderLine(<span className="text-[#D6707B]">null</span>);
  }
  
  if (typeof value === 'undefined') {
    return renderLine(<span className="text-[#D6707B]">undefined</span>);
  }
  
  if (typeof value === 'boolean') {
    return renderLine(<span className="text-[#C98550]">{value.toString()}</span>);
  }
  
  if (typeof value === 'number') {
    return renderLine(<span className="text-[#7CB36F]">{value}</span>);
  }
  
  if (typeof value === 'string') {
    return renderLine(<span className="text-[#C98550]">"{value}"</span>);
  }
  
  // Handle arrays and objects
  if (Array.isArray(value) || typeof value === 'object') {
    const isArray = Array.isArray(value);
    const isEmpty = Object.keys(value).length === 0;
    const openBracket = isArray ? "[" : "{";
    const closeBracket = isArray ? "]" : "}";
    
    // If empty, render simple version
    if (isEmpty) {
      return renderLine(<span className="text-white">{openBracket}{closeBracket}</span>);
    }
    
    let currentLineNumber = lineNumber;
    
    const toggleOpen = () => setIsOpen(!isOpen);
    
    // Handle non-empty arrays and objects
    return (
      <div>
        {renderLine(
          <span className="text-white">
            {openBracket}
            {!isOpen && <span className="opacity-50"> ... {closeBracket}</span>}
          </span>,
          true,
          toggleOpen
        )}
        
        {isOpen && (
          <>
            <div>
              {Object.entries(value).map(([k, v], index) => {
                currentLineNumber++;
                return (
                  <JsonNode 
                    key={`${path}-${k}`} 
                    value={v} 
                    depth={depth + 1} 
                    path={`${path}-${k}`} 
                    keyName={isArray ? undefined : k}
                    lineNumber={currentLineNumber}
                  />
                );
              })}
            </div>
            <div className="grid grid-cols-[50px_1fr] hover:bg-[#1E2530]">
              <div className="text-right pr-4 text-[#4B5563] select-none">{currentLineNumber + 1}</div>
              <div 
                className="text-white" 
                style={{ paddingLeft: `${indentation}rem` }}
              >
                {closeBracket}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
  
  // Fallback for unknown types
  return renderLine(<span className="text-white">{String(value)}</span>);
}

export default JsonViewer;
