const PREFIX = 'metaResource/';

/**
 *
 * @param {Array} verbs
 * @param {String} name
 */
export const createRequestAction = (verbs, name, defaults = {}) => {
  const actions = {};

  const unloadFuncName = `unload${name}`;
  Object.assign(actions, {
    [unloadFuncName]({ ...args }) {
      return { type: `${PREFIX}UNLOAD_${name.toUpperCase()}`, ...args, ...defaults };
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
