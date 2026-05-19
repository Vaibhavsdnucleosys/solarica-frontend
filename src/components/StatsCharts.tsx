import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// --- Data ---
const revenueData = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Apr', revenue: 2780, profit: 3908 },
  { name: 'May', revenue: 1890, profit: 4800 },
  { name: 'Jun', revenue: 2390, profit: 3800 },
  { name: 'Jul', revenue: 3490, profit: 4300 },
  { name: 'Aug', revenue: 4200, profit: 5100 },
  { name: 'Sep', revenue: 5100, profit: 5300 },
  { name: 'Oct', revenue: 6100, profit: 6200 },
  { name: 'Nov', revenue: 5800, profit: 5900 },
  { name: 'Dec', revenue: 7100, profit: 6800 },
];

const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Fashion', value: 300 },
  { name: 'Home', value: 300 },
  { name: 'Sports', value: 200 },
];

const regionData = [
  { name: 'Pune', sales: 4000 },
  { name: 'Mumbai', sales: 3000 },
  { name: 'Nashik', sales: 2000 },
  { name: 'Other', sales: 2780 },
];

const COLORS = ['#1E3A8A', '#34A853', '#FFA726', '#EF4444'];

// --- Components ---

const RevenueChart: React.FC = () => {
  const [data, setData] = React.useState<{ name: string; value: number }[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { getInvoices } = await import('../services/invoiceService');
        const invoices = await getInvoices();

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = monthNames.map(name => ({ name, value: 0 }));

        if (invoices && Array.isArray(invoices)) {
          invoices.forEach(inv => {
            if (inv.invoiceDate) {
              const date = new Date(inv.invoiceDate);
              // Filter for current year if needed, or just take month
              // For simplicity and "real data" feel, we'll map all to their month
              const monthIndex = date.getMonth();
              if (monthIndex >= 0 && monthIndex < 12) {
                monthlyData[monthIndex].value += 1;
              }
            }
          });
        }
        setData(monthlyData);
      } catch (error) {
        console.error("Failed to fetch invoice volume", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Invoice Volume</h3>
          <p className="text-sm text-slate-500">Monthly invoice generation count</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-slate-600"><span className="w-2 h-2 rounded-full bg-violet-600"></span> Volume</span>
        </div>
      </div>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ color: '#1E293B', fontSize: '12px', fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const CompanyRevenueChart: React.FC<{ selectedCompany?: string }> = ({ selectedCompany }) => {
  const [data, setData] = React.useState<{ name: string; value: number }[]>([]);
  const [totalRevenue, setTotalRevenue] = React.useState(0);

  React.useEffect(() => {
    fetchCompanyRevenue();
  }, [selectedCompany]);

  const fetchCompanyRevenue = async () => {
    try {
      const { getAllQuotations } = await import('../services/quotationService');
      const response = await getAllQuotations();

      let quotations: any[] = [];
      if (Array.isArray(response)) {
        quotations = response;
      } else if (response && Array.isArray(response.quotations)) {
        quotations = response.quotations;
      }

      // Filter Accepted Only
      const acceptedQuotes = quotations.filter((q: any) => q.status === 'ACCEPTED');

      // Initialize with all companies or just selected
      const revenueByCompany: Record<string, number> = selectedCompany
        ? { [selectedCompany]: 0 }
        : {
          "Solarica Energy India Pvt Ltd": 0,
          "Solarica Systems Pvt Ltd": 0,
          "Solarica Fabtech Pvt Ltd": 0,
          "Solarica Industries Pvt Ltd": 0,
          "Solarica Greenwheels Pvt Ltd": 0
        };

      let total = 0;

      acceptedQuotes.forEach((q: any) => {
        const company = q.fromCompanyName;
        const amount = typeof q.netPayableAmount === 'string' ? parseFloat(q.netPayableAmount) : (q.netPayableAmount || 0);

        // If the company name from DB matches one of our keys, add to it
        // Otherwise, ignore or handle as 'Other' if strictness isn't guaranteed
        if (revenueByCompany.hasOwnProperty(company)) {
          revenueByCompany[company] += amount;
        } else {
          // Fallback for slight variations or old data if necessary, 
          // but for now we stick to the requested 5.
        }

        // Total still sums everything for accuracy or just the 5? 
        // Let's sum only the 5 to match the chart slices.
        if (revenueByCompany.hasOwnProperty(company)) {
          total += amount;
        }
      });

      const chartData = Object.keys(revenueByCompany).map(key => {
        // Simplify for display
        let shortName = key.replace('Solarica ', '').replace(' Pvt Ltd', '');
        // Specific short names if 'Industries'/'Systems' is ambiguous? No, they are distinct.
        // 'Energy India' -> 'Energy'
        if (shortName === 'Energy India') shortName = 'Energy';

        return {
          name: shortName,
          value: revenueByCompany[key]
        };
      });

      setData(chartData);
      setTotalRevenue(total);

    } catch (error) {
      console.error("Failed to fetch company revenue stats", error);
    }
  };

  const COMPANY_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#6366F1'];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-[400px] flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">Revenue by Company</h3>
        <p className="text-sm text-slate-500">Distribution across group companies</p>
      </div>

      {data.length > 0 ? (
        <>
          <div className="flex-1 w-full min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COMPANY_COLORS[index % COMPANY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | undefined) => `₹${(value || 0).toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#1E293B', fontSize: '12px', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-xl font-bold text-slate-800">₹{(totalRevenue / 100000).toFixed(1)}L</p>
              <p className="text-xs text-slate-500 font-medium">Total Rev</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {data.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COMPANY_COLORS[index % COMPANY_COLORS.length] }}></div>
                <span className="text-xs text-slate-600 font-medium">{entry.name} ({Math.round((entry.value / totalRevenue) * 100)}%)</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-2xl">bar_chart</span>
          </div>
          <p className="text-sm font-medium">No revenue data available</p>
        </div>
      )}
    </div>
  );
};



interface StatsChartsProps {
  selectedCompany?: string;
}

const StatsCharts: React.FC<StatsChartsProps> = ({ selectedCompany }) => {
  return (
    <div className="space-y-6">
      {/* Top Row: Revenue & Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <CompanyRevenueChart selectedCompany={selectedCompany} />
        </div>
      </div>

    </div>
  );
};

export default StatsCharts;

