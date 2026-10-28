'use client';
import { useMemo, useState } from 'react';
import { Feature, JiraTicket, SalesOpportunity } from '@/types';
import { formatCurrency, getTierBgColor, getTierTextColor, getStatusColor, exportToCSV } from '@/lib/utils';
import KPICard from '../shared/KPICard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Props {
  features: Feature[];
  jiraTickets: JiraTicket[];
  salesOpportunities: SalesOpportunity[];
  onFeatureClick: (id: string) => void;
}

export default function ExecutiveDashboard({ features, salesOpportunities, onFeatureClick }: Props) {
  const [filterQuarter, setFilterQuarter] = useState<string>('All');
  const [filterTier, setFilterTier] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredFeatures = useMemo(() => {
    return features.filter(f => {
      if (filterQuarter !== 'All' && f.Quarter_Planned !== filterQuarter) return false;
      if (filterTier !== 'All' && !f.Priority_Tier.includes(filterTier)) return false;
      if (filterStatus !== 'All' && f.Current_Status !== filterStatus) return false;
      return true;
    });
  }, [features, filterQuarter, filterTier, filterStatus]);

  const kpis = useMemo(() => {
    const totalPipeline = salesOpportunities.reduce((sum, opp) => sum + opp.ARR_Value, 0);
    const totalWeighted = salesOpportunities.reduce((sum, opp) => sum + opp.Weighted_ARR, 0);
    const totalEffort = filteredFeatures.reduce((sum, f) => sum + f.Effort_Estimate_Weeks, 0);
    const tierCounts = {
      tier0: filteredFeatures.filter(f => f.Priority_Tier.includes('0')).length,
      tier1: filteredFeatures.filter(f => f.Priority_Tier.includes('1')).length,
      tier2: filteredFeatures.filter(f => f.Priority_Tier.includes('2')).length,
      tier3: filteredFeatures.filter(f => f.Priority_Tier.includes('3')).length,
      tier4: filteredFeatures.filter(f => f.Priority_Tier.includes('4')).length,
    };
    
    return { totalPipeline, totalWeighted, totalEffort, tierCounts };
  }, [salesOpportunities, filteredFeatures]);

  const tierDistribution = useMemo(() => {
    const tiers = ['Tier 0', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'];
    return tiers.map(tier => {
      const tierFeatures = filteredFeatures.filter(f => f.Priority_Tier.includes(tier.split(' ')[1]));
      return {
        name: tier,
        count: tierFeatures.length,
        arr: tierFeatures.reduce((sum, f) => sum + f.Weighted_ARR, 0),
      };
    });
  }, [filteredFeatures]);

  const topFeatures = useMemo(() => {
    return [...filteredFeatures]
      .sort((a, b) => b.Priority_Score - a.Priority_Score)
      .slice(0, 10);
  }, [filteredFeatures]);

  const atRiskFeatures = useMemo(() => {
    return filteredFeatures.filter(f => f.Priority_Tier.includes('0'));
  }, [filteredFeatures]);

  const quarters = ['All', 'Q4 2026', 'Q1 2027', 'Q2 2027', 'Q3 2027'];
  const tiers = ['All', '0', '1', '2', '3', '4'];
  const statuses = ['All', 'Not Started', 'In Progress', 'Blocked', 'Completed'];

  const COLORS = ['#DC2626', '#F59E0B', '#FACC15', '#60A5FA', '#9CA3AF'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Summary Dashboard</h1>
          <p className="text-gray-600 mt-1">Unified priority scoring and portfolio overview</p>
        </div>
        <button
          onClick={() => exportToCSV(filteredFeatures, 'features-export.csv')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          📥 Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quarter</label>
            <select
              value={filterQuarter}
              onChange={(e) => setFilterQuarter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {quarters.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority Tier</label>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tiers.map(t => <option key={t} value={t}>{t === 'All' ? 'All Tiers' : `Tier ${t}`}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Hero KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Total Pipeline ARR" value={formatCurrency(kpis.totalPipeline)} icon="💰" color="blue" />
        <KPICard title="Weighted ARR" value={formatCurrency(kpis.totalWeighted)} icon="📊" color="green" />
        <KPICard title="Engineering Capacity" value={`${kpis.totalEffort} weeks`} icon="⚙️" color="purple" />
        <KPICard title="Total Features" value={filteredFeatures.length} icon="🎯" color="orange" />
        <KPICard title="Tier 0 (At Risk)" value={kpis.tierCounts.tier0} icon="🚨" color="red" />
      </div>

      {/* Revenue at Risk Alert */}
      {atRiskFeatures.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center">
            <span className="mr-2">🚨</span> Revenue at Risk - Immediate Attention Required
          </h2>
          <div className="space-y-3">
            {atRiskFeatures.map(feature => (
              <div
                key={feature.Feature_ID}
                onClick={() => onFeatureClick(feature.Feature_ID)}
                className="bg-white p-4 rounded border border-red-200 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{feature.Feature_Name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Client: {feature.Primary_Client} | ARR at Risk: {formatCurrency(feature.ARR_Amount)}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(feature.Current_Status)}`}>
                      {feature.Current_Status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Target: {feature.Target_Completion_Date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Priority Tier Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tierDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" name="Feature Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Weighted ARR by Tier</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tierDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${formatCurrency(Number(entry.arr))}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="arr"
              >
                {tierDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 10 Features by Priority Score */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top 10 Features by Priority Score</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feature</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weighted ARR</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effort</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topFeatures.map((feature, index) => (
                <tr
                  key={feature.Feature_ID}
                  onClick={() => onFeatureClick(feature.Feature_ID)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{feature.Feature_Name}</td>
                  <td className="px-4 py-3 text-sm font-bold text-blue-600">{feature.Priority_Score.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getTierBgColor(feature.Priority_Tier)} ${getTierTextColor(feature.Priority_Tier)}`}>
                      {feature.Priority_Tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(feature.Weighted_ARR)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{feature.Effort_Estimate_Weeks}w</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{feature.Primary_Client}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(feature.Current_Status)}`}>
                      {feature.Current_Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
