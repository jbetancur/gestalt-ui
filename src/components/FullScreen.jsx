import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const FullScreenPortal = styled.div`
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  height: 100vh;
  overflow: scroll;
  padding: 0;
`;

export default ({ children }) => ReactDOM.createPortal(<FullScreenPortal>{children}</FullScreenPortal>, document.body);
