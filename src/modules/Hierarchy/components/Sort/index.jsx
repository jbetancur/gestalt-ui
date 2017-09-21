import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Col, Row } from 'react-flexybox';
import SelectField from 'react-md/lib/SelectFields';
import FontIcon from 'react-md/lib/FontIcons';
import { Button } from 'components/Buttons';

const SortOrderButton = styled(Button)`
  margin: 0;
  margin-top: .2em;
`;

const SortOrderIcon = styled(FontIcon)`
  transform: ${props => (props.order === 'asc' ? 'scaleY(1)' : 'scaleY(-1)')};
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
  }

  return ofSorts;
};

const Sort = (props) => {
  const handleSort = (value) => {
    const orderValue = value === 'asc' ? 'desc' : 'asc';
    props.setOrder(orderValue);
  };

  return !!props.visible &&
    <Row gutter={5} paddingLeft="1em">
      <Col
        component={SelectField}
        id="sort--key"
        menuItems={generateSortList(props.isEnvironment)}
        itemLabel="name"
        itemValue="value"
        defaultValue={props.sortKey}
        onChange={value => props.setKey(value)}
        flex={1}
        xs={9}
        sm={3}
      />
      <SortOrderButton
        icon
        iconChildren={<SortOrderIcon order={props.order}>arrow_upward</SortOrderIcon>}
        tooltipLabel={props.order === 'asc' ? 'ascending' : 'descending'}
        tooltipPosition="right"
        onClick={() => handleSort(props.order)}
      />
    </Row>;
};

Sort.propTypes = {
  visible: PropTypes.bool,
  sortKey: PropTypes.string.isRequired,
  order: PropTypes.string.isRequired,
  setKey: PropTypes.func.isRequired,
  setOrder: PropTypes.func.isRequired,
  isEnvironment: PropTypes.bool,
};

Sort.defaultProps = {
  visible: true,
  isEnvironment: false,
};

export default Sort;
