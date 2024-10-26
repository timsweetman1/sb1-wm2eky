import { config } from '../config/env';
import { RecoveryTool } from '../types/health';

const AFFILIATE_BASE_URL = 'https://refer.eight.sl';

interface AffiliateParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export function buildAffiliateUrl(
  tool: RecoveryTool,
  params: AffiliateParams
): string {
  // Eight Sleep uses a different URL structure for referrals
  const referralUrl = `${AFFILIATE_BASE_URL}/${config.affiliate.eightSleepPartnerId}`;
  
  // Add UTM parameters if needed
  const url = new URL(referralUrl);
  
  if (params.utmSource) {
    url.searchParams.append('utm_source', params.utmSource);
  }
  if (params.utmMedium) {
    url.searchParams.append('utm_medium', params.utmMedium);
  }
  if (params.utmCampaign) {
    url.searchParams.append('utm_campaign', params.utmCampaign);
  }

  return url.toString();
}