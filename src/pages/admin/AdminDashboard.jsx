import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  Shield,
  Heart,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calendar,
  Bell,
  Search,
  Filter,
  UserPlus,
  BarChart3,
} from "lucide-react";
import PieChart from "../../components/charts/PieChart";
import BarChart from "../../components/charts/BarChart";
import StatCard from "../../components/reusable/StatCard";
// Select removed — not needed when using system-stat monthly data
import {
  getDashboardOverview,
  getDashboardDocumentTypes,
  getDashboardTopDocuments,
  getDashboardDocumentRequests,
  getDashboardUsers,
  getDashboardPerformance,
  getDashboardMonthlyComparison,
  getSystemStats,
} from '../../api/dashboardApi';

const stats = [
  {
    icon: <Users className="text-blue-600" />,
    label: "Total Population",
    value: 1240,
    color: "bg-white border-gray-200",
    trend: 1,
    percentage: 2.3,
  },
  {
    icon: <UserCheck className="text-green-600" />,
    label: "Official Members",
    value: 15,
    color: "bg-white border-gray-200",
    trend: 1,
    percentage: 6.7,
  },
  {
    icon: <Users className="text-purple-600" />,
    label: "Senior Citizens",
    value: 210,
    color: "bg-white border-gray-200",
    trend: 1,
    percentage: 1.2,
  },
  {
    icon: <Shield className="text-orange-600" />,
    label: "PWD",
    value: 35,
    color: "bg-white border-gray-200",
    trend: -1,
    percentage: 0.5,
  },
  {
    icon: <Heart className="text-pink-600" />,
    label: "Single Parents",
    value: 50,
    color: "bg-white border-gray-200",
    trend: 1,
    percentage: 3.1,
  },
];

const pieChartData = [
  { label: "Registered Voters", value: 900, color: "#7A0000" },
  { label: "Non-Voters", value: 340, color: "#F7DB9F" },
];

const topRequest = {
  icon: <FileText className="text-indigo-600" />,
  label: "Most Requested Document",
  value: "Barangay Clearance",
  color: "bg-white border-gray-200",
};

