"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAffiliateNetworkStage = void 0;
/**
 * Find Affiliate Network Stage
 */
class FindAffiliateNetworkStage {
    /**
     * Process the pipeline payload
     */
    process(payload, _logEntry) {
        const offer = payload.getOffer();
        // Skip if no offer
        if (!offer) {
            return payload;
        }
        // Get affiliate network
        const affiliateNetworkId = offer.getAffiliateNetworkId();
        if (!affiliateNetworkId) {
            return payload;
        }
        const network = this._findAffiliateNetwork(affiliateNetworkId);
        if (!network) {
            return payload;
        }
        // Add offer parameter to URL
        const offerParam = network.get('offer_param');
        if (offerParam) {
            const actionPayload = payload.getActionPayload();
            if (typeof actionPayload === 'string') {
                const newPayload = this._addParameterToUrl(actionPayload, offerParam);
                payload.setActionPayload(newPayload);
            }
        }
        // Set affiliate network ID on click
        const rawClick = payload.getRawClick();
        if (rawClick) {
            rawClick.setAffiliateNetworkId(network.getId());
        }
        return payload;
    }
    /**
     * Add parameter to URL
     */
    _addParameterToUrl(url, param) {
        if (!url)
            return url;
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}${param}`;
    }
    /**
     * Find affiliate network by ID
     * @artifact ARTIFACT-032: Placeholder - needs repository
     */
    _findAffiliateNetwork(_id) {
        // TODO: Implement affiliate network repository
        return null;
    }
}
exports.FindAffiliateNetworkStage = FindAffiliateNetworkStage;
//# sourceMappingURL=find-affiliate-network-stage.js.map