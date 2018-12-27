import React from 'react';
import styled from 'styled-components';
import LinearProgress from '@material-ui/core/LinearProgress';

const LinearProgressStyled = styled(LinearProgress)`
  flex-grow: 1;
  padding: 0;
  margin: 0;
  position: absolute;
`;

export default props => <LinearProgressStyled {...props} />;
