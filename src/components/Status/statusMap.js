import React from 'react';
import CheckCircleOutlintIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import NewReleaseIcon from '@material-ui/icons/NewReleases';
import ClearIcon from '@material-ui/icons/Clear';
import HelpOutline from '@material-ui/icons/HelpOutline';
import Stop from '@material-ui/icons/Stop';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

export default (status) => {
  switch (status.toUpperCase()) {
    case 'RUNNING':
      return {
        icon: <CheckCircleOutlintIcon fontSize="small" />,
        color: '$md-green-a700',
      };
    case 'HEALTHY':
      return {
        icon: <CheckCircleIcon fontSize="small" />,
        color: '$md-green-a700',
      };
    case 'UNHEALTHY':
      return {
        icon: <ErrorIcon fontSize="small" />,
        color: '$md-red-a400',
      };
    case 'SCALING':
      return {
        icon: <AccessTimeIcon fontSize="small" />,
        color: '$md-blue-500',
      };
    case 'SUSPENDED':
      return {
        icon: <InfoIcon fontSize="small" />,
        color: '$md-orange-500',
      };
    case 'LOST':
      return {
        icon: <NewReleaseIcon fontSize="small" />,
        color: '$md-red-a400',
      };
    case 'ERROR':
      return {
        icon: <ErrorIcon fontSize="small" />,
        color: '$md-red-a400',
      };
    case 'ACTIVE':
      return {
        icon: <CheckCircleOutlintIcon fontSize="small" />,
        color: '$md-blue-grey-500',
      };
    case 'FAILED':
      return {
        icon: <NewReleaseIcon fontSize="small" />,
        color: '$md-red-a400',
      };
    case 'PENDING':
      return {
        icon: <AccessTimeIcon fontSize="small" />,
        color: '$md-orange-500',
      };
    case 'DELETED':
      return {
        icon: <ClearIcon fontSize="small" />,
        color: '$md-grey-900',
      };
    case 'DISABLED':
      return {
        icon: <RemoveCircleIcon fontSize="small" />,
        color: '$md-grey-500',
      };
    case 'LAUNCHED':
      return {
        icon: <AccessTimeIcon fontSize="small" />,
        color: '$md-grey-500',
      };
    case 'CORRUPT':
      return {
        icon: <NewReleaseIcon fontSize="small" />,
        color: '$md-red-a400',
      };
    case 'UNKNOWN':
      return {
        icon: <HelpOutline fontSize="small" />,
        color: '$md-red-a400',
      };
    case 'STOPPED':
      return {
        icon: <Stop fontSize="small" />,
        color: '$md-grey-500',
      };
    case 'SUCCESS':
      return {
        icon: <CheckCircleIcon fontSize="small" />,
        color: '$md-green-a700',
      };
    default:
      return {
        icon: <InfoIcon fontSize="small" />,
        color: '$md-blue-grey-500',
      };
  }
};
