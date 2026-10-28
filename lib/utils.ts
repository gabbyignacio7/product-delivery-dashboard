import { Feature } from '@/types';

export function getTierColor(tier: string): string {
  if (tier.includes('0')) return '#DC2626'; // Red
  if (tier.includes('1')) return '#F59E0B'; // Amber
  if (tier.includes('2')) return '#FACC15'; // Yellow
  if (tier.includes('3')) return '#60A5FA'; // Blue
  return '#9CA3AF'; // Gray
}

export function getTierBgColor(tier: string): string {
  if (tier.includes('0')) return 'bg-red-100 border-red-300';
  if (tier.includes('1')) return 'bg-orange-100 border-orange-300';
  if (tier.includes('2')) return 'bg-yellow-100 border-yellow-300';
  if (tier.includes('3')) return 'bg-blue-100 border-blue-300';
  return 'bg-gray-100 border-gray-300';
}

export function getTierTextColor(tier: string): string {
  if (tier.includes('0')) return 'text-red-700';
  if (tier.includes('1')) return 'text-orange-700';
  if (tier.includes('2')) return 'text-yellow-700';
  if (tier.includes('3')) return 'text-blue-700';
  return 'text-gray-700';
}

export function getStatusColor(status: string): string {
  if (status === 'Completed') return 'bg-green-100 text-green-700 border-green-300';
  if (status === 'In Progress') return 'bg-blue-100 text-blue-700 border-blue-300';
  if (status === 'Blocked') return 'bg-red-100 text-red-700 border-red-300';
  if (status === 'Cancelled') return 'bg-gray-100 text-gray-500 border-gray-300';
  return 'bg-gray-100 text-gray-600 border-gray-300';
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function calculatePriorityScore(feature: Feature): number {
  if (feature.Effort_Estimate_Weeks === 0) return 0;
  // ARR in thousands, weighted by replicability (1 to 5) and win probability, per week of effort
  return ((feature.ARR_Amount / 1000) * feature.Replicability_Score * (feature.Conversion_Probability / 100)) /
         (feature.Effort_Estimate_Weeks * 3);
}

export function getPriorityTier(feature: Feature): string {
  if (feature.Revenue_at_Risk === 'YES') return 'Tier 0: Emergency';
  const score = feature.Priority_Score;
  if (score >= 100) return 'Tier 1: Fast Track';
  if (score >= 50) return 'Tier 2: Standard Delivery';
  if (score >= 10) return 'Tier 3: Custom Engagement';
  return 'Tier 4: Backlog';
}

export function exportToCSV(data: object[], filename: string) {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = (row as Record<string, unknown>)[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
