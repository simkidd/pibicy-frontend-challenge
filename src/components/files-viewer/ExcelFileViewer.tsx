/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

interface ExcelFileViewerProps {
  file: File;
}

const ExcelFileViewer: React.FC<ExcelFileViewerProps> = ({ file }) => {
  const [excelData, setExcelData] = useState<any[]>([]);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;

      if (result instanceof ArrayBuffer) {
        const data = new Uint8Array(result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetNames = workbook.SheetNames;
        const sheetData = sheetNames.map((sheetName) =>
          XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })
        );

        setExcelData(sheetData);
      }
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  return (
    <div>
      <h3 className="text-xl mb-4">Excel File (.xls, .xlsx)</h3>
      {excelData.length > 0 && (
        <div>
          {excelData.map((sheet, sheetIndex) => (
            <div key={sheetIndex}>
              <h3 className="text-xl mb-4">Sheet {sheetIndex + 1}</h3>
              <table className="table-auto w-full border-collapse border">
                <thead>
                  <tr>
                    {sheet[0].map((header: string, index: number) => (
                      <th key={index} className="border p-2">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sheet.slice(1).map((row: any, rowIndex: number) => (
                    <tr key={rowIndex}>
                      {row.map((cell: any, cellIndex: number) => (
                        <td key={cellIndex} className="border p-2">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExcelFileViewer;
