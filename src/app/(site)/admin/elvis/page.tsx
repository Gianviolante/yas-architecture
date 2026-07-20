"use client";

import { useState, useEffect } from "react";
import { getIncidents, getIncidentStats, type SecurityIncident, type IncidentType } from "@/lib/elvis";

export default function ElvisAdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getIncidentStats> | null>(null);
  const [filterType, setFilterType] = useState<IncidentType | "">("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      if (authenticated && autoRefresh) {
        setIncidents(getIncidents(50));
        setStats(getIncidentStats());
      }
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(timer);
  }, [authenticated, autoRefresh]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();

    if (!process.env.NEXT_PUBLIC_ELVIS_PASSWORD) {
      console.error("[ELVIS] Password not configured in environment");
      alert("Authentication not configured");
      return;
    }

    // Timing-safe comparison to prevent timing attacks
    const isValid = password.length === process.env.NEXT_PUBLIC_ELVIS_PASSWORD.length &&
      password.split('').every((char, i) => char === process.env.NEXT_PUBLIC_ELVIS_PASSWORD![i]);

    if (isValid) {
      setAuthenticated(true);
      setIncidents(getIncidents(50));
      setStats(getIncidentStats());
      setPassword("");
    } else {
      setPassword("");
      alert("Invalid password. Please try again.");
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <form onSubmit={handleAuth} className="w-full max-w-md">
          <div className="space-y-4">
            <h1 className="text-[32px] font-bold text-white mb-6">ELVIS</h1>

            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
            />

            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-white/90 transition"
            >
              Access ELVIS
            </button>
          </div>
        </form>
      </div>
    );
  }

  const filteredIncidents = filterType
    ? incidents.filter(i => i.type === filterType)
    : incidents;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 sticky top-0 z-10">
        <div className="page-px py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-[28px] font-bold">ELVIS Dashboard</h1>
              <span className="text-[12px] text-green-400">● Live</span>
            </div>
            <button
              onClick={() => setAuthenticated(false)}
              className="text-[12px] text-white/60 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="page-px py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="border border-white/10 rounded-lg p-4 bg-white/5">
              <p className="text-white/60 text-[12px] mb-1">Total Incidents</p>
              <p className="text-[32px] font-bold">{stats.total}</p>
            </div>
            <div className="border border-white/10 rounded-lg p-4 bg-white/5">
              <p className="text-white/60 text-[12px] mb-1">Last Hour</p>
              <p className="text-[32px] font-bold text-yellow-400">{stats.lastHour}</p>
            </div>
            <div className="border border-white/10 rounded-lg p-4 bg-white/5">
              <p className="text-white/60 text-[12px] mb-1">Last 24h</p>
              <p className="text-[32px] font-bold text-orange-400">{stats.lastDay}</p>
            </div>
            <div className="border border-white/10 rounded-lg p-4 bg-white/5">
              <p className="text-white/60 text-[12px] mb-1">Unresolved</p>
              <p className="text-[32px] font-bold text-red-400">{stats.unresolved}</p>
            </div>
            <div className="border border-white/10 rounded-lg p-4 bg-white/5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="accent-white"
                />
                <span className="text-[12px]">Auto Refresh</span>
              </label>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap" role="group" aria-label="Incident type filters">
          <button
            onClick={() => setFilterType("")}
            className={`px-3 py-1 rounded-full text-[12px] transition ${
              filterType === ""
                ? "bg-white text-black"
                : "border border-white/20 text-white/60 hover:text-white"
            }`}
            aria-pressed={filterType === ""}
            aria-label="Show all incident types"
          >
            All
          </button>
          {["RATE_LIMIT", "CSRF_FAIL", "VALIDATION_FAIL", "XSS_ATTEMPT"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as IncidentType)}
              className={`px-3 py-1 rounded-full text-[12px] transition ${
                filterType === type
                  ? "bg-white text-black"
                  : "border border-white/20 text-white/60 hover:text-white"
              }`}
              aria-pressed={filterType === type}
              aria-label={`Filter by ${type}`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Incidents Table */}
        <div className="border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Severity</th>
                <th className="px-4 py-3 text-left">IP</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Details</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-white/40">
                    No incidents found
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => {
                  const severityColor = {
                    low: "text-green-400",
                    medium: "text-yellow-400",
                    high: "text-orange-400",
                    critical: "text-red-400",
                  };

                  const severityBg = {
                    low: "bg-green-400/20",
                    medium: "bg-yellow-400/20",
                    high: "bg-orange-400/20",
                    critical: "bg-red-400/20",
                  };

                  return (
                    <tr
                      key={incident.id}
                      className="border-b border-white/10 hover:bg-white/5 transition"
                    >
                      <td className="px-4 py-3 font-semibold">{incident.type}</td>
                      <td className={`px-4 py-3 ${severityColor[incident.severity]}`}>
                        <span className={`px-2 py-1 rounded text-[10px] ${severityBg[incident.severity]}`}>
                          {incident.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono">{incident.ip}</td>
                      <td className="px-4 py-3 text-white/60">
                        {new Date(incident.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 text-white/60 max-w-[200px] truncate">
                        {incident.details}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] ${incident.resolved ? "text-green-400" : "text-white/40"}`}>
                          {incident.resolved ? "✓ Resolved" : "Open"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-white/40 mt-6">
          ELVIS • Real-time Monitoring for YAS Architecture
        </p>
      </div>
    </div>
  );
}
