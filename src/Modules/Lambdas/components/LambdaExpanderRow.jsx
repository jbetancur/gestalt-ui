import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DetailsPane from 'components/DetailsPane';

const DetailsPaneStyle = styled(DetailsPane)`
  padding-top: 8px;
  padding-left: 24px;
`;

const LambdaExpanderRow = ({ data }) => <DetailsPaneStyle model={data} />;

LambdaExpanderRow.propTypes = {
  data: PropTypes.object,
};

LambdaExpanderRow.defaultProps = {
  data: {},
};

export default LambdaExpanderRow;
