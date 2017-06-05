import React from 'react';
import styled from 'styled-components';

const DIV = styled.div`
  height: 100%;
`;

const AppError = () => (
  <DIV className="flex-row">
    <div className="flex-row center-center">
      <div className="flex-8">
        <h1>
          There was an issue connecting to the Gestalt API. If a page refresh does not solve the issue please contact your Gestalt admin.
        </h1>
      </div>
    </div>
  </DIV>
);

export default AppError;
