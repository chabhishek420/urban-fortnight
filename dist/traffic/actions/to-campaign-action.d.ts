/**
 * To Campaign Action
 *
 * Redirects to another campaign.
 *
 * @see keitaro_source/application/Traffic/Actions/Predefined/ToCampaign.php
 */
import { AbstractAction, ActionType, ActionField } from './abstract-action';
export declare class ToCampaignAction extends AbstractAction {
    protected _weight: number;
    constructor();
    getType(): ActionType;
    getField(): ActionField;
    execute(): void;
}
//# sourceMappingURL=to-campaign-action.d.ts.map