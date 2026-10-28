'use client';
import { useMemo } from 'react';
import { Feature, JiraTicket, SalesOpportunity } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  features: Feature[];
  jiraTickets: JiraTicket[];
  salesOpportunities: SalesOpportunity[];
  onFeatureClick: (id: string) => void;
}

export default function SalesDashboard({ features, salesOpportunities, onFeatureClick }: Props) {
  const funnelData = useMemo(() => {
    const stages = ['Introduction', 'Qualification', 'Proposal', 'POC', 'Contract Negotiation', 'Closed Won'];
    return stages.map(stage => {
      const stageOpps = salesOpportunities.filter(o => o.Stage === stage);
      return {
        name: stage,
        value: stageOpps.reduce((sum, o) => sum + o.Weighted_ARR, 0),
        count: stageOpps.length
      };
    });
  }, [salesOpportunities]);

  const featureDealMapping = useMemo(() => {
    return features.map(f => {
      const relatedDeals = salesOpportunities.filter(o => 
        o.Mapped_Feature_ID && o.Mapped_Feature_ID.includes(f.Feature_ID)
      );
      const totalValue = relatedDeals.reduce((sum, d) => sum + d.ARR_Value, 0);
      return { ...f, relatedDeals, totalValue };
    }).filter(f => f.relatedDeals.length > 0);
  }, [features, salesOpportunities]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline Dashboard</h1>
        <p className="text-gray-600 mt-1">Revenue forecast and deal-feature mapping</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sales Funnel (Weighted ARR)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `$${Math.round(Number(v) / 1000)}k`} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" name="Weighted ARR" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Opportunities by Stage</h2>
          <div className="space-y-4">
            {funnelData.map((stage, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium text-gray-900">{stage.name}</span>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{formatCurrency(stage.value)}</div>
                  <div className="text-sm text-gray-500">{stage.count} opportunities</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Feature-to-Deal Mapping</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feature</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority Tier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required For Deals</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Deal Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {featureDealMapping.slice(0, 20).map((item) => (
                <tr key={item.Feature_ID} onClick={() => onFeatureClick(item.Feature_ID)} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.Feature_Name}</td>
                  <td className="px-4 py-3 text-sm">{item.Priority_Tier}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.relatedDeals.map(d => d.Opportunity_Name).join(', ')}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-600">{formatCurrency(item.totalValue)}</td>
                  <td className="px-4 py-3 text-sm">{item.Current_Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
