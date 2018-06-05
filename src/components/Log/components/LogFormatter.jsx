import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';

const colorMapper = {
  error: '$md-red-400',
  warn: '$md-yellow-400',
  trace: '$md-orange-400',
  info: '$md-green-400',
};

const Span = styled.span`
  ${props => props.match && css`
    color: ${props.theme.colors[`${colorMapper[props.match]}`]} !important;
 `}
`;

const caseIM = (string, predicate) => string.match(new RegExp(`${predicate}`, 'i'));

const format = (string) => {
  if (typeof string === 'object') return JSON.stringify(string);

  if (caseIM(string, ' error ')
    || caseIM(string, 'error: ')
    || caseIM(string, ' exception ')
    || caseIM(string, 'exception: ')) {
    return <Span match="error">{string}</Span>;
  }

  if (caseIM(string, ' warning ')
    || caseIM(string, 'warning: ')
    || caseIM(string, 'warn: ')
    || caseIM(string, ' debug ')
    || caseIM(string, 'debug: ')) {
    return <Span match="warn">{string}</Span>;
  }

  if (caseIM(string, ' trace ')
    || caseIM(string, 'trace: ')) {
    return <Span match="trace">{string}</Span>;
  }

  if (caseIM(string, 'info: ')) {
    return <Span match="info">{string}</Span>;
  }

  return <span>{string}</span>;
};

const LogFormatter = ({ item }) => format(item);

LogFormatter.propTypes = {
  item: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

LogFormatter.defaulProps = {
  item: '',
};

export default withTheme(LogFormatter);
