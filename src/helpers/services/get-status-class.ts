import { ASSET_STATUS } from '../constants/asset-status';

export function getStatusClass(status: string): string {
  if (status === ASSET_STATUS.LIVE || status === ASSET_STATUS.NEWLY_ADDED) {
    return 'bg-status-green border-status-outer-green-3';
  } else if (status === ASSET_STATUS.HOLD) {
    return 'bg-hold border-hold-3';
  } else if (status === ASSET_STATUS.RE_SUBMITTED || status === ASSET_STATUS.GOING_LIVE) {
    return 'bg-re-submitted border-resubmitted-3';
  } else {
    return 'bg-status-red border-status-outer-red-3';
  }
}
