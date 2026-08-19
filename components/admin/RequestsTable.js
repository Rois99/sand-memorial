import { Check, ArrowUpDown } from "lucide-react";
import { STATUS_CONFIG, REQUEST_STATUS } from "@/lib/constants";

export default function RequestsTable({
  requests,
  sortByDuplicates,
  onToggleSort,
  onMarkAsHandled,
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-sand-900">בקשות שהתקבלו</h2>
        <button
          onClick={onToggleSort}
          className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg border transition-colors ${
            sortByDuplicates
              ? "bg-sand-900 text-sand-100 border-sand-900"
              : "bg-white text-sand-600 border-sand-200 hover:border-sand-400"
          }`}
        >
          <ArrowUpDown size={14} />
          {sortByDuplicates ? "מיון לפי כפילויות (פעיל)" : "מיין לפי כפילויות"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand-100 border-b border-sand-200 text-sand-600 text-right">
                <th className="px-5 py-3 font-semibold">#</th>
                <th className="px-5 py-3 font-semibold">שם הפונה</th>
                <th className="px-5 py-3 font-semibold">שם הנופל</th>
                <th className="px-5 py-3 font-semibold">פרטי קשר</th>
                <th className="px-5 py-3 font-semibold">סיפור</th>
                <th className="px-5 py-3 font-semibold">תאריך</th>
                <th className="px-5 py-3 font-semibold">סטטוס</th>
                <th className="px-5 py-3 font-semibold">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {requests.map((req) => {
                const statusCfg =
                  STATUS_CONFIG[req.status] ?? STATUS_CONFIG.pending;
                return (
                  <tr
                    key={req.id}
                    className="hover:bg-sand-50 transition-colors"
                  >
                    <td className="px-5 py-4 text-sand-400 font-mono text-xs">
                      {req.id}
                    </td>
                    <td className="px-5 py-4 font-medium text-sand-900">
                      {req.requesterName}
                    </td>
                    <td className="px-5 py-4 text-sand-800 whitespace-nowrap">
                      {req.fallenName}
                    </td>
                    <td className="px-5 py-4 text-sand-600 text-xs">
                      {req.contactInfo}
                    </td>
                    <td className="px-5 py-4 text-sand-600 max-w-xs">
                      <p className="truncate">{req.story}</p>
                    </td>
                    <td className="px-5 py-4 text-sand-500 text-xs whitespace-nowrap">
                      {req.submittedAt}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${statusCfg.className}`}
                      >
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {req.status === REQUEST_STATUS.PENDING && (
                        <button
                          onClick={() => onMarkAsHandled(req.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 transition-colors whitespace-nowrap"
                        >
                          <Check size={12} />
                          סמן כטופל
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-sand-400"
                  >
                    אין בקשות פעילות
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
