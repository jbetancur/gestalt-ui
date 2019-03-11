import React from 'react';
import styled from 'styled-components';
import LinearProgress from '@material-ui/core/LinearProgress';

export default styled(props => (
  <LinearProgress
    {...props}
    classes={{
      bar1Indeterminate: 'bar1Indeterminate',
      bar2Indeterminate: 'bar2Indeterminate',
    }}
  />
))`
  position: absolute;
  top: -4px;
  width: 100%;
  flex-grow: 1;
  height: 4px;

  & .bar1Indeterminate {
  }

  & .bar2Indeterminate {
  }
`;
