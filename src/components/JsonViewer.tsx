
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

interface ParsedLine {
  content: string;
  indent: number;
  lineNumber: number;
  isOpenBracket: boolean;
  isCloseBracket: boolean;
  path: string;
}

export function JsonViewer({ jsonString, error }: JsonViewerProps) {
  const parsedLines = useMemo(() => {
    if (!jsonString.trim() || error) return [];

    try {
      // Format JSON with proper indentation
      const formatted = JSON.stringify(JSON.parse(jsonString), null, 2);
      
      // Split into lines and process each line
      return formatted.split('\n').map((line, index) => {
        const indent = line.search(/\S/);
        const content = line.trim();
        const isOpenBracket = content.endsWith('{') || content.endsWith('[');
        const isCloseBracket = content.startsWith('}') || content.startsWith(']');
        
        return {
          content,
          indent: Math.floor(indent / 2),
          lineNumber: index + 1,
          isOpenBracket,
          isCloseBracket,
          path: `line-${index + 1}`
        };
      });
    } catch {
      return [];
    }
  }, [jsonString, error]);

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

  return (
    <ScrollArea className="h-[600px] w-full">
      <div className="p-4 font-mono text-sm relative">
        <JsonLines lines={parsedLines} />
      </div>
    </ScrollArea>
  );
}

interface JsonLinesProps {
  lines: ParsedLine[];
}

const JsonLines = ({ lines }: JsonLinesProps) => {
  if (!lines.length) return null;
  
  return (
    <>
      {lines.map((line, index) => (
        <JsonLine 
          key={line.path} 
          line={line} 
          index={index} 
          allLines={lines} 
        />
      ))}
    </>
  );
};

interface JsonLineProps {
  line: ParsedLine;
  index: number;
  allLines: ParsedLine[];
}

const JsonLine = ({ line, index, allLines }: JsonLineProps) => {
  const [isOpen, setIsOpen] = useState(true);
  
  // Only process open brackets (objects and arrays)
  if (!line.isOpenBracket) {
    return (
      <div className="flex group">
        <div className="w-12 text-right pr-4 text-gray-500 select-none">
          {line.lineNumber}
        </div>
        <div className="flex-1" style={{ paddingLeft: `${line.indent * 1.5}rem` }}>
          <span>{line.content}</span>
        </div>
      </div>
    );
  }

  // Find the matching closing bracket
  const findClosingBracketIndex = () => {
    let openBrackets = 1;
    let i = index + 1;
    
    while (i < allLines.length && openBrackets > 0) {
      const currentLine = allLines[i];
      if (currentLine.isOpenBracket) openBrackets++;
      if (currentLine.isCloseBracket) openBrackets--;
      
      if (openBrackets === 0) return i;
      i++;
    }
    
    return -1;
  };
  
  const closingIndex = findClosingBracketIndex();
  
  // Get all child lines between opening and closing brackets
  const childLines = closingIndex !== -1 
    ? allLines.slice(index + 1, closingIndex)
    : [];

  // Show closing bracket only if its children are visible (when expanded)
  const closingBracket = closingIndex !== -1 ? allLines[closingIndex] : null;
  
  return (
    <>
      <div className="flex group">
        <div className="w-12 text-right pr-4 text-gray-500 select-none">
          {line.lineNumber}
        </div>
        <div 
          className="flex-1"
          style={{ paddingLeft: `${line.indent * 1.5}rem` }}
        >
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex items-center space-x-1">
              <CollapsibleTrigger className="hover:text-blue-400 focus-visible:outline-none">
                <span className="inline-block transition-transform">
                  {isOpen ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </span>
              </CollapsibleTrigger>
              <span>{line.content}</span>
            </div>
            <CollapsibleContent>
              {childLines.map(child => (
                <div 
                  key={child.path} 
                  className="flex group"
                >
                  <div className="w-12 text-right pr-4 text-gray-500 select-none">
                    {child.lineNumber}
                  </div>
                  <div 
                    className="flex-1"
                    style={{ paddingLeft: `${child.indent * 1.5}rem` }}
                  >
                    {child.isOpenBracket ? (
                      <JsonLine 
                        line={child} 
                        index={allLines.indexOf(child)} 
                        allLines={allLines} 
                      />
                    ) : (
                      <span>{child.content}</span>
                    )}
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      {closingBracket && !isOpen && (
        <div className="flex group">
          <div className="w-12 text-right pr-4 text-gray-500 select-none">
            {closingBracket.lineNumber}
          </div>
          <div 
            className="flex-1"
            style={{ paddingLeft: `${closingBracket.indent * 1.5}rem` }}
          >
            <span>{closingBracket.content}</span>
          </div>
        </div>
      )}
    </>
  );
};
