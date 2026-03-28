/**
 * Update Payout Stage
 *
 * Calculates and updates payout for CPC offers.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/UpdatePayoutStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';
import { PayoutType } from '../../model/offer';

/**
 * Update Payout Stage
 */
export class UpdatePayoutStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, _logEntry: TrafficLogEntry): Payload {
    const offer = payload.getOffer();
    const rawClick = payload.getRawClick();

    if (!rawClick) {
      throw new StageException('Empty rawClick', 'UpdatePayoutStage');
    }

    // Check if offer is CPC and payout is not auto
    if (offer && this._isCPC(offer) && !offer.isPayoutAuto()) {
      rawClick.set('is_sale', 1);

      // Exchange currency
      const revenue = this._exchangeCurrency(
        offer.getPayoutValue(),
        offer.getPayoutCurrency(),
        this._getSystemCurrency()
      );

      rawClick.setRevenue(revenue);
      payload.setRawClick(rawClick);
    }

    return payload;
  }

  /**
   * Check if offer is CPC type
   */
  private _isCPC(offer: { getPayoutType(): string | undefined }): boolean {
    return offer.getPayoutType() === PayoutType.CPA || offer.getPayoutType() === 'CPC';
  }

  /**
   * Exchange currency
   * @artifact ARTIFACT-035: Simplified currency exchange
   */
  private _exchangeCurrency(
    value: number,
    _fromCurrency: string | undefined,
    _toCurrency: string | undefined
  ): number {
    // In original: CurrencyService.instance().exchange()
    // For now, return value as-is
    return value;
  }

  /**
   * Get system currency
   * @artifact ARTIFACT-036: Simplified settings access
   */
  private _getSystemCurrency(): string {
    // In original: CachedSettingsRepository.instance().get("currency")
    return 'USD';
  }
}
