import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { truncate } from 'util/helpers/strings';

const Wrapper = styled.div`
  word-break: break-all;
  width: 80%;
`;

const Title = styled.div`
  padding-top: 8px;
  padding-left: 24px;
  padding-right: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  font-size: 15px;
  color: ${props => props.theme.colors['$md-grey-800']};
`;

const Subtitle = styled.div`
  padding-left: 8px;
  padding-left: 24px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-word;
  color: ${props => props.theme.colors['$md-grey-500']};
`;

const CardTitle = ({ title, subTitle, children }) => (
  <Wrapper>
    {!children ?
      <div>
        <Title>{truncate(title, 50)}</Title>
        <Subtitle>{subTitle}</Subtitle>
      </div>
      : children}
  </Wrapper>
);

CardTitle.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  title: PropTypes.string,
  subTitle: PropTypes.string,
};

CardTitle.defaultProps = {
  children: null,
  title: '',
  subTitle: '',
};

export default withTheme(CardTitle);
