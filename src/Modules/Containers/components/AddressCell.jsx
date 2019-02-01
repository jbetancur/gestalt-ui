import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { A } from 'components/Links';
import { ClipboardButton } from 'components/Buttons';

const Cell = styled.div`
  display: inline-flex;
  flex: 1;
  align-items: center;
`;

const AddressCell = memo(({ address, copyClip }) => {
  const href = `${address.protocol}://${address.host}:${address.port}`;

  if (Object.keys(address).length > 0 && !href.includes('undefined')) {
    return (
      <Cell>
        {copyClip &&
          <ClipboardButton
            showLabel={false}
            text={href}
            tooltipLabel="Copy to clipboard"
          />}
        <A
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          primary
        >
          {href}
        </A>
      </Cell>
    );
  }

  return null;
});

AddressCell.propTypes = {
  address: PropTypes.shape({
    protocol: PropTypes.string,
    host: PropTypes.string,
    port: PropTypes.number,
  }),
  copyClip: PropTypes.bool
};

AddressCell.defaultProps = {
  address: {},
  copyClip: false,
};

export default AddressCell;
