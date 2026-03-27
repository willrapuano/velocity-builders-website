"use client";

interface TableRow {
  cells: string[];
  isHeader?: boolean;
}

interface TableValue {
  caption?: string;
  rows?: TableRow[];
}

export function Table({ value }: { value: TableValue }) {
  const rows = value.rows || [];
  return (
    <div className="overflow-x-auto my-8">
      <table className="w-full border-collapse text-sm text-left">
        {value.caption && (
          <caption className="text-gray-500 text-sm mb-2 text-left">{value.caption}</caption>
        )}
        <tbody>
          {rows.map((row, ri) =>
            row.isHeader ? (
              <tr key={ri} className="bg-gray-900 text-white">
                {(row.cells || []).map((cell, ci) => (
                  <th key={ci} className="px-4 py-3 font-semibold whitespace-nowrap border border-gray-700">
                    {cell}
                  </th>
                ))}
              </tr>
            ) : (
              <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {(row.cells || []).map((cell, ci) => (
                  <td key={ci} className="px-4 py-3 border border-gray-200">
                    {cell}
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
