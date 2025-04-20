
import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

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
      <div className="p-4 font-mono text-sm">
        <JsonNode value={parsedJson} depth={0} path="root" />
      </div>
    </ScrollArea>
  );
}

interface JsonNodeProps {
  value: any;
  depth: number;
  path: string;
  keyName?: string;
}

function JsonNode({ value, depth, path, keyName }: JsonNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const indentation = depth * 1.5;
  
  // Format key with quotes and colon if it exists
  const formattedKey = keyName !== undefined ? (
    <span className="text-blue-400">"{keyName}"</span>
  ) : null;
  
  const keyPrefix = formattedKey ? (
    <span>{formattedKey}: </span>
  ) : null;
  
  // Handle different types of values
  if (value === null) {
    return (
      <div className="line flex" style={{ paddingLeft: `${indentation}rem` }}>
        {keyPrefix}<span className="text-gray-500">null</span>
      </div>
    );
  }
  
  if (typeof value === 'undefined') {
    return (
      <div className="line flex" style={{ paddingLeft: `${indentation}rem` }}>
        {keyPrefix}<span className="text-gray-500">undefined</span>
      </div>
    );
  }
  
  if (typeof value === 'boolean') {
    return (
      <div className="line flex" style={{ paddingLeft: `${indentation}rem` }}>
        {keyPrefix}<span className="text-purple-400">{value.toString()}</span>
      </div>
    );
  }
  
  if (typeof value === 'number') {
    return (
      <div className="line flex" style={{ paddingLeft: `${indentation}rem` }}>
        {keyPrefix}<span className="text-green-400">{value}</span>
      </div>
    );
  }
  
  if (typeof value === 'string') {
    return (
      <div className="line flex" style={{ paddingLeft: `${indentation}rem` }}>
        {keyPrefix}<span className="text-amber-400">"{value}"</span>
      </div>
    );
  }
  
  // Handle arrays and objects
  if (Array.isArray(value) || typeof value === 'object') {
    const isArray = Array.isArray(value);
    const isEmpty = Object.keys(value).length === 0;
    const openBracket = isArray ? "[" : "{";
    const closeBracket = isArray ? "]" : "}";
    
    // If empty, render simple version
    if (isEmpty) {
      return (
        <div className="line flex" style={{ paddingLeft: `${indentation}rem` }}>
          {keyPrefix}{openBracket}{closeBracket}
        </div>
      );
    }
    
    // Handle non-empty arrays and objects with collapsible content
    return (
      <div style={{ paddingLeft: `${indentation}rem` }}>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center">
            <CollapsibleTrigger className="mr-1 hover:text-blue-400 focus-visible:outline-none">
              {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </CollapsibleTrigger>
            <span>
              {keyPrefix}{openBracket}
              {!isOpen && <span className="opacity-50"> ... {closeBracket}</span>}
            </span>
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
                />
              ))}
            </div>
            <div style={{ paddingLeft: 0 }}>
              {closeBracket}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }
  
  // Fallback for unknown types
  return (
    <div className="line flex" style={{ paddingLeft: `${indentation}rem` }}>
      {keyPrefix}<span>{String(value)}</span>
    </div>
  );
}
