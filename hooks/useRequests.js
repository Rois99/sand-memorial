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
    story: row.story,
    status: row.status,
    submittedAt: row.submitted_at?.slice(0, 10) ?? "",
  };
}

export function useRequests() {
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortByDuplicates, setSortByDuplicates] = useState(false);

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

  /** All requests that have not been marked as handled. */
  const activeRequests = useMemo(
    () => allRequests.filter((r) => r.status !== REQUEST_STATUS.HANDLED),
    [allRequests]
  );

  /** Active requests, optionally sorted by duplicate fallen-name count descending. */
  const displayedRequests = useMemo(() => {
    if (!sortByDuplicates) return activeRequests;

    const countByName = activeRequests.reduce((acc, r) => {
      acc[r.fallenName] = (acc[r.fallenName] ?? 0) + 1;
      return acc;
    }, {});

    return [...activeRequests].sort(
      (a, b) => countByName[b.fallenName] - countByName[a.fallenName]
    );
  }, [activeRequests, sortByDuplicates]);

  /**
   * Marks a request as handled.
   * If other *pending* requests share the same fallen name, prompts the admin
   * to batch-handle them as well before committing the write.
   */
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

  function toggleSort() {
    setSortByDuplicates((v) => !v);
  }

  return {
    requests: displayedRequests,
    allRequests,
    loading,
    error,
    sortByDuplicates,
    toggleSort,
    markAsHandled,
  };
}
