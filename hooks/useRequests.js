"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { REQUEST_STATUS } from "@/lib/constants";

/** Maps a Supabase snake_case row to the camelCase shape the UI expects. */
function mapRequest(row) {
  return {
    id: row.id,
    requesterName: row.requester_name,
    contactInfo: row.contact_info,
    fallenName: row.fallen_name,
    rank: row.rank ?? "",
    unit: row.unit ?? "",
    story: row.story,
    status: row.status,
    submittedAt: row.submitted_at?.slice(0, 10) ?? "",
  };
}

// ── Unit tier system ──────────────────────────────────────────
// Normalize Hebrew gershayim (״) to ASCII " so both input styles match.
const TIER1 = ["סיירת", "שייטת", 'מטכ"ל', "שלדג", "קומנדו", "מגלן", "אגוז", "דובדבן", 'ימ"מ', 'לוט"ר'];
const TIER2 = ["גולני", "צנחנים", "גבעתי", 'נח"ל', "כפיר", "שריון", "תותחנים", "הנדסה", "איסוף", 'מג"ב', "חילוץ", 'חי"ר'];

function getUnitTier(unit) {
  const u = (unit ?? "").replace(/״/g, '"');
  if (TIER1.some((kw) => u.includes(kw))) return 1;
  if (TIER2.some((kw) => u.includes(kw))) return 2;
  return 3;
}

export function useRequests() {
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // "default" | "name" | "unit" | "duplicates"
  const [requestSort, setRequestSort] = useState("default");

  useEffect(() => {
    supabase
      .from("requests")
      .select("*")
      .order("submitted_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setAllRequests((data ?? []).map(mapRequest));
        setLoading(false);
      });
  }, []);

  const activeRequests = useMemo(
    () => allRequests.filter((r) => r.status !== REQUEST_STATUS.HANDLED),
    [allRequests]
  );

  const displayedRequests = useMemo(() => {
    if (requestSort === "name") {
      return [...activeRequests].sort((a, b) =>
        a.fallenName.localeCompare(b.fallenName, "he")
      );
    }

    if (requestSort === "unit") {
      return [...activeRequests].sort((a, b) => {
        const tierDiff = getUnitTier(a.unit) - getUnitTier(b.unit);
        // Within the same tier, sort alphabetically by unit name
        if (tierDiff !== 0) return tierDiff;
        return (a.unit ?? "").localeCompare(b.unit ?? "", "he");
      });
    }

    if (requestSort === "duplicates") {
      const countByName = activeRequests.reduce((acc, r) => {
        acc[r.fallenName] = (acc[r.fallenName] ?? 0) + 1;
        return acc;
      }, {});
      return [...activeRequests].sort(
        (a, b) => countByName[b.fallenName] - countByName[a.fallenName]
      );
    }

    return activeRequests; // "default" — date desc from DB
  }, [activeRequests, requestSort]);

  async function markAsHandled(id) {
    const target = allRequests.find((r) => r.id === id);
    if (!target) return;

    const pendingDuplicates = allRequests.filter(
      (r) =>
        r.fallenName === target.fallenName &&
        r.status === REQUEST_STATUS.PENDING &&
        r.id !== id
    );

    const idsToHandle = [id];

    if (pendingDuplicates.length > 0) {
      const confirmed = window.confirm(
        `יש ${pendingDuplicates.length} בקשות נוספות עבור "${target.fallenName}".\nלסמן גם אותן כטופלו?`
      );
      if (confirmed) pendingDuplicates.forEach((r) => idsToHandle.push(r.id));
    }

    const { error } = await supabase
      .from("requests")
      .update({ status: "handled" })
      .in("id", idsToHandle);

    if (error) {
      alert("שגיאה בעדכון: " + error.message);
      return;
    }

    setAllRequests((prev) =>
      prev.map((r) =>
        idsToHandle.includes(r.id) ? { ...r, status: REQUEST_STATUS.HANDLED } : r
      )
    );
  }

  return {
    requests: displayedRequests,
    allRequests,
    loading,
    error,
    requestSort,
    setRequestSort,
    markAsHandled,
  };
}
