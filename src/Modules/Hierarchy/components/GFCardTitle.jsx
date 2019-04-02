import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  word-break: break-all;
  width: 100%;
`;

const Title = styled.div`
  padding-top: 8px;
  padding-left: 27px;
  padding-right: 8px;
  word-break: normal;
  font-size: 15px;
  color: ${props => props.theme.colors.font};
`;

const Subtitle = styled.div`
  padding-left: 27px;
  padding-right: 8px;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${props => props.theme.colors.fontCaption};
`;

const CardTitle = memo(({ title, subtitle }) => (
  <Wrapper>
    <Title>{title}</Title>
    {!!subtitle && <Subtitle>{subtitle}</Subtitle>}
  </Wrapper>
));

CardTitle.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

CardTitle.defaultProps = {
  title: '',
  subtitle: '',
};

export default CardTitle;
