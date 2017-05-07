import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SelectField from 'react-md/lib/SelectFields';
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';

const OuterDiv = styled.div`
  padding-left: 2em;
`;

const IconDiv = styled.div`
  margin-top: 1em;
`;

const SortOrderButton = styled(Button)`
  margin-top: .2em;
`;

const sortItems = [
  { name: 'name', value: 'description' },
  { name: 'short-name', value: 'name' },
  { name: 'owner', value: 'owner.name' },
  { name: 'created', value: 'created.timestamp' },
  { name: 'modified', value: 'modified.timestamp' }
];

const Sort = (props) => {
  const handleSort = (value) => {
    const orderValue = value === 'asc' ? 'desc' : 'asc';
    props.setOrder(orderValue);
  };

  return !!props.visible &&
    <OuterDiv className="flex-row">
      <IconDiv>
        <FontIcon>sort</FontIcon>
      </IconDiv>
      <SelectField
        id="sort--key"
        className="flex-1 flex-xs-9 flex-sm-3"
        menuItems={sortItems}
        itemLabel="name"
        itemValue="value"
        defaultValue={props.sortKey}
        onChange={value => props.setKey(value)}
      />
      <SortOrderButton
        icon
        tooltipLabel={props.order === 'asc' ? 'ascending' : 'descending'}
        tooltipPosition="right"
        onClick={() => handleSort(props.order)}
      >
        {props.order === 'asc' ? 'arrow_upward' : 'arrow_downward'}
      </SortOrderButton>
    </OuterDiv>;
};

Sort.propTypes = {
  visible: PropTypes.bool,
  sortKey: PropTypes.string.isRequired,
  order: PropTypes.string.isRequired,
  setKey: PropTypes.func.isRequired,
  setOrder: PropTypes.func.isRequired,
};

Sort.defaultProps = {
  visible: true,
};

export default Sort;
