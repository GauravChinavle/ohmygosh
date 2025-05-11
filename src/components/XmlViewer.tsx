
import { useState, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronRight } from "lucide-react";

interface XmlViewerProps {
  xmlString: string;
  error: string | null;
}

export function XmlViewer({ xmlString, error }: XmlViewerProps) {
  if (!xmlString.trim()) {
    return (
      <div className="h-[600px] flex items-center justify-center text-gray-500">
        Paste XML to see the formatted output
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[600px] flex items-center justify-center text-red-400">
        Invalid XML
      </div>
    );
  }

  // Parse XML
  const parsedXml = useMemo(() => {
    try {
      const parser = new DOMParser();
      return parser.parseFromString(xmlString, "text/xml");
    } catch (e) {
      return null;
    }
  }, [xmlString]);

  // Check for parsing errors
  const parsingError = parsedXml?.getElementsByTagName("parsererror").length > 0;

  if (parsingError) {
    return (
      <div className="h-[600px] flex items-center justify-center text-red-400">
        Invalid XML
      </div>
    );
  }

  // Format XML string with indentation
  const formattedXml = useMemo(() => {
    try {
      const serializer = new XMLSerializer();
      const xmlText = serializer.serializeToString(parsedXml as Document);
      
      // Basic XML formatting by replacements
      return formatXml(xmlText);
    } catch (e) {
      return xmlString;
    }
  }, [parsedXml, xmlString]);

  const xmlLines = formattedXml.split('\n');
  
  return (
    <ScrollArea className="h-[600px] w-full">
      <div className="relative font-mono text-sm">
        <div className="absolute left-0 top-0 bottom-0 w-[50px] border-r border-[#2C3645] bg-[#1A1F2C]">
          {/* Line number column background */}
        </div>
        <div className="grid">
          {xmlLines.map((line, index) => (
            <XmlLine key={index} line={line} lineNumber={index + 1} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

// Format XML with proper indentation
function formatXml(xml: string): string {
  let formatted = '';
  let indent = '';
  const tab = '  '; // 2 spaces indentation
  
  xml.split(/>\s*</).forEach(function(node) {
    if (node.match(/^\/\w/)) { 
      // Closing tag
      indent = indent.substring(tab.length);
    }
    
    formatted += indent + '<' + node + '>\n';
    
    if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith("?")) { 
      // Opening tag and not self-closing
      indent += tab;
    }
  });
  
  // Clean up the formatted string
  return formatted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n<\//g, '</') // Remove linebreaks before closing tags
    .replace(/\n<([^\/])/g, '\n$1') // Remove extra linebreaks
    .replace(/^\n/g, '') // Remove leading linebreaks
    .replace(/\n{2,}/g, '\n') // Remove multiple linebreaks
    .split('&lt;').join('<')
    .split('&gt;').join('>')
    .split('&amp;').join('&');
}

interface XmlLineProps {
  line: string;
  lineNumber: number;
}

function XmlLine({ line, lineNumber }: XmlLineProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  // Calculate indentation level
  const indentMatch = line.match(/^\s*/);
  const indentation = indentMatch ? indentMatch[0].length / 2 : 0;
  
  // Check if this line is a tag that could have children
  const isOpeningTag = /<[^\/][^>]*>[^<]*$/.test(line) && !/<.*\/>/.test(line);
  const isClosingTag = /^<\//.test(line.trim());
  
  // Different color for tags, attributes, and content
  const coloredLine = line.replace(
    /(<\/?[^>\s]+)|(\s+[^=>\s]+="[^"]+")|([^<]+$)/g, 
    (match, tag, attr, content) => {
      if (tag) return `<span class="text-[#E06C75]">${tag}</span>`;
      if (attr) return `<span class="text-[#D19A66]">${attr}</span>`;
      if (content && content.trim()) return `<span class="text-[#98C379]">${content}</span>`;
      return match;
    }
  );

  const toggleOpen = () => setIsOpen(!isOpen);
  
  return (
    <div className="grid grid-cols-[50px_1fr] hover:bg-[#1E2530] group">
      <div className="text-right pr-1 text-[#4B5563] select-none relative">
        {lineNumber}
        {isOpeningTag && (
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
        dangerouslySetInnerHTML={{ __html: coloredLine }}
      />
    </div>
  );
}

export default XmlViewer;
