import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Title, Subtitle } from 'components/Typography';

const Wrapper = styled.div`
  padding: 16px;
`;

const CardTitle = ({ title, subTitle, children }) => (
  <Wrapper>
    {!children ?
      <div>
        <Title large>{title}</Title>
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
