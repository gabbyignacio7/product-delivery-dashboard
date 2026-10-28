'use client';
import { useMemo } from 'react';
import { Feature, JiraTicket, SalesOpportunity } from '@/types';
import { formatCurrency, getTierBgColor, getTierTextColor } from '@/lib/utils';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';

interface Props {
  features: Feature[];
  jiraTickets: JiraTicket[];
  salesOpportunities: SalesOpportunity[];
  onFeatureClick: (id: string) => void;
}

export default function ProductRoadmap({ features, onFeatureClick }: Props) {
  const matrixData = useMemo(() => {
    return features.map(f => ({
      ...f,
      x: f.Effort_Estimate_Weeks,
      y: f.Replicability_Score,
      z: f.Weighted_ARR
    }));
  }, [features]);

  const quarterGroups = useMemo(() => {
    const quarters = ['Q4 2026', 'Q1 2027', 'Q2 2027', 'Q3 2027'];
    return quarters.map(q => ({
      quarter: q,
      features: features.filter(f => f.Quarter_Planned === q)
    }));
  }, [features]);

  const agentTypeBreakdown = useMemo(() => {
    const agents: { [key: string]: { count: number; arr: number; effort: number } } = {};
    features.forEach(f => {
      if (!agents[f.Agent_Type]) {
        agents[f.Agent_Type] = { count: 0, arr: 0, effort: 0 };
      }
      agents[f.Agent_Type].count++;
      agents[f.Agent_Type].arr += f.Weighted_ARR;
      agents[f.Agent_Type].effort += f.Effort_Estimate_Weeks;
    });
    return Object.entries(agents).map(([name, data]) => ({ name, ...data }));
  }, [features]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Product Roadmap Dashboard</h1>
        <p className="text-gray-600 mt-1">Feature timeline and portfolio analysis</p>
      </div>

      {/* Replicability vs Effort Matrix */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Replicability vs. Effort Matrix</h2>
        <div className="mb-4 grid grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <div className="font-semibold text-green-800">🎯 Quick Wins</div>
            <div className="text-xs text-green-600">High Replicability, Low Effort</div>
          </div>
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <div className="font-semibold text-blue-800">🚀 Strategic Investments</div>
            <div className="text-xs text-blue-600">High Replicability, High Effort</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <div className="font-semibold text-yellow-800">⚡ Fill-Ins</div>
            <div className="text-xs text-yellow-600">Low Replicability, Low Effort</div>
          </div>
          <div className="bg-red-50 p-3 rounded border border-red-200">
            <div className="font-semibold text-red-800">⚠️ Avoid/Question</div>
            <div className="text-xs text-red-600">Low Replicability, High Effort</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name="Effort (weeks)" label={{ value: 'Effort (weeks)', position: 'insideBottom', offset: -5 }} />
            <YAxis type="number" dataKey="y" name="Replicability" label={{ value: 'Replicability Score', angle: -90, position: 'insideLeft' }} />
            <ZAxis type="number" dataKey="z" range={[50, 400]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
              if (payload && payload[0]) {
                const data = payload[0].payload as Feature;
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                    <div className="font-semibold">{data.Feature_Name}</div>
                    <div className="text-sm text-gray-600">Effort: {data.Effort_Estimate_Weeks}w</div>
                    <div className="text-sm text-gray-600">Replicability: {data.Replicability_Score}</div>
                    <div className="text-sm text-gray-600">ARR: {formatCurrency(data.Weighted_ARR)}</div>
                  </div>
                );
              }
              return null;
            }} />
            <Scatter name="Features" data={matrixData} fill="#3B82F6" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Quarterly Roadmap */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quarterly Feature Roadmap</h2>
        <div className="space-y-6">
          {quarterGroups.map(({ quarter, features: qFeatures }) => (
            <div key={quarter}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{quarter} ({qFeatures.length} features)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {qFeatures.map(f => (
                  <div
                    key={f.Feature_ID}
                    onClick={() => onFeatureClick(f.Feature_ID)}
                    className={`p-4 rounded border-2 cursor-pointer hover:shadow-md transition-all ${getTierBgColor(f.Priority_Tier)}`}
                  >
                    <div className={`text-xs font-semibold mb-1 ${getTierTextColor(f.Priority_Tier)}`}>
                      {f.Priority_Tier}
                    </div>
                    <div className="font-semibold text-gray-900 text-sm mb-2">{f.Feature_Name}</div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Client: {f.Primary_Client}</div>
                      <div>Effort: {f.Effort_Estimate_Weeks}w | ARR: {formatCurrency(f.Weighted_ARR)}</div>
                      <div className="mt-2">
                        <div className="bg-gray-200 h-2 rounded-full">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${f.Completion_Percent}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{f.Completion_Percent}% Complete</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product line portfolio */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Product Line Portfolio View</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Line</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feature Count</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Weighted ARR</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Effort (weeks)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agentTypeBreakdown.map((agent) => (
                <tr key={agent.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{agent.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{agent.count}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-600">{formatCurrency(agent.arr)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{agent.effort}w</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
