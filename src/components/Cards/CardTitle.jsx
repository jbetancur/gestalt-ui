import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Title, Subtitle } from 'components/Typography';

const TitleSection = styled.div`
  padding: 16px 16px 8px 16px;
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  padding-right: 8px;
`;

const CardTitle = memo(({ title, icon, subTitle }) => (
  <TitleSection>
    <Icon>{icon}</Icon>
    <Title small bold>{title}</Title>
    <Subtitle>{subTitle}</Subtitle>
  </TitleSection>
));

CardTitle.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
  icon: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  subTitle: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
};

CardTitle.defaultProps = {
  title: null,
  icon: null,
  subTitle: null,
};

export default CardTitle;
