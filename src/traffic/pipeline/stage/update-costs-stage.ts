/**
 * Update Costs Stage
 *
 * Calculates and updates click costs based on campaign settings.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/UpdateCostsStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';
import { CostType } from '../../model/campaign';

/**
 * Update Costs Stage
 */
export class UpdateCostsStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    const campaign = payload.getCampaign();
    const rawClick = payload.getRawClick();

    if (!campaign) {
      throw new StageException('No campaign', 'UpdateCostsStage');
    }

    if (!rawClick) {
      throw new StageException('No rawClick', 'UpdateCostsStage');
    }

    let cost: number;
    let currency: string | undefined;

    if (campaign.isCostAuto()) {
      // Use cost from click data
      cost = this._parseCost(rawClick.get('cost'));
      cost = this._patchMegapush(cost);
      currency = rawClick.get('currency') as string | undefined;
    } else {
      // Use campaign cost settings
      cost = campaign.getCostValue();
      currency = campaign.getCostCurrency();
    }

    // Reset cost
    rawClick.setCost(0);

    // Validate cost
    if (cost && !this._isValidCost(cost)) {
      logEntry.add(`Incorrect cost received - ${cost}`);
      return payload;
    }

    // Apply traffic loss adjustment
    cost = this._applyTrafficLoss(cost, campaign.getTrafficLoss());

    // Handle different cost types
    const costType = campaign.getCostType();

    if (this._isCPAorCPSorRevShare(costType)) {
      // Cost per action/sale/revshare
      if (campaign.isCostPerUnique()) {
        if (this._isCostPerThousand(costType) && cost) {
          if (!this._isCostPerClick(costType)) {
            rawClick.setCost(cost);
            rawClick.set('currency', currency);
          }
        } else {
          rawClick.setCost(cost / 1000);
          rawClick.set('currency', currency);
        }
        return payload;
      }

      if (rawClick.isUniqueCampaign()) {
        rawClick.setCost(cost);
        rawClick.set('currency', currency);
      }
    }

    return payload;
  }

  /**
   * Parse cost value
   */
  private _parseCost(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(',', '.'));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  /**
   * Patch for Megapush cost format
   */
  private _patchMegapush(cost: number): number {
    // Megapush sends cost as 00XXX format
    const costStr = cost.toString();
    if (/^00[0-9]+/.test(costStr)) {
      return parseFloat(costStr.replace(/^00/, '0.'));
    }
    return cost;
  }

  /**
   * Check if cost is valid
   */
  private _isValidCost(cost: number): boolean {
    return !isNaN(cost) && isFinite(cost);
  }

  /**
   * Apply traffic loss adjustment
   */
  private _applyTrafficLoss(cost: number, trafficLossValue: number): number {
    if (cost && trafficLossValue) {
      return cost / (1 - trafficLossValue / 100);
    }
    return cost;
  }

  /**
   * Check if cost type is CPA, CPS, or RevShare
   */
  private _isCPAorCPSorRevShare(costType: string): boolean {
    return [CostType.CPA, CostType.CPS, CostType.REV_SHARE].includes(costType as any);
  }

  /**
   * Check if cost per thousand
   */
  private _isCostPerThousand(costType: string): boolean {
    return costType === CostType.CPM;
  }

  /**
   * Check if cost per click
   */
  private _isCostPerClick(costType: string): boolean {
    return [CostType.CPC, CostType.CPV].includes(costType as any);
  }
}
