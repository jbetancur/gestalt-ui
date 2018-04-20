import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

const Wrapper = styled.div`
  padding-top: 8px;
  padding-left: 16px;
  padding-right: 16px;
  word-break: break-all;
  max-width: 285px;
`;

const Title = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 16px;
  color: ${props => props.theme.colors['$md-grey-800']};
`;

const Subtitle = styled.div`
  font-size: 15px;
  color: ${props => props.theme.colors['$md-grey-700']};
`;

const CardTitle = ({ title, subTitle, children }) => (
  <Wrapper>
    {!children ?
      <div>
        <Title>{title}</Title>
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
