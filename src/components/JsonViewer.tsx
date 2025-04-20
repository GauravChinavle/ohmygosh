
import { useMemo } from "react";
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
        {parsedLines.map((line, index) => (
          <div key={line.path} className="flex group">
            <div className="w-12 text-right pr-4 text-gray-500 select-none">
              {line.lineNumber}
            </div>
            <div 
              className="flex-1"
              style={{ paddingLeft: `${line.indent * 1.5}rem` }}
            >
              {line.isOpenBracket ? (
                <Collapsible>
                  <div className="flex items-center space-x-1">
                    <CollapsibleTrigger className="hover:text-blue-400 focus-visible:outline-none">
                      {({ open }: { open: boolean }) => (
                        open ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      )}
                    </CollapsibleTrigger>
                    <span>{line.content}</span>
                  </div>
                  <CollapsibleContent>
                    {parsedLines
                      .slice(index + 1)
                      .filter(l => l.indent > line.indent)
                      .map(l => (
                        <div key={l.path} className="flex">
                          <span>{l.content}</span>
                        </div>
                      ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <span>{line.content}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
