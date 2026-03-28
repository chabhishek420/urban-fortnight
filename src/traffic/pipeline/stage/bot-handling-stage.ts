/**
 * Bot Handling Stage
 * 
 * Handles bot traffic by routing to safe pages or blocking.
 * If a visitor is detected as a bot, this stage can override the action
 * based on campaign settings (action_for_bots, bot_redirect_url, bot_text).
 * 
 * This is a key component of the cloaking layer - bots see safe content
 * while real users are directed to the actual offer.
 * 
 * @see keitaro_source/application/Traffic/Model/Campaign.php (actionForBots handling)
 */

import type { StageInterface, Payload, TrafficLogEntry } from '../../index';
import { StageException } from '../../../core/pipeline/stage-interface';

/**
 * Bot action types
 */
const BotAction = {
  STATUS_404: '404',
  SHOW_TEXT: 'show_text',
  HTTP_REDIRECT: 'http_redirect',
  DO_NOTHING: 'do_nothing'
} as const;

/**
 * Bot Handling Stage
 * 
 * Runs after BuildRawClickStage (where bot detection happens) and before
 * ChooseStreamStage. If a bot is detected, it overrides the action to
 * serve safe content instead of real offers.
 */
export class BotHandlingStage implements StageInterface {
  /**
   * Process the pipeline payload
   */
  process(payload: Payload, logEntry: TrafficLogEntry): Payload {
    const rawClick = payload.getRawClick();
    const campaign = payload.getCampaign();

    if (!rawClick) {
      throw new StageException('rawClick is not defined', 'BotHandlingStage');
    }

    // Check if visitor is a bot
    if (!rawClick.isBot()) {
      // Not a bot - continue normal flow
      return payload;
    }

    logEntry.add('Bot detected! Checking campaign action_for_bots');

    // If no campaign, let normal flow handle it (will show 404)
    if (!campaign) {
      logEntry.add('No campaign set, using default bot handling');
      return payload;
    }

    // Get bot action from campaign
    const actionForBots = campaign.getActionForBots();
    logEntry.add(`Campaign action_for_bots: ${actionForBots}`);

    // Handle different bot actions
    switch (actionForBots) {
      case BotAction.STATUS_404:
        return this._handleStatus404(payload, logEntry);
      
      case BotAction.SHOW_TEXT:
        return this._handleShowText(payload, campaign, logEntry);
      
      case BotAction.HTTP_REDIRECT:
        return this._handleRedirect(payload, campaign, logEntry);
      
      case BotAction.DO_NOTHING:
        return this._handleDoNothing(payload, logEntry);
      
      default:
        // Unknown action or empty - default to 404
        if (actionForBots && actionForBots.trim() !== '') {
          // Custom action - set it
          payload.setActionType(actionForBots);
          logEntry.add(`Setting custom bot action: ${actionForBots}`);
        } else {
          return this._handleStatus404(payload, logEntry);
        }
    }

    return payload;
  }

  /**
   * Handle 404 response for bots
   */
  private _handleStatus404(payload: Payload, logEntry: TrafficLogEntry): Payload {
    logEntry.add('Routing bot to 404 Not Found');
    payload.setActionType('status_404');
    return payload;
  }

  /**
   * Handle show text for bots
   */
  private _handleShowText(payload: Payload, campaign: { getBotText: () => string | undefined }, logEntry: TrafficLogEntry): Payload {
    const text = campaign.getBotText() ?? 'Access Denied';
    logEntry.add(`Routing bot to show_text: ${text.substring(0, 50)}...`);
    payload.setActionType('show_text');
    payload.setActionPayload(text);
    return payload;
  }

  /**
   * Handle redirect for bots
   */
  private _handleRedirect(payload: Payload, campaign: { getBotRedirectUrl: () => string | undefined }, logEntry: TrafficLogEntry): Payload {
    const url = campaign.getBotRedirectUrl();
    if (url) {
      logEntry.add(`Redirecting bot to: ${url}`);
      payload.setActionType('http_redirect');
      payload.setActionPayload(url);
    } else {
      // No redirect URL - fallback to 404
      logEntry.add('No bot_redirect_url set, falling back to 404');
      payload.setActionType('status_404');
    }
    return payload;
  }

  /**
   * Handle do nothing for bots
   */
  private _handleDoNothing(payload: Payload, logEntry: TrafficLogEntry): Payload {
    logEntry.add('Bot handling: do_nothing (silent drop)');
    payload.setActionType('do_nothing');
    return payload;
  }
}