const AdminDashboard = () => {
  const scrollRef = React.useRef(null);
  // blotterStats removed: use monthlyComparison from system-stat instead
  const [overviewStats, setOverviewStats] = useState(null);
  const [docTypeStats, setDocTypeStats] = useState([]);
  const [topDocument, setTopDocument] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [usersStats, setUsersStats] = useState(null);
  const [requestsStats, setRequestsStats] = useState(null);
  const [monthlyComparison, setMonthlyComparison] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(() => new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0,10));
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0,10));

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const amount = clientWidth * 0.7;
    scrollRef.current.scrollTo({
      left: dir === "left" ? scrollLeft - amount : scrollLeft + amount,
      behavior: "smooth",
    });
  };

  const navigate = useNavigate();  
  // Extracted fetch function so it can be reused on Apply
  const fetchAllDashboardStats = async (overrideParams = {}) => {
    setStatsLoading(true);
    try {
      const params = {
        date_from: dateFrom,
        date_to: dateTo,
        ...overrideParams,
      };

      // Use the combined system-stat endpoint exclusively and map its values
      const systemRes = await getSystemStats(params).catch((e) => ({ success: false, error: e }));
      if (systemRes && systemRes.success && systemRes.data) {
        const d = systemRes.data;

        // Map overview-like fields to the existing overviewStats shape used by UI
        setOverviewStats({
          total_population: d.total_users || 0,
          official_members: d.officials || 0,
          senior_citizens: d.senior_citizen_60_plus || 0,
          pwd: d.total_pwd || 0,
          single_parents: d.total_single_parent || 0,
          average_age: d.average_age ?? null,
          male_count: d.male_count ?? null,
          female_count: d.female_count ?? null,
          // user_type may come as an object with counts per role
          user_type_admin: (d.user_type && d.user_type.admin) ?? 0,
          user_type_staff: (d.user_type && d.user_type.staff) ?? 0,
          user_type_residence: (d.user_type && d.user_type.residence) ?? (d.user_type && d.user_type.residence_count) ?? 0,
        });

        // Document types
        setDocTypeStats((d.document_type_distribution || []).map(item => ({
          type: item.document_name || item.label || item.name,
          count: item.count || item.value || 0,
        })));

        // Top document
        if (d.most_requested_document) {
          setTopDocument({
            name: d.most_requested_document.document_name || d.most_requested_document.label,
            count: d.most_requested_document.count || d.most_requested_document.total || 0,
          });
        }

        // Performance
        setPerformanceMetrics({
          completion_rate: d.completion_rate_percent ?? d.completion_rate ?? null,
          average_processing_time: d.average_processing_time_minutes ?? d.average_processing_time ?? null,
          median_processing_time: d.median_processing_time ?? null,
          pending_requests: d.pending_document_requests ?? d.pending_requests ?? null,
        });

        // Users and requests
        setUsersStats({ total: d.total_users || 0 });
        setRequestsStats({ total: d.total_requests || 0 });

        // Monthly comparison mapping
        setMonthlyComparison((d.monthly_blotter_and_request || []).map(m => ({
          month: m.month,
          label: m.month,
          blotter_count: m.blotter_count ?? m.blotters ?? 0,
          total_requests: m.request_count ?? m.requests ?? m.total ?? 0,
        })));
      } else {
        // if system-stat fails, clear states to avoid stale UI
        setOverviewStats({});
        setDocTypeStats([]);
        setTopDocument(null);
        setPerformanceMetrics({});
        setUsersStats({});
        setRequestsStats({});
        setMonthlyComparison([]);
        console.error('system-stat fetch failed', systemRes && systemRes.error);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // blotter-specific fetching removed; monthly data comes from system-stat

  useEffect(() => {
    fetchAllDashboardStats();
  }, []);

  // yearOptions removed — we use system-stat monthly data instead

  // Dynamic stats cards (now includes all Performance Metrics)
  const dynamicStats = overviewStats
    ? [
        {
          icon: <UserCheck className="text-green-600" />, 
          label: "Official Members",
          value: overviewStats.official_members || 0,
          color: "bg-white border-gray-200",
        },
        {
          icon: <FileText className="text-indigo-600" />, 
          label: "Total Requests",
          value: requestsStats?.total || 0,
          color: "bg-white border-gray-200",
        },
        {
          icon: <TrendingUp className="text-emerald-600" />, 
          label: "Completion Rate",
          value: performanceMetrics?.completion_rate ? (performanceMetrics.completion_rate + '%') : '0%',
          color: "bg-white border-gray-200",
        },
        {
          icon: <Users className="text-blue-600" />, 
          label: "Total Users",
          value: usersStats?.total || overviewStats.total_population || 0,
          color: "bg-white border-gray-200",
        },
        // Performance Metrics
        {
          icon: <BarChart3 className="text-gray-600" />,
          label: "Average Processing Time",
          value:
            performanceMetrics?.average_processing_time != null
              ? performanceMetrics.average_processing_time + " minute"
              : performanceMetrics?.average_total_time != null
                ? performanceMetrics.average_total_time + " minute"
                : '—',
          color: "bg-white border-gray-200",
        },
        {
          icon: <TrendingUp className="text-emerald-600" />,
          label: "Request Document Completion Rate ",
          value: performanceMetrics?.completion_rate ? (performanceMetrics.completion_rate + '%') : '—',
          color: "bg-white border-gray-200",
        },
        {
          icon: <FileText className="text-indigo-600" />,
          label: "Pending Requests",
          value: performanceMetrics?.pending_requests ?? '—',
          color: "bg-white border-gray-200",
        },
      ]
    : stats;

  // Pie chart from docTypeStats
  const dynamicPieChartData = docTypeStats.length
    ? docTypeStats
        .filter(item => (item.type || item.label) && (item.count || item.value))
        .map((item, idx) => ({
          label: item.type || item.label || `Type ${idx + 1}`,
          value: item.count || item.value || 0,
          color: ["#7A0000", "#F7DB9F", "#4F8A8B", "#F9B208", "#6A0572", "#2E8B57", "#FF6347", "#4682B4"][idx % 8],
        }))
    : pieChartData;

  // Render document type breakdown grid
  const renderDocTypeDetails = () => (
    <div className="mt-4">
      <h4 className="text-xs font-semibold text-gray-700 mb-2">Document Type Breakdown</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {dynamicPieChartData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: item.color }}></span>
            <span className="text-xs text-gray-700 flex-1">{item.label}</span>
            <span className="text-xs font-semibold text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Top request card (used after the scrollable)
  const dynamicTopRequest = topDocument
    ? {
        icon: <FileText className="text-indigo-600" />,
        label: "Most Requested Document",
        value: topDocument.name || topDocument.label,
        color: "bg-white border-gray-200",
      }
    : topRequest;

  // helper: format month strings like '2025-10' -> 'Oct'
  const formatMonth = (ym) => {
    try {
      const d = new Date((ym || '').toString().includes('-') ? ym + '-01' : ym);
      return d.toLocaleString('default', { month: 'short' });
    } catch (e) {
      return ym;
    }
  };

  return (

    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Barangay management overview
            </p>
          </div>

          {/* Improved Date Range UI */}
          <div className="bg-white/80 border border-gray-200 rounded-lg shadow-sm px-4 py-2 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-blue-500 mr-1" />
              <label className="text-xs text-gray-600 mr-1">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
              />
            </div>
            <span className="text-gray-400 text-xs font-medium">—</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-blue-500 mr-1" />
              <label className="text-xs text-gray-600 mr-1">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
              />
            </div>
            <button
              onClick={() => fetchAllDashboardStats()}
              className="flex items-center gap-1 ml-0 sm:ml-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow hover:from-blue-700 hover:to-blue-600 transition"
            >
              <Filter className="w-4 h-4" />
              Apply
            </button>
          </div>
        </div>
      </div>

            {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm mb-4 border border-gray-200 p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: <UserPlus className="w-4 h-4" />,
                label: "Add Resident",
                color: "border-green-200 text-green-700 hover:bg-green-50",
                onClick: () => navigate('/admin/resident-management/new')
              },
              {
                icon: <Users className="w-4 h-4" />,
                label: "View Residents",
                color: "border-purple-200 text-purple-700 hover:bg-purple-50",
                onClick: () => navigate('/admin/resident-management/all-resident')
              },
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`${action.color} bg-white border-2 p-3 rounded-lg transition-all duration-200 flex flex-col items-center gap-2 hover:shadow-md cursor-pointer hover:scale-105 hover:-translate-y-1`}
              >
                <div className="transition-transform duration-200 hover:scale-110">{action.icon}</div>
                <span className="text-xs font-medium text-center">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="relative w-full mb-8">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-1.5 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md hover:scale-110 transition-all duration-200 shadow-sm hidden sm:block cursor-pointer"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <div
            ref={scrollRef}
            className="overflow-x-auto scrollbar-hide"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="grid grid-flow-col auto-cols-[minmax(200px,1fr)] sm:auto-cols-[minmax(240px,1fr)] gap-4 min-w-max px-0 sm:px-8">
              {statsLoading
                ? Array(5).fill(0).map((_, idx) => (
                    <div key={idx} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
                  ))
                : dynamicStats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
              {!statsLoading && <StatCard {...dynamicTopRequest} />}
            </div>
          </div>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-1.5 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md hover:scale-110 transition-all duration-200 shadow-sm hidden sm:block cursor-pointer"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Grouped Summary Stats (moved below the scrollable) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Column 1: Population */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h4 className="text-sm font-semibold text-gray-900">Population</h4>
            <div className="mt-3 grid">
              <StatCard icon={<Users className="text-blue-600" />} label="Total Population" value={overviewStats?.total_population || 0} color="bg-white border-gray-100" />
              <StatCard icon={<UserPlus className="text-teal-600" />} label="Male" value={overviewStats?.male_count ?? 0} color="bg-white border-gray-100" />
              <StatCard icon={<UserPlus className="text-pink-600" />} label="Female" value={overviewStats?.female_count ?? 0} color="bg-white border-gray-100" />
            </div>
          </div>

          {/* Column 2: Age & Special Groups */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h4 className="text-sm font-semibold text-gray-900">Age & Groups</h4>
            <div className="mt-3 grid">
              <StatCard icon={<BarChart3 className="text-gray-600" />} label="Average Age" value={overviewStats?.average_age ? Math.ceil(overviewStats.average_age) : '—'} color="bg-white border-gray-100" />
              <StatCard icon={<Users className="text-purple-600" />} label="Senior Citizens" value={overviewStats?.senior_citizens ?? 0} color="bg-white border-gray-100" />
              <StatCard icon={<Shield className="text-orange-600" />} label="PWD" value={overviewStats?.pwd ?? 0} color="bg-white border-gray-100" />
              <StatCard icon={<Heart className="text-pink-600" />} label="Single Parents" value={overviewStats?.single_parents ?? 0} color="bg-white border-gray-100" />
            </div>
          </div>

          {/* Column 3: User Types */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h4 className="text-sm font-semibold text-gray-900">User Types</h4>
            <div className="mt-3 grid">
              <StatCard icon={<UserCheck className="text-indigo-600" />} label="Admins" value={overviewStats?.user_type_admin ?? 0} color="bg-white border-gray-100" />
              <StatCard icon={<Users className="text-teal-600" />} label="Staff" value={overviewStats?.user_type_staff ?? 0} color="bg-white border-gray-100" />
              <StatCard icon={<UserPlus className="text-gray-600" />} label="Residents" value={overviewStats?.user_type_residence ?? 0} color="bg-white border-gray-100" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Voters Chart / Document Types Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Document Type Distribution
              </h3>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date().getFullYear()}
              </div>
            </div>
            <div className="flex justify-center mb-4">
              {statsLoading ? (
                <div className="h-32 w-32 bg-gray-100 animate-pulse rounded-full" />
              ) : (
                <PieChart data={dynamicPieChartData} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {dynamicPieChartData.slice(0, 2).map((item, idx) => (
                <div
                  key={idx}
                  className={`text-center p-3 rounded-lg border`}
                  style={{ background: item.color + '22', borderColor: item.color + '44' }}
                >
                  <div className="text-lg font-semibold" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-xs text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
            {/* More document type data */}
            {!statsLoading && renderDocTypeDetails()}
          </div>

          {/* Blotter Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Blotter Cases
              </h3>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Monthly
                  </div>
            </div>
            <div className="mb-4">
                  {/* Render blotter monthly data from system-stat monthlyComparison */}
                  {statsLoading ? (
                    <div className="flex items-center justify-center h-[200px]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
                    </div>
                  ) : (
                    <BarChart data={(monthlyComparison || []).map((m, idx) => ({ label: formatMonth(m.month || m.label || `M${idx+1}`), value: m.blotter_count ?? 0 }))} />
                  )}
            </div>
                <div className="flex justify-between text-xs text-gray-600 pt-3 border-t border-gray-100">
                  <span>Total Cases: {(monthlyComparison || []).reduce((s, m) => s + (m.blotter_count ?? 0), 0)}</span>
                  <span>
                    Average: {(((monthlyComparison || []).reduce((s, m) => s + (m.blotter_count ?? 0), 0)) / Math.max(1, (monthlyComparison || []).length)).toFixed(1)}/month
                  </span>
                </div>
          </div>
        </div>

        {/* Performance & Monthly Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Only Monthly Comparison remains here */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Monthly Comparison (Requests)</h3>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Year-to-date
              </div>
            </div>

            <div style={{ height: 220 }}>
              {statsLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full border-b-2 animate-spin border-red-900"></div>
                </div>
              ) : (
                <BarChart data={(monthlyComparison || []).map((m, idx) => ({
                  label: m.label || m.month || m.name || `M${idx+1}`,
                  value: m.total_requests ?? m.total ?? m.count ?? m.requests ?? m.value ?? 0
                }))} />
              )}
            </div>
          </div>
        </div>

    
    </div>
  );
};

export default AdminDashboard;
