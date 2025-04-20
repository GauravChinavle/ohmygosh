
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
      <div className="p-4 font-mono text-sm flex">
        <div className="mr-4 text-gray-500 text-right min-w-[40px]">
          {/* Line number column */}
        </div>
        <div className="flex-grow">
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
    <span className="text-blue-400">"{keyName}"</span>
  ) : null;
  
  const keyPrefix = formattedKey ? (
    <span>{formattedKey}: </span>
  ) : null;
  
  // Render line number and content
  const renderLine = (content: React.ReactNode) => (
    <div className="flex">
      <div className="mr-4 text-gray-500 text-right min-w-[40px]">{lineNumber}</div>
      <div 
        className="flex-grow flex items-center" 
        style={{ paddingLeft: `${indentation}rem` }}
      >
        {keyPrefix}{content}
      </div>
    </div>
  );
  
  // Handle different types of values
  if (value === null) {
    return renderLine(<span className="text-gray-500">null</span>);
  }
  
  if (typeof value === 'undefined') {
    return renderLine(<span className="text-gray-500">undefined</span>);
  }
  
  if (typeof value === 'boolean') {
    return renderLine(<span className="text-purple-400">{value.toString()}</span>);
  }
  
  if (typeof value === 'number') {
    return renderLine(<span className="text-green-400">{value}</span>);
  }
  
  if (typeof value === 'string') {
    return renderLine(<span className="text-amber-400">"{value}"</span>);
  }
  
  // Handle arrays and objects
  if (Array.isArray(value) || typeof value === 'object') {
    const isArray = Array.isArray(value);
    const isEmpty = Object.keys(value).length === 0;
    const openBracket = isArray ? "[" : "{";
    const closeBracket = isArray ? "]" : "}";
    
    // If empty, render simple version
    if (isEmpty) {
      return renderLine(<>{openBracket}{closeBracket}</>);
    }
    
    let currentLineNumber = lineNumber;
    
    // Handle non-empty arrays and objects with collapsible content
    return (
      <div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex">
            <div className="mr-4 text-gray-500 text-right min-w-[40px]">{currentLineNumber++}</div>
            <div 
              className="flex-grow flex items-center" 
              style={{ paddingLeft: `${indentation}rem` }}
            >
              <CollapsibleTrigger className="hover:text-blue-400 focus-visible:outline-none mr-2">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <span>
                {keyPrefix}{openBracket}
                {!isOpen && <span className="opacity-50"> ... {closeBracket}</span>}
              </span>
            </div>
          </div>
          
          <CollapsibleContent>
            <div className="pl-4">
              {Object.entries(value).map(([k, v], index) => (
                <JsonNode 
                  key={`${path}-${k}`} 
                  value={v} 
                  depth={depth + 1} 
                  path={`${path}-${k}`} 
                  keyName={isArray ? undefined : k}
                  lineNumber={currentLineNumber++}
                />
              ))}
            </div>
            <div className="flex">
              <div className="mr-4 text-gray-500 text-right min-w-[40px]">{currentLineNumber}</div>
              <div 
                className="flex-grow" 
                style={{ paddingLeft: `${indentation}rem` }}
              >
                {closeBracket}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }
  
  // Fallback for unknown types
  return renderLine(<span>{String(value)}</span>);
}

export default JsonViewer;
