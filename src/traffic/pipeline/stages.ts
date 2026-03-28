/**
 * Pipeline Stage Factory
 * 
 * Creates configured pipeline stages for click processing.
 * 
 * @see keitaro_source/application/Traffic/Pipeline/FirstLevel/StageFactory.php
 */

import type { StageInterface } from '../../core/pipeline/stage-interface';
import { CheckPrefetchStage } from './stage/check-prefetch-stage';
import { CheckParamAliasesStage } from './stage/check-param-aliases-stage';
import { DomainRedirectStage } from './stage/domain-redirect-stage';
import { CheckDefaultCampaignStage } from './stage/check-default-campaign-stage';
import { BuildRawClickStage } from './stage/build-raw-click-stage';
import { GenerateTokenStage } from './stage/generate-token-stage';
import { FindCampaignStage } from './stage/find-campaign-stage';
import { CheckSendingToAnotherCampaignStage } from './stage/check-sending-to-another-campaign-stage';
import { BotHandlingStage } from './stage/bot-handling-stage';
import { ChooseStreamStage } from './stage/choose-stream-stage';
import { UpdateStreamUniquenessSessionStage } from './stage/update-stream-uniqueness-session-stage';
import { UpdateCampaignUniquenessSessionStage } from './stage/update-campaign-uniqueness-session-stage';
import { SaveUniquenessSessionStage } from './stage/save-uniqueness-session-stage';
import { ChooseLandingStage } from './stage/choose-landing-stage';
import { ChooseOfferStage } from './stage/choose-offer-stage';
import { FindAffiliateNetworkStage } from './stage/find-affiliate-network-stage';
import { UpdateCostsStage } from './stage/update-costs-stage';
import { UpdatePayoutStage } from './stage/update-payout-stage';
import { UpdateRawClickStage } from './stage/update-raw-click-stage';
import { UpdateHitLimitStage } from './stage/update-hit-limit-stage';
import { SetCookieStage } from './stage/set-cookie-stage';
import { ExecuteActionStage } from './stage/execute-action-stage';
import { PrepareRawClickToStoreStage } from './stage/prepare-raw-click-to-store-stage';
import { StoreRawClicksStage } from './stage/store-raw-clicks-stage';

/**
 * Get the first level pipeline stages
 * 
 * These stages are executed in order for each click request.
 * Order matters - stages depend on data from previous stages.
 */
export function getFirstLevelStages(): StageInterface[] {
  return [
    // 1. Prefetch check
    new CheckPrefetchStage(),
    
    // 2. Parameter processing
    new CheckParamAliasesStage(),
    
    // 3. Domain-level redirects
    new DomainRedirectStage(),
    
    // 4. Build click data (before campaign search)
    new BuildRawClickStage(),
    new GenerateTokenStage(),
    
    // 5. Find campaign
    new FindCampaignStage(),
    
    // 6. Check default campaign (if no campaign found)
    new CheckDefaultCampaignStage(),
    
    // 7. Campaign forwarding check
    new CheckSendingToAnotherCampaignStage(),
    
    // 7.5. Bot handling (before stream selection)
    new BotHandlingStage(),
    
    // 8. Stream selection (with filter checking)
    new ChooseStreamStage(),
    
    // 9. Uniqueness checks
    new UpdateStreamUniquenessSessionStage(),
    new UpdateCampaignUniquenessSessionStage(),
    new SaveUniquenessSessionStage(),
    
    // 10. Landing/Offer selection
    new ChooseLandingStage(),
    new ChooseOfferStage(),
    
    // 11. Affiliate network
    new FindAffiliateNetworkStage(),
    
    // 12. Cost/Payout
    new UpdateCostsStage(),
    new UpdatePayoutStage(),
    
    // 13. Update click data
    new UpdateRawClickStage(),
    new UpdateHitLimitStage(),
    
    // 14. Set tracking cookie
    new SetCookieStage(),
    
    // 15. Execute the action (redirect, iframe, etc.)
    new ExecuteActionStage(),
    
    // 16. Store click to database
    new PrepareRawClickToStoreStage(),
    new StoreRawClicksStage(),
  ];
}

/**
 * Get second level pipeline stages
 * 
 * These stages are used when forwarding to another campaign.
 * They skip initial click building steps.
 */
export function getSecondLevelStages(): StageInterface[] {
  return [
    // Skip domain and click building - already done
    new FindCampaignStage(),
    new CheckSendingToAnotherCampaignStage(),
    new BotHandlingStage(),
    new ChooseStreamStage(),
    new UpdateStreamUniquenessSessionStage(),
    new UpdateCampaignUniquenessSessionStage(),
    new SaveUniquenessSessionStage(),
    new ChooseLandingStage(),
    new ChooseOfferStage(),
    new FindAffiliateNetworkStage(),
    new UpdateCostsStage(),
    new UpdatePayoutStage(),
    new UpdateRawClickStage(),
    new UpdateHitLimitStage(),
    new SetCookieStage(),
    new ExecuteActionStage(),
    new PrepareRawClickToStoreStage(),
    new StoreRawClicksStage(),
  ];
}
