import moment from 'moment';

export const getNow = () => moment();

export const getAgo = (num = 0, unit = 'day') =>
  moment().subtract(num, unit);

export const isRecentWithin = (timestamp, num, unit) =>
  moment(timestamp).isBetween(getAgo(num, unit), getNow());
