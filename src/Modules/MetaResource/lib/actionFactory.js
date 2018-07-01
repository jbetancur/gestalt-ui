import { PREFIX } from '../actionTypes';

/**
 *
 * @param {Array} verbs
 * @param {String} name
 */
export const createRequestAction = (verbs, name, defaults = {}) => {
  const actions = {};

  const unloadFuncName = `unload${name}`;
  Object.assign(actions, {
    [unloadFuncName]() {
      return { type: `${PREFIX}UNLOAD_${name.toUpperCase()}` };
    }
  });

  verbs.forEach((verb) => {
    const funcName = `${verb}${name}`;

    Object.assign(actions, {
      [funcName]({ ...args }) {
        return { type: `${PREFIX}${verb.toUpperCase()}_${name.toUpperCase()}_REQUEST`, ...args, ...defaults };
      }
    });
  });

  return actions;
};
