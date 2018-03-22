import React from 'react';
import styled from 'styled-components';
import { SelectField } from 'react-md';
import { DotActivity } from 'components/ProgressIndicators';

const Div = styled.div`
  width: 100%;
  height: 3em;
  text-align: center;

  .spinner {
    line-height: 52px;
  }
`;

const ActivityIndicator = () => (
  <Div>
    <DotActivity size={1.2} primary centered />
  </Div>
);

/* eslint-disable react/prop-types */
export default ({ input, required, meta: { touched, error }, menuItems, async, ...others }) => {
  const compileMenuItems = () => (
    menuItems.length ?
      menuItems :
      [{
        id: `${input.name}--pending`,
        component: ActivityIndicator,
        centered: true,
      }]
  );

  return (
    menuItems ?
      <SelectField
        id={input.id}
        error={touched && !!error}
        errorText={error}
        menuItems={async ? compileMenuItems() : menuItems}
        lineDirection="center"
        sameWidth
        fullWidth
        {...input}
        {...others}
      /> :
      <SelectField
        id={input.name}
        error={touched && !!error}
        errorText={error}
        lineDirection="center"
        sameWidth
        fullWidth
        {...input}
        {...others}
      />
  );
};
