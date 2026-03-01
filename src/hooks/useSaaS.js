import { useDashboardData } from "./useDashboardData";

export function useSaaS() {
  const { organization } = useDashboardData();
  const tier = organization?.subscriptionTier || 'Free';

  const features = {
    automation: tier === 'Pro' || tier === 'Enterprise',
    aiScoring: tier === 'Pro' || tier === 'Enterprise',
    aiCoach: tier === 'Pro' || tier === 'Enterprise',
    advancedAnalytics: tier === 'Enterprise',
    whiteLabel: tier === 'Enterprise',
    multiUser: tier !== 'Free'
  };

  const limits = {
    leads: tier === 'Free' ? 50 : tier === 'Pro' ? 1000 : Infinity,
    deals: tier === 'Free' ? 10 : tier === 'Pro' ? 200 : Infinity,
    aiTokens: tier === 'Free' ? 100 : tier === 'Pro' ? 5000 : Infinity
  };

  return {
    tier,
    isPro: tier === 'Pro' || tier === 'Enterprise',
    isEnterprise: tier === 'Enterprise',
    canAccess: (feature) => features[feature],
    getLimit: (limit) => limits[limit]
  };
}
