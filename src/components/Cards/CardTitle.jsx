import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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
  title: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  subTitle: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
};

CardTitle.defaultProps = {
  children: null,
  title: null,
  subTitle: null,
};

export default CardTitle;
