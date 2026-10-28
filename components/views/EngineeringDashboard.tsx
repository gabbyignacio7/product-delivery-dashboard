'use client';
import { useMemo } from 'react';
import { Feature, JiraTicket, SalesOpportunity } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface Props {
  features: Feature[];
  jiraTickets: JiraTicket[];
  salesOpportunities: SalesOpportunity[];
  onFeatureClick: (id: string) => void;
}

export default function EngineeringDashboard({ features, jiraTickets }: Props) {
  const categoryBreakdown = useMemo(() => {
    const categories: { [key: string]: number } = {};
    jiraTickets.forEach(t => {
      categories[t.Category] = (categories[t.Category] || 0) + t.Story_Points;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [jiraTickets]);

  const blockedTickets = useMemo(() => {
    return jiraTickets.filter(t => t.Status === 'Blocked');
  }, [jiraTickets]);

  const capacityData = useMemo(() => {
    const total = features.reduce((sum, f) => sum + f.Effort_Estimate_Weeks, 0);
    const inProgress = features.filter(f => f.Current_Status === 'In Progress')
      .reduce((sum, f) => sum + f.Effort_Estimate_Weeks, 0);
    const notStarted = features.filter(f => f.Current_Status === 'Not Started')
      .reduce((sum, f) => sum + f.Effort_Estimate_Weeks, 0);
    
    return { total, inProgress, notStarted, available: Math.max(0, 520 - inProgress) };
  }, [features]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Engineering Capacity Dashboard</h1>
        <p className="text-gray-600 mt-1">Team workload, sprints, and technical debt</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Backlog</h3>
          <p className="text-3xl font-bold text-gray-900">{capacityData.total}w</p>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
          <p className="text-3xl font-bold text-gray-900">{capacityData.inProgress}w</p>
        </div>
        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600">Not Started</h3>
          <p className="text-3xl font-bold text-gray-900">{capacityData.notStarted}w</p>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Tickets</h3>
          <p className="text-3xl font-bold text-gray-900">{jiraTickets.length}</p>
        </div>
      </div>

      {blockedTickets.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ Blocked Work ({blockedTickets.length} tickets)</h2>
          <div className="space-y-2">
            {blockedTickets.slice(0, 10).map(ticket => (
              <div key={ticket.JIRA_Ticket_ID} className="bg-white p-3 rounded border border-red-200">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">{ticket.JIRA_Ticket_ID}: {ticket.Title}</span>
                  <span className="text-sm text-gray-600">{ticket.Client_Name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Technical Debt vs Feature Work</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryBreakdown} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Story Points by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
