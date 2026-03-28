"use strict";
/**
 * Pipeline Stage Factory
 *
 * Creates configured pipeline stages for click processing.
 *
 * @see keitaro_source/application/Traffic/Pipeline/FirstLevel/StageFactory.php
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstLevelStages = getFirstLevelStages;
exports.getSecondLevelStages = getSecondLevelStages;
const check_prefetch_stage_1 = require("./stage/check-prefetch-stage");
const check_param_aliases_stage_1 = require("./stage/check-param-aliases-stage");
const domain_redirect_stage_1 = require("./stage/domain-redirect-stage");
const check_default_campaign_stage_1 = require("./stage/check-default-campaign-stage");
const build_raw_click_stage_1 = require("./stage/build-raw-click-stage");
const generate_token_stage_1 = require("./stage/generate-token-stage");
const find_campaign_stage_1 = require("./stage/find-campaign-stage");
const check_sending_to_another_campaign_stage_1 = require("./stage/check-sending-to-another-campaign-stage");
const choose_stream_stage_1 = require("./stage/choose-stream-stage");
const update_stream_uniqueness_session_stage_1 = require("./stage/update-stream-uniqueness-session-stage");
const update_campaign_uniqueness_session_stage_1 = require("./stage/update-campaign-uniqueness-session-stage");
const save_uniqueness_session_stage_1 = require("./stage/save-uniqueness-session-stage");
const choose_landing_stage_1 = require("./stage/choose-landing-stage");
const choose_offer_stage_1 = require("./stage/choose-offer-stage");
const find_affiliate_network_stage_1 = require("./stage/find-affiliate-network-stage");
const update_costs_stage_1 = require("./stage/update-costs-stage");
const update_payout_stage_1 = require("./stage/update-payout-stage");
const update_raw_click_stage_1 = require("./stage/update-raw-click-stage");
const update_hit_limit_stage_1 = require("./stage/update-hit-limit-stage");
const set_cookie_stage_1 = require("./stage/set-cookie-stage");
const execute_action_stage_1 = require("./stage/execute-action-stage");
const prepare_raw_click_to_store_stage_1 = require("./stage/prepare-raw-click-to-store-stage");
const store_raw_clicks_stage_1 = require("./stage/store-raw-clicks-stage");
/**
 * Get the first level pipeline stages
 *
 * These stages are executed in order for each click request.
 * Order matters - stages depend on data from previous stages.
 */
function getFirstLevelStages() {
    return [
        // 1. Prefetch check
        new check_prefetch_stage_1.CheckPrefetchStage(),
        // 2. Parameter processing
        new check_param_aliases_stage_1.CheckParamAliasesStage(),
        // 3. Domain-level redirects
        new domain_redirect_stage_1.DomainRedirectStage(),
        // 4. Build click data (before campaign search)
        new build_raw_click_stage_1.BuildRawClickStage(),
        new generate_token_stage_1.GenerateTokenStage(),
        // 5. Find campaign
        new find_campaign_stage_1.FindCampaignStage(),
        // 6. Check default campaign (if no campaign found)
        new check_default_campaign_stage_1.CheckDefaultCampaignStage(),
        // 7. Campaign forwarding check
        new check_sending_to_another_campaign_stage_1.CheckSendingToAnotherCampaignStage(),
        // 8. Stream selection
        new choose_stream_stage_1.ChooseStreamStage(),
        // 9. Uniqueness checks
        new update_stream_uniqueness_session_stage_1.UpdateStreamUniquenessSessionStage(),
        new update_campaign_uniqueness_session_stage_1.UpdateCampaignUniquenessSessionStage(),
        new save_uniqueness_session_stage_1.SaveUniquenessSessionStage(),
        // 10. Landing/Offer selection
        new choose_landing_stage_1.ChooseLandingStage(),
        new choose_offer_stage_1.ChooseOfferStage(),
        // 11. Affiliate network
        new find_affiliate_network_stage_1.FindAffiliateNetworkStage(),
        // 12. Cost/Payout
        new update_costs_stage_1.UpdateCostsStage(),
        new update_payout_stage_1.UpdatePayoutStage(),
        // 13. Update click data
        new update_raw_click_stage_1.UpdateRawClickStage(),
        new update_hit_limit_stage_1.UpdateHitLimitStage(),
        // 14. Set tracking cookie
        new set_cookie_stage_1.SetCookieStage(),
        // 15. Execute the action (redirect, iframe, etc.)
        new execute_action_stage_1.ExecuteActionStage(),
        // 16. Store click to database
        new prepare_raw_click_to_store_stage_1.PrepareRawClickToStoreStage(),
        new store_raw_clicks_stage_1.StoreRawClicksStage(),
    ];
}
/**
 * Get second level pipeline stages
 *
 * These stages are used when forwarding to another campaign.
 * They skip initial click building steps.
 */
function getSecondLevelStages() {
    return [
        // Skip domain and click building - already done
        new find_campaign_stage_1.FindCampaignStage(),
        new check_sending_to_another_campaign_stage_1.CheckSendingToAnotherCampaignStage(),
        new choose_stream_stage_1.ChooseStreamStage(),
        new update_stream_uniqueness_session_stage_1.UpdateStreamUniquenessSessionStage(),
        new update_campaign_uniqueness_session_stage_1.UpdateCampaignUniquenessSessionStage(),
        new save_uniqueness_session_stage_1.SaveUniquenessSessionStage(),
        new choose_landing_stage_1.ChooseLandingStage(),
        new choose_offer_stage_1.ChooseOfferStage(),
        new find_affiliate_network_stage_1.FindAffiliateNetworkStage(),
        new update_costs_stage_1.UpdateCostsStage(),
        new update_payout_stage_1.UpdatePayoutStage(),
        new update_raw_click_stage_1.UpdateRawClickStage(),
        new update_hit_limit_stage_1.UpdateHitLimitStage(),
        new set_cookie_stage_1.SetCookieStage(),
        new execute_action_stage_1.ExecuteActionStage(),
        new prepare_raw_click_to_store_stage_1.PrepareRawClickToStoreStage(),
        new store_raw_clicks_stage_1.StoreRawClicksStage(),
    ];
}
//# sourceMappingURL=stages.js.map