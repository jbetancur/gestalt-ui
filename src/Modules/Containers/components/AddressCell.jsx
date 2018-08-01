import React from 'react';
import PropTypes from 'prop-types';
import { A } from 'components/Links';

const AddressCell = ({ address }) => {
  const href = `${address.protocol}://${address.host}:${address.port}`;

  return Object.keys(address).length > 0 && !href.includes('undefined')
    && (
      <A
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        primary
      >
        {href}
      </A>
    );
};

AddressCell.propTypes = {
  address: PropTypes.shape({
    protocol: PropTypes.string,
    host: PropTypes.string,
    port: PropTypes.number,
  }),
};

AddressCell.defaultProps = {
  address: {},
};

export default AddressCell;
