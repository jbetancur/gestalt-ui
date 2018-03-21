import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'components/Buttons';
import A from 'components/A';

const CopyLink = styled(Button)`
  height: 18px;
  width: 18px;
  padding: 1px;

  i {
    font-size: 16px!important;
  }

  &:hover {
    background: none!important;
  }
`;

const ALink = styled(A)`
  display: inline-block;
  max-width: 150px;
  font-size: 11px;
  line-height: 20px;
  height: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 2px 0 2px 2px;
`;

const Endpoints = ({ endpoints }) => (
  endpoints.map(endpoint => (
    <div key={endpoint.id}>
      <CopyToClipboard
        text={endpoint.properties.public_url}
      >
        <CopyLink icon>content_copy</CopyLink>
      </CopyToClipboard>
      <ALink href={endpoint.properties.public_url} target="_blank" rel="noopener noreferrer">
        <span>{endpoint.properties.resource}</span>
      </ALink>
    </div>
  ))
);

Endpoints.propTypes = {
  endpoints: PropTypes.array,
};

Endpoints.defaultProps = {
  endpoints: [],
};

export default Endpoints;
