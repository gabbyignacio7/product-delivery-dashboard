'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import ExecutiveDashboard from '@/components/views/ExecutiveDashboard';
import SalesDashboard from '@/components/views/SalesDashboard';
import EngineeringDashboard from '@/components/views/EngineeringDashboard';
import ProductRoadmap from '@/components/views/ProductRoadmap';
import FeatureDetail from '@/components/views/FeatureDetail';
import { Feature, JiraTicket, SalesOpportunity } from '@/types';

const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function Home() {
  const [activeView, setActiveView] = useState('executive');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [jiraTickets, setJiraTickets] = useState<JiraTicket[]>([]);
  const [salesOpportunities, setSalesOpportunities] = useState<SalesOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featuresRes, jiraRes, salesRes] = await Promise.all([
          fetch(`${base}/data/features.json`),
          fetch(`${base}/data/jira.json`),
          fetch(`${base}/data/sales.json`),
        ]);

        const featuresData = await featuresRes.json();
        const jiraData = await jiraRes.json();
        const salesData = await salesRes.json();

        setFeatures(featuresData);
        setJiraTickets(jiraData);
        setSalesOpportunities(salesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFeatureClick = (featureId: string) => {
    setSelectedFeature(featureId);
    setActiveView('detail');
  };

  const handleBackToView = (view: string) => {
    setSelectedFeature(null);
    setActiveView(view);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      
      <main className="container mx-auto px-4 py-8">
        {activeView === 'executive' && (
          <ExecutiveDashboard 
            features={features} 
            jiraTickets={jiraTickets}
            salesOpportunities={salesOpportunities}
            onFeatureClick={handleFeatureClick}
          />
        )}
        
        {activeView === 'sales' && (
          <SalesDashboard 
            features={features} 
            jiraTickets={jiraTickets}
            salesOpportunities={salesOpportunities}
            onFeatureClick={handleFeatureClick}
          />
        )}
        
        {activeView === 'engineering' && (
          <EngineeringDashboard 
            features={features} 
            jiraTickets={jiraTickets}
            salesOpportunities={salesOpportunities}
            onFeatureClick={handleFeatureClick}
          />
        )}
        
        {activeView === 'product' && (
          <ProductRoadmap 
            features={features} 
            jiraTickets={jiraTickets}
            salesOpportunities={salesOpportunities}
            onFeatureClick={handleFeatureClick}
          />
        )}
        
        {activeView === 'detail' && selectedFeature && (
          <FeatureDetail 
            featureId={selectedFeature}
            features={features} 
            jiraTickets={jiraTickets}
            salesOpportunities={salesOpportunities}
            onBack={() => handleBackToView('executive')}
          />
        )}
      </main>
    </div>
  );
}
