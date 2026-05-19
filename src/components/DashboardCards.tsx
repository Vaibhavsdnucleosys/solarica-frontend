import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IndianRupee, ShoppingCart, Users, Tag, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

// KPI Card interface
interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  comparison?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  iconColor?: string;
  textColor?: string; // Explicit text color class if needed, or derived
  isLoading?: boolean;
}

// Individual KPI Card component
const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  comparison,
  trend,
  trendValue,
  iconColor = 'bg-blue-600',
  textColor = 'text-blue-600',
  isLoading = false
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${iconColor} bg-opacity-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
          <div className={`${textColor}`}>
            {icon}
          </div>
        </div>
        {trend && trendValue && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${trend === 'up'
              ? 'bg-green-50 text-green-600'
              : 'bg-red-50 text-red-600'
              }`}
          >
            <span>{trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-semibold mb-1 tracking-wide uppercase text-[11px]">{title}</h3>
      {isLoading ? (
        <div className="flex items-center gap-2 h-9">
          <Loader2 size={20} className="animate-spin text-slate-400" />
          <span className="text-sm text-slate-400">Loading...</span>
        </div>
      ) : (
        <p className="text-3xl font-bold text-slate-800 mb-2 tracking-tight">{value}</p>
      )}
      {comparison && <p className="text-xs text-slate-400 font-medium">{comparison}</p>}
    </div>
  );
};

// Dashboard Cards component - Main container
interface DashboardCardsProps {
  selectedCompany?: string;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ selectedCompany }) => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalLeads: 0,
    pendingQuotes: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Check if token is available
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('token');
    return !!token;
  }, []);

  const fetchStats = useCallback(async () => {
    // Wait for authentication token
    if (!isAuthenticated()) {
      // Retry after a short delay if token not available yet
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current += 1;
        console.log(`Dashboard: Waiting for auth token... (attempt ${retryCountRef.current}/${maxRetries})`);
        setTimeout(() => fetchStats(), 500);
        return;
      } else {
        console.warn('Dashboard: Auth token not available after retries');
        setIsLoading(false);
        return;
      }
    }

    try {
      setIsLoading(true);
      const { getAllQuotations } = await import('../services/quotationService');
      const { getLeads } = await import('../services/leadService');

      const [quotesData, leadsData] = await Promise.all([
        getAllQuotations(),
        getLeads()
      ]);

      // [UPGRADED Section]: Enhanced normalization check for quotations from Code B
      let quotations = [];
      if (Array.isArray(quotesData)) {
        quotations = quotesData;
      } else if (quotesData && Array.isArray(quotesData.quotations)) {
        quotations = quotesData.quotations;
      }

      // Filter by Company if selected
      if (selectedCompany) {
        quotations = quotations.filter((q: any) => q.fromCompanyName === selectedCompany);
      }

      const acceptedQuotes = quotations.filter((q: any) => q.status === 'ACCEPTED');
      const pendingQuotes = quotations.filter((q: any) => q.status !== 'ACCEPTED' && q.status !== 'REJECTED');

      // [UPGRADED Section]: Enhanced normalization check for leads from Code B
      let leads = Array.isArray(leadsData) ? leadsData : (leadsData as any)?.leads || (leadsData as any)?.data || [];

      if (selectedCompany) {
        leads = leads.filter((l: any) => l.createdBy?.worker?.company === selectedCompany);
      }

      const leadsCount = leads.length;

      const revenue = acceptedQuotes.reduce((sum: number, q: any) => {
        const amount = typeof q.netPayableAmount === 'string' ? parseFloat(q.netPayableAmount) : (q.netPayableAmount || 0);
        return sum + amount;
      }, 0);

      setStats({
        totalRevenue: revenue,
        totalOrders: acceptedQuotes.length,
        totalLeads: leadsCount,
        pendingQuotes: pendingQuotes.length
      });
      setHasFetched(true);

    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompany, isAuthenticated]);

  // Initial fetch and refetch on company change
  useEffect(() => {
    retryCountRef.current = 0; // Reset retry count on company change
    fetchStats();
  }, [selectedCompany, fetchStats]);

  // [UPGRADED Section]: Auto-refresh interval (20s) added from Code B
  useEffect(() => {
    const interval = setInterval(fetchStats, 20000);
    return () => clearInterval(interval);
  }, [selectedCompany, fetchStats]);

  // Listen for storage events (in case token is set from another component)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && e.newValue && !hasFetched) {
        retryCountRef.current = 0;
        fetchStats();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchStats, hasFetched]);

  // KPI data
  const kpiData: KPICardProps[] = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <IndianRupee size={24} />,
      iconColor: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: <ShoppingCart size={24} />,
      iconColor: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Pending Quotations',
      value: stats.pendingQuotes.toLocaleString(),
      icon: <Users size={24} />,
      iconColor: 'bg-amber-500',
      textColor: 'text-amber-600'
    },
    {
      title: 'Total Leads',
      value: stats.totalLeads.toLocaleString(),
      icon: <Tag size={24} />,
      iconColor: 'bg-emerald-500',
      textColor: 'text-emerald-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiData.map((kpi, index) => (
        <KPICard key={index} {...kpi} isLoading={isLoading} />
      ))}
    </div>
  );
};

export default DashboardCards;