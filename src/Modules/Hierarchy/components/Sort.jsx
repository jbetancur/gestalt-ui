import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Div from 'components/Div';
import { SelectField, FontIcon } from 'react-md';
import { Button } from 'components/Buttons';

const SortOrderButton = styled(Button)`
  margin: 0;
  margin-top: 0.2em;
`;

const SortOrderIcon = styled(FontIcon)`
  transform: ${props => (props.order === 'asc' ? 'scaleY(1)' : 'scaleY(-1)')};
`;

const SortList = styled(SelectField)`
  display: inline-block;
  width: 130px;
  margin-left: 10px;
`;

const sortItems = Object.freeze([
  { name: 'name', value: 'description' },
  { name: 'short-name', value: 'name' },
  { name: 'owner', value: 'owner.name' },
  { name: 'created', value: 'created.timestamp' },
  { name: 'modified', value: 'modified.timestamp' }
]);

const generateSortList = (isEnvironment) => {
  const ofSorts = sortItems.slice();
  if (isEnvironment) {
    ofSorts.push({ name: 'environment type', value: 'properties.environment_type' });
  } else {
    ofSorts.splice(1, 0, { name: 'type', value: 'resource_type' });
  }

  return ofSorts;
};

const Sort = ({ isEnvironment, disabled, setKey, sortKey, order, setOrder }) => {
  const handleSort = () => {
    const orderValue = order === 'asc' ? 'desc' : 'asc';
    setOrder(orderValue);
  };

  return (
    <Div disabled={disabled}>
      <SortList
        id="sort--key"
        menuItems={generateSortList(isEnvironment)}
        itemLabel="name"
        itemValue="value"
        defaultValue={sortKey}
        onChange={setKey}
        fullWidth
      />
      <SortOrderButton
        icon
        tooltipLabel={order === 'asc' ? 'ascending' : 'descending'}
        tooltipPosition="right"
        onClick={handleSort}
      >
        <SortOrderIcon order={order}>arrow_upward</SortOrderIcon>
      </SortOrderButton>
    </Div>
  );
};

Sort.propTypes = {
  disabled: PropTypes.bool,
  sortKey: PropTypes.string.isRequired,
  order: PropTypes.string.isRequired,
  setKey: PropTypes.func.isRequired,
  setOrder: PropTypes.func.isRequired,
  isEnvironment: PropTypes.bool,
};

Sort.defaultProps = {
  disabled: true,
  isEnvironment: false,
};

export default Sort;
