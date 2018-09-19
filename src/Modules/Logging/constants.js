export const PREFIX = 'metaResource/';

/**
 * Logs
 */
export const FETCH_LOGPROVIDER_REQUEST = `${PREFIX}FETCH_LOGPROVIDER_REQUEST`;
export const FETCH_LOGPROVIDER_FULFILLED = `${PREFIX}FETCH_LOGPROVIDER_FULFILLED`;
export const FETCH_LOGPROVIDER_REJECTED = `${PREFIX}FETCH_LOGPROVIDER_REJECTED`;
export const UNLOAD_LOGPROVIDER = `${PREFIX}UNLOAD_LOGPROVIDER`;

export const timeSpans = [
  {
    name: 'Show All',
    value: 'all',
  },
  {
    name: 'Last 5 Minutes',
    value: '5m',
  },
  {
    name: 'Last 15 Minutes',
    value: '15m',
  },
  {
    name: 'Last Hour',
    value: '1h',
  },
  {
    name: ' Last 2 Hours',
    value: '2h',
  },
  {
    name: 'Last Day',
    value: '1d',
  },
];
