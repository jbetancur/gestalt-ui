export default () => {
  const timers = {};

  const middleware = () => next => (action) => {
    const { meta: { debounce = {} } = {}, type } = action;

    const {
      time,
      key = type,
      cancel = false,
      leading = false,
      trailing = true
    } = debounce;

    const shouldDebounce =
      ((time && key) || (cancel && key)) && (trailing || leading);
    const dispatchNow = leading && !timers[key];

    if (!shouldDebounce) {
      return next(action);
    }

    const later = resolve => () => {
      if (trailing && !dispatchNow) {
        resolve(next(action));
      }
      timers[key] = null;
    };

    if (timers[key]) {
      clearTimeout(timers[key]);
      timers[key] = null;
    }

    if (!cancel) {
      return new Promise((resolve) => {
        if (dispatchNow) {
          resolve(next(action));
        }
        timers[key] = setTimeout(later(resolve), time);
      });
    }

    return next(action);
  };

  // eslint-disable-next-line no-underscore-dangle
  middleware._timers = timers;

  return middleware;
};
