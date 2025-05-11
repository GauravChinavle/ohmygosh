// Utility functions for data conversion

/**
 * Convert JSON to CSV
 * @param jsonString - JSON string to convert
 * @returns CSV string or error
 */
export function jsonToCsv(jsonString: string): { csv: string | null; error: string | null } {
  try {
    // Parse the JSON string
    const jsonData = JSON.parse(jsonString);
    
    // Check if the JSON is an array of objects
    if (!Array.isArray(jsonData)) {
      return { 
        csv: null, 
        error: "JSON must be an array of objects" 
      };
    }
    
    // Handle empty array
    if (jsonData.length === 0) {
      return { csv: "", error: null };
    }
    
    // Check if all items are objects
    if (jsonData.some(item => typeof item !== 'object' || item === null)) {
      return { 
        csv: null, 
        error: "All items in the JSON array must be objects" 
      };
    }

    // Get all unique headers from all objects
    const headers = new Set<string>();
    jsonData.forEach(item => {
      Object.keys(item).forEach(key => headers.add(key));
    });
    
    // Convert headers to array
    const headerArray = Array.from(headers);
    
    // Create CSV header row
    let csv = headerArray.map(header => `"${header}"`).join(',') + '\n';
    
    // Add data rows
    jsonData.forEach(item => {
      const row = headerArray.map(header => {
        const value = item[header];
        // Handle different types of values
        if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        } else {
          return `"${String(value).replace(/"/g, '""')}"`;
        }
      }).join(',');
      csv += row + '\n';
    });
    
    return { csv, error: null };
  } catch (error) {
    return { 
      csv: null, 
      error: error instanceof Error ? error.message : "Unknown error converting JSON to CSV" 
    };
  }
}

/**
 * Convert CSV to JSON
 * @param csvString - CSV string to convert
 * @returns JSON string or error
 */
export function csvToJson(csvString: string): { json: string | null; error: string | null } {
  try {
    // Parse CSV string into lines
    const lines = csvString.split(/\r?\n/).filter(line => line.trim());
    
    // Handle empty CSV
    if (lines.length === 0) {
      return { json: "[]", error: null };
    }
    
    // Parse header row
    const headers = parseCSVLine(lines[0]);
    
    // Process data rows
    const jsonArray = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = parseCSVLine(line);
      const jsonObject: Record<string, any> = {};
      
      // Assign each value to its corresponding header
      headers.forEach((header, index) => {
        if (index < values.length) {
          // Try to parse the value as a number or boolean
          let value = values[index];
          
          // Empty string should be empty
          if (value === "") {
            jsonObject[header] = "";
          } 
          // Try to parse as number
          else if (!isNaN(Number(value)) && value.trim() !== '') {
            jsonObject[header] = Number(value);
          } 
          // Handle boolean values
          else if (value.toLowerCase() === 'true') {
            jsonObject[header] = true;
          } 
          else if (value.toLowerCase() === 'false') {
            jsonObject[header] = false;
          } 
          // Handle null values
          else if (value.toLowerCase() === 'null') {
            jsonObject[header] = null;
          } 
          // Keep as string
          else {
            jsonObject[header] = value;
          }
        } else {
          // If there's no value for this header, set it to empty string
          jsonObject[header] = "";
        }
      });
      
      jsonArray.push(jsonObject);
    }
    
    return { 
      json: JSON.stringify(jsonArray, null, 2), 
      error: null 
    };
  } catch (error) {
    return { 
      json: null, 
      error: error instanceof Error ? error.message : "Unknown error converting CSV to JSON" 
    };
  }
}

/**
 * Parse a CSV line respecting quoted values
 * @param line - CSV line to parse
 * @returns Array of values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = i < line.length - 1 ? line[i + 1] : null;
    
    if (char === '"' && !inQuotes) {
      // Start of quoted value
      inQuotes = true;
    } else if (char === '"' && inQuotes) {
      if (nextChar === '"') {
        // Escaped quote inside a quoted value
        currentValue += '"';
        i++; // Skip the next quote
      } else {
        // End of quoted value
        inQuotes = false;
      }
    } else if (char === ',' && !inQuotes) {
      // End of value
      values.push(currentValue);
      currentValue = "";
    } else {
      // Part of the value
      currentValue += char;
    }
  }
  
  // Add the last value
  values.push(currentValue);
  
  return values;
}
