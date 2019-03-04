import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ClipboardButton } from 'components/Buttons';
import { A } from 'components/Links';
import { removeHostFromURL } from 'util/helpers/strings';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ALink = styled(A)`
  display: inline-block;
  max-width: 250px;
  font-size: 11px;
  line-height: 14px;
  height: 18px;
  padding: 2px;

  div {
    max-width: 240px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const Endpoints = ({ endpoints }) => (
  endpoints.map(endpoint => (
    <Wrapper key={endpoint.id}>
      <ClipboardButton
        showLabel={false}
        text={endpoint.properties.public_url}
        table
      />
      <ALink href={endpoint.properties.public_url} target="_blank" rel="noopener noreferrer" primary>
        <div>{removeHostFromURL(endpoint.properties.public_url)}</div>
      </ALink>
    </Wrapper>
  ))
);

Endpoints.propTypes = {
  endpoints: PropTypes.array,
};

Endpoints.defaultProps = {
  endpoints: [],
};

export default Endpoints;
