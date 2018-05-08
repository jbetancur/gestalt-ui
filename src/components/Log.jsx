import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Div from 'components/Div';

const CodeWrapper = styled.div`
  position: relative;
  color: #F1F1F1;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #222;
  clear: left;
  height: 100%;
  width: 100%;
  ${props => props.fullPage && css`
    padding-top: 4.5em;

    @media screen and (max-width: 599px) {
      padding-top: 7.5em
    }
  `};
`;

const Pre = styled.pre`
  font-family: Cousine, monospace;
  position: relative;
  color: #F1F1F1;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #222;
  clear: left;
  counter-reset: line-numbering;
  min-height: 19px;
`;

const LogLine = styled.div`
  position: relative;
  padding: 0 8px 0 43px;
  margin: 0;
  min-height: 19px;
  font-size: 14px;

  &:hover {
    background-color: rgba(220, 220, 220, 0.12);
  }

  span {
    color: #F1F1F1;
    line-height: 19px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

const LogNumber = styled.a`
  color: #666;
  display: inline-block;
  text-align: right;
  min-width: 40px;
  margin-left: -40px;
  text-decoration: none;
  position: absolute;

  &::before {
    user-select: none;
    content: counter(line-numbering);
    counter-increment: line-numbering;
    padding-right: 1em;
  }
`;

const Log = ({ children, fullPage, logItems }) => (
  <CodeWrapper fullPage={fullPage}>
    <Div>
      {children}
      <Pre>
        {logItems.map((log, i) =>
          (<LogLine key={i}>
            <LogNumber />
            <span>{log}</span>
          </LogLine>))}
      </Pre>
    </Div>
  </CodeWrapper>
);

Log.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  fullPage: PropTypes.bool,
  logItems: PropTypes.array,
};

Log.defaultProps = {
  children: null,
  fullPage: false,
  logItems: [],
};

export default Log;
