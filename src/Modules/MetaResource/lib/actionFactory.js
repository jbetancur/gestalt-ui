import { PREFIX } from '../actionTypes';

/**
 *
 * @param {Array} verbs
 * @param {String} name
 */
export const createRequestAction = (verbs, name) => {
  const actions = {};

  Object.assign(actions, {
    unload() {
      return { type: `${PREFIX}UNLOAD_${name.toUpperCase()}` };
    }
  });

  verbs.forEach((verb) => {
    const funcName = `${verb}${name}`;

    Object.assign(actions, {
      [funcName]({ ...args }) {
        return { type: `${PREFIX}${verb.toUpperCase()}_${name.toUpperCase()}_REQUEST`, ...args };
      }
    });
  });

  return actions;
};
