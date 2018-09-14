export default (status) => {
  switch (status.toUpperCase()) {
    case 'RUNNING':
      return {
        icon: 'check_circle',
        color: '$md-blue-grey-300',
      };
    case 'HEALTHY':
      return {
        icon: 'check_circle',
        color: '$md-green-a700',
      };
    case 'UNHEALTHY':
      return {
        icon: 'new_releases',
        color: '$md-red-a400',
      };
    case 'SCALING':
      return {
        icon: 'access_time',
        color: '$md-blue-500',
      };
    case 'SUSPENDED':
      return {
        icon: 'info_outline',
        color: '$md-orange-500',
      };
    case 'LOST':
      return {
        icon: 'new_releases',
        color: '$md-red-a400',
      };
    case 'ERROR':
      return {
        icon: 'new_releases',
        color: '$md-red-a400',
      };
    case 'ACTIVE':
      return {
        icon: 'check_circle',
        color: '$md-blue-grey-400',
      };
    case 'FAILED':
      return {
        icon: 'new_releases',
        color: '$md-red-a400',
      };
    case 'PENDING':
      return {
        icon: 'access_time',
        color: '$md-orange-500',
      };
    case 'DELETED':
      return {
        icon: 'clear',
        color: '$md-grey-900',
      };
    case 'DISABLED':
      return {
        icon: 'remove_circle',
        color: '$md-grey-500',
      };
    case 'LAUNCHED':
      return {
        icon: 'help_outline',
        color: '$md-grey-300',
      };
    case 'UNKNOWN':
      return {
        icon: 'help_outline',
        color: '$md-red-a400',
      };
    default:
      return {
        icon: 'info_outline',
        color: '$md-blue-grey-400',
      };
  }
};
