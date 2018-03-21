import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import { Caption } from 'components/Typography';

const Timestamp = ({ timestamp }) => (
  timestamp ?
    <div>
      <div>
        <FormattedRelative value={timestamp} />
      </div>
      <Caption>
        <FormattedDate value={timestamp} /> <FormattedTime value={timestamp} />
      </Caption>
    </div> : null
);

Timestamp.propTypes = {
  timestamp: PropTypes.string,
};

Timestamp.defaultProps = {
  timestamp: '',
};

export default Timestamp;
