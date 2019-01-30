import { PREFIX } from '../../constants';

/**
 *
 * @param {Array} verbs
 * @param {String} name
 */
export const createRequestAction = (verbs = [], name, defaults = {}, prefix = PREFIX) => {
  const actions = {};

  const unloadFuncName = `unload${name}`;
  Object.assign(actions, {
    [unloadFuncName]({ ...args }) {
      return { type: `${prefix}UNLOAD_${name.toUpperCase()}`, ...args, ...defaults };
    }
  });

  verbs.forEach((verb) => {
    const funcName = `${verb}${name}`;

    Object.assign(actions, {
      [funcName]({ ...args }) {
        return { type: `${prefix}${verb.toUpperCase()}_${name.toUpperCase()}_REQUEST`, ...args, ...defaults };
      }
    });
  });

  return actions;
};
