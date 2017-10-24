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
  props.timestamp &&
  <EnhancedTCol>
    <div>
      <FormattedRelative value={props.timestamp} />
    </div>
    <Caption>
      <FormattedDate value={props.timestamp} /> <FormattedTime value={props.timestamp} />
    </Caption>
  </EnhancedTCol>
);

EnhancedTableColumn.propTypes = {
  timestamp: PropTypes.string,
};

EnhancedTableColumn.defaultProps = {
  timestamp: '',
};

export default EnhancedTableColumn;