import { useEffect, useState } from "react";
import { getLeads, getLeadStats } from "../services/leadService";
import { RefreshCw } from "lucide-react";

const statusColors: any = {
  New: "bg-blue-100 text-blue-600",
  Contacted: "bg-yellow-100 text-yellow-600",
  Qualified: "bg-green-100 text-green-600",
  Lost: "bg-red-100 text-red-600",
  Converted: "bg-emerald-100 text-emerald-700",
};

const AdminLeadsPage = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await getLeads({
        search,
        status,
      });
      setLeads(data);

      const statsData = await getLeadStats();
      setStats(statsData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSearch = () => {
    fetchLeads();
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Leads Management</h1>

        <button
          onClick={fetchLeads}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-sm text-gray-400">Total Leads</p>
            <p className="text-xl font-bold">{stats.total.count}</p>
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-sm text-gray-400">Total Value</p>
            <p className="text-xl font-bold">
              ₹ {stats.total.value?.toLocaleString()}
            </p>
          </div>

          {stats.byStatus.map((s: any) => (
            <div key={s.status} className="p-4 bg-white rounded-xl shadow">
              <p className="text-sm text-gray-400">{s.status}</p>
              <p className="text-xl font-bold">{s.count}</p>
            </div>
          ))}
        </div>
      )}

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, email, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
          <option value="Converted">Converted</option>
        </select>

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg"
        >
          Apply
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Status</th>
              <th>Value</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-400">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead: any) => (
                <tr key={lead.id} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-medium">{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.company || "-"}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        statusColors[lead.status] || "bg-gray-100"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>

                  <td>
                    {lead.estimatedValue
                      ? `₹ ${lead.estimatedValue.toLocaleString()}`
                      : "-"}
                  </td>

                  <td>
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLeadsPage;