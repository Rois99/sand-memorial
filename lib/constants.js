export const REQUEST_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  HANDLED: "handled",
};

export const STATUS_CONFIG = {
  pending:     { label: "ממתין",  className: "bg-amber-100 text-amber-700" },
  in_progress: { label: "בטיפול", className: "bg-blue-100 text-blue-700" },
  completed:   { label: "הושלם",  className: "bg-green-100 text-green-700" },
  handled:     { label: "טופל",   className: "bg-sand-100 text-sand-500" },
};
