import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import { Caption } from 'components/Typography';
import TableColumn from 'react-md/lib/DataTables/TableColumn';

const EnhancedTCol = styled(TableColumn)`
  cursor: pointer;
`;
const EnhancedTableColumn = props => (
  <EnhancedTCol>
    <Caption>
      <FormattedRelative value={props.timestamp} /> <br />
      <FormattedDate value={props.timestamp} /> <FormattedTime value={props.timestamp} />
    </Caption>
  </EnhancedTCol>
);

EnhancedTableColumn.propTypes = {
  timestamp: PropTypes.string.isRequired,
};

export default EnhancedTableColumn;
