/**
 * Check Param Aliases Stage
 *
 * Checks and applies parameter aliases from settings and campaign configuration.
 * This stage runs early but handles the case when campaign is not yet set.
 *
 * @see keitaro_source/application/Traffic/Pipeline/Stage/CheckParamAliasesStage.php
 */
import type { StageInterface, Payload, TrafficLogEntry } from '../../index';

/**
 * Parameter with aliases
 */
const PARAMS_WITH_ALIASES = [
  'se_referrer', 'source', 'keyword', 'se', 'landing_id',
  'creative_id', 'ad_campaign_id', 'external_id', 'cost', 'currency'
];

// Add sub_id_1 through sub_id_30
for (let i = 1; i <= 30; i++) {
  PARAMS_WITH_ALIASES.push(`sub_id_${i}`);
}

// Add extra_param_1 through extra_param_20
for (let i = 1; i <= 20; i++) {
  PARAMS_WITH_ALIASES.push(`extra_param_${i}`);
}

/**
 * Check Param Aliases Stage
 */
export class CheckParamAliasesStage implements StageInterface {
  private _paramsWithAliases = [...PARAMS_WITH_ALIASES];

  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    const campaign = payload.getCampaign();
    const rawClick = payload.getRawClick();
    const request = payload.getServerRequest();

    if (!rawClick) {
      logEntry.add('CheckParamAliasesStage: No rawClick, skipping');
      return payload;
    }

    if (!request) {
      logEntry.add('CheckParamAliasesStage: No request, skipping');
      return payload;
    }

    // Check aliases from settings (always run)
    this._checkAliasesFromSettings(request, rawClick, logEntry);

    // Check aliases from campaign (only if campaign is set)
    if (campaign) {
      this._checkAliasesFromCampaign(request, rawClick, campaign.getParameters(), logEntry);
      this._checkPlaceholderFromCampaign(request, rawClick, campaign.getParameters(), logEntry);
    }

    // Check site alias
    this._checkSiteAlias(request, rawClick);

    return payload;
  }

  /**
   * Check aliases from settings
   */
  private _checkAliasesFromSettings(
    request: { getParam: (n: string) => string | undefined; hasParam: (n: string) => boolean },
    rawClick: { get: (k: string) => unknown; set: (k: string, v: unknown) => void },
    logger: TrafficLogEntry
  ): void {
    for (const paramName of this._paramsWithAliases) {
      const oldValue = request.getParam(paramName);
      if (oldValue === undefined) {
        // Check for aliases
        const aliases = this._getAliasesFor(paramName);
        for (const alias of aliases) {
          if (request.hasParam(alias) && paramName !== alias) {
            logger.add(`Param alias matched ${alias} -> ${paramName}`);
            rawClick.set(paramName, request.getParam(alias));
          }
        }
      } else {
        // Set the param value directly
        rawClick.set(paramName, oldValue);
      }
    }
  }

  /**
   * Check aliases from campaign parameters
   */
  private _checkAliasesFromCampaign(
    request: { hasParam: (n: string) => boolean; getParam: (n: string) => string | undefined },
    rawClick: { get: (k: string) => unknown; set: (k: string, v: unknown) => void },
    parameters: Record<string, unknown> | undefined,
    logger: TrafficLogEntry
  ): void {
    if (!parameters) return;

    for (const [paramName, valueArr] of Object.entries(parameters)) {
      const paramData = valueArr as Record<string, unknown>;
      const alias = (paramData?.name as string) ?? paramName;

      if (request.hasParam(alias) && paramName !== alias) {
        logger.add(`Param alias matched ${alias} -> ${paramName}`);
        rawClick.set(paramName, request.getParam(alias));
      }
    }
  }

  /**
   * Check site alias
   */
  private _checkSiteAlias(
    request: { getParam: (n: string) => string | undefined },
    rawClick: { setSource: (v: string) => void; set: (k: string, v: unknown) => void }
  ): void {
    const site = request.getParam('site');
    if (site) {
      rawClick.setSource(site);
    }
  }

  /**
   * Check placeholders from campaign parameters
   */
  private _checkPlaceholderFromCampaign(
    request: { hasParam: (n: string) => boolean },
    rawClick: { get: (k: string) => unknown; set: (k: string, v: unknown) => void },
    parameters: Record<string, unknown> | undefined,
    logger: TrafficLogEntry
  ): void {
    if (!parameters) return;

    for (const [paramName, valueArr] of Object.entries(parameters)) {
      const paramData = valueArr as Record<string, unknown>;
      if (paramData?.placeholder) {
        const placeholder = paramData.placeholder as string;
        const alias = (paramData?.name as string) ?? paramName;

        if (!request.hasParam(alias) &&
            !request.hasParam(paramName) &&
            !rawClick.get(paramName) &&
            !this._isMacro(placeholder)) {
          logger.add(`No value provided for ${paramName}. Setting value from placeholder -> ${placeholder}`);
          rawClick.set(paramName, placeholder);
        }
      }
    }
  }

  /**
   * Get aliases for a parameter
   */
  private _getAliasesFor(paramName: string): string[] {
    // Common alias mappings
    const aliases: Record<string, string[]> = {
      'keyword': ['kw', 'q', 'key'],
      'source': ['src', 'traffic_source'],
      'se_referrer': ['sereferer', 'se_ref'],
      'se': ['search_engine'],
      'cost': ['cpc', 'cpm'],
      'currency': ['curr']
    };

    return aliases[paramName] ?? [];
  }

  /**
   * Check if value is a macro placeholder
   */
  private _isMacro(value: string): boolean {
    const firstSymbol = value.trim()[0];
    return firstSymbol === '[' || firstSymbol === '{';
  }
}
