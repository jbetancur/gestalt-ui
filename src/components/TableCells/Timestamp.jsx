import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import { Caption } from 'components/Typography';
import { media } from 'util/helpers/media';

const DateCaption = styled(Caption)`
  ${() => media.xs`
    display: none;
  `};
  ${() => media.sm`
    display: none;
  `};
`;

const Timestamp = ({ timestamp }) => (
  timestamp ?
    <div>
      <div>
        <FormattedRelative value={timestamp} />
      </div>
      <DateCaption>
        <FormattedDate value={timestamp} /> <FormattedTime value={timestamp} />
      </DateCaption>
    </div> : null
);

Timestamp.propTypes = {
  timestamp: PropTypes.string,
};

Timestamp.defaultProps = {
  timestamp: '',
};

export default Timestamp;
