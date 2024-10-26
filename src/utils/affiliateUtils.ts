import { RecoveryTool } from '../types/health';
import { buildAffiliateUrl } from '../services/affiliate';

interface AffiliateConfig {
  defaultUtmSource: string;
  defaultUtmMedium: string;
  defaultUtmCampaign: string;
}

const config: AffiliateConfig = {
  defaultUtmSource: 'healthsync',
  defaultUtmMedium: 'ai_recommendation',
  defaultUtmCampaign: 'sleep_optimization'
};

export function generateAffiliateUrl(
  tool: RecoveryTool,
  source: string = config.defaultUtmSource
): string {
  return buildAffiliateUrl(tool, {
    utmSource: source,
    utmMedium: config.defaultUtmMedium,
    utmCampaign: config.defaultUtmCampaign
  });
}

export function trackAffiliateClick(tool: RecoveryTool): void {
  // Simple console logging for now
  console.log('Affiliate click:', {
    tool_id: tool.id,
    tool_name: tool.name,
    tool_category: tool.category,
    tool_price: tool.price,
    has_discount: !!tool.discountPercentage,
    timestamp: new Date().toISOString()
  });
}