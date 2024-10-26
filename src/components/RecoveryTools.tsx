import React from 'react';
import { Star, Tag, ExternalLink, Gift } from 'lucide-react';
import { RecoveryTool } from '../types/health';
import { DashboardCard } from './DashboardCard';
import { generateAffiliateUrl, trackAffiliateClick } from '../utils/affiliateUtils';

interface RecoveryToolsProps {
  tools: RecoveryTool[];
  aiRecommended?: boolean;
}

export const RecoveryTools: React.FC<RecoveryToolsProps> = ({ 
  tools,
  aiRecommended = false 
}) => {
  const handleToolClick = (tool: RecoveryTool) => {
    trackAffiliateClick(tool);
    window.open(
      generateAffiliateUrl(tool, 
        aiRecommended ? 'ai_recommendation' : 'general_browse'
      ),
      '_blank'
    );
  };

  return (
    <DashboardCard 
      title={aiRecommended ? "AI-Recommended Recovery Tools" : "Recommended Recovery Tools"} 
      className="h-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="aspect-w-16 aspect-h-9 relative">
              <img
                src={tool.imageUrl}
                alt={tool.name}
                className="w-full h-48 object-cover"
              />
              {aiRecommended && (
                <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  AI Recommended
                </div>
              )}
              {tool.specialOffer && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center">
                  <Gift className="w-4 h-4 mr-2" />
                  {tool.specialOffer}
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{tool.rating}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="ml-1 text-lg font-bold text-gray-900">
                    ${(tool.price * (1 - (tool.discountPercentage || 0) / 100)).toFixed(0)}
                  </span>
                  {tool.discountPercentage && (
                    <span className="ml-2 text-sm text-gray-500 line-through">
                      ${tool.price}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleToolClick(tool)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Get $350 Off
                  <ExternalLink className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};