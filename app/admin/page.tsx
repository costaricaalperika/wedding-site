"use client";

import { useEffect, useState } from "react";
import { getSupabase, type Guest } from "@/lib/supabase";

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGuests() {
      try {
        const { data, error } = await getSupabase()
          .from("guests")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Fetch error:", error);
          setError(error.message);
        } else {
          setGuests(data ?? []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to connect to Supabase");
      }
      setLoading(false);
    }

    fetchGuests();
  }, []);

  const totalGuests = guests.length;
  const attending = guests.filter((g) => g.attending).length;
  const declined = guests.filter((g) => !g.attending).length;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-cream-dark">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-[family-name:var(--font-serif)] text-2xl text-warm">
              Guest Dashboard
            </h1>
            <p className="text-sm text-warm-light mt-1">
              Andrea & Emilio — Wedding RSVP Management
            </p>
          </div>
          <a
            href="/"
            className="text-sm text-rose hover:text-rose-dark underline underline-offset-4 transition-colors"
          >
            &larr; Back to site
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Responses", value: totalGuests, color: "text-warm" },
            { label: "Attending", value: attending, color: "text-green-600" },
            { label: "Declined", value: declined, color: "text-red-500" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <p className="text-sm text-warm-light mb-1">{stat.label}</p>
              <p className={`font-[family-name:var(--font-serif)] text-4xl ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-cream-dark">
            <h2 className="font-[family-name:var(--font-serif)] text-xl text-warm">
              Guest List
            </h2>
          </div>

          {loading ? (
            <div className="p-16 text-center text-warm-light">
              <div className="inline-block w-6 h-6 border-2 border-rose border-t-transparent rounded-full animate-spin mb-4" />
              <p>Loading guests...</p>
            </div>
          ) : error ? (
            <div className="p-16 text-center text-red-500">
              <p className="font-medium mb-2">Connection Error</p>
              <p className="text-sm text-warm-light">{error}</p>
            </div>
          ) : guests.length === 0 ? (
            <div className="p-16 text-center text-warm-light">
              <p>No RSVP responses yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-cream-dark bg-cream/50">
                    <th className="px-6 py-3 text-xs uppercase tracking-[0.15em] text-warm-light font-medium">
                      Name
                    </th>
                    <th className="px-6 py-3 text-xs uppercase tracking-[0.15em] text-warm-light font-medium">
                      Email
                    </th>
                    <th className="px-6 py-3 text-xs uppercase tracking-[0.15em] text-warm-light font-medium">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs uppercase tracking-[0.15em] text-warm-light font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest) => (
                    <tr
                      key={guest.id}
                      className="border-b border-cream-dark/50 hover:bg-cream/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-warm font-medium">
                        {guest.name}
                      </td>
                      <td className="px-6 py-4 text-warm-light">
                        {guest.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full font-medium ${
                            guest.attending
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              guest.attending ? "bg-green-500" : "bg-red-400"
                            }`}
                          />
                          {guest.attending ? "Attending" : "Declined"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-warm-light text-sm">
                        {new Date(guest.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
