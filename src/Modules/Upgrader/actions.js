import { CLOSE_UPGRADEAVAILBALE } from './constants';

export function closeUpgradeAvailable() {
  return {
    type: CLOSE_UPGRADEAVAILBALE,
  };
}

export default {
  closeUpgradeAvailable,
};
