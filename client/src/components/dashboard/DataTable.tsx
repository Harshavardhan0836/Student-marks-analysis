import { useState } from "react";
import { AlertCircle, Download } from "lucide-react";

interface DataTableProps {
  data: any[];
  onExport: (data: any[]) => void;
}

/**
 * Data table with pagination
 */
export const DataTable = ({ data, onExport }: DataTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  if (!data || data.length === 0) {
    return (
      <div className="bg-card p-8 rounded-2xl shadow-lg text-center">
        <AlertCircle className="w-12 h-12 text-muted mx-auto mb-3" />
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const headers = Object.keys(data[0]);

  return (
    <div className="bg-card p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold text-foreground">
          Detailed Student Records
        </h4>
        <button
          onClick={() => onExport(data)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              {headers.slice(0, 10).map((header, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wider border border-border"
                >
                  {header.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, i) => (
              <tr key={i} className="hover:bg-accent/50 transition">
                {headers.slice(0, 10).map((header, j) => (
                  <td
                    key={j}
                    className="px-4 py-3 text-sm text-foreground border border-border"
                  >
                    {row[header] != null ? row[header].toString() : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {indexOfFirst + 1} to {Math.min(indexOfLast, data.length)} of{" "}
          {data.length} records
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 hover:bg-accent transition"
          >
            Previous
          </button>
          <span className="px-4 py-2 border border-border rounded-lg bg-primary/10 text-primary font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 hover:bg-accent transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
