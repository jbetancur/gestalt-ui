import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SelectField, TextField, FontIcon } from 'react-md';
import { Button } from 'components/Buttons';
import { media } from 'util/helpers/media';
import withListFilter from './withListFilter';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  ${() => media.xs`
    display: none;
  `};
  ${() => media.sm`
    display: none;
  `};
`;

const Search = styled(TextField)`
  max-width: 400px;
  margin-left: 10px;
`;

const Filter = styled(SelectField)`
  width: 130px;
  margin-left: 10px;
`;

const InlineButton = styled(Button)`
  padding: 0;
  height: 20px;
  max-width: 20px;
`;

class SelectFilter extends PureComponent {
  static propTypes = {
    listFilterActions: PropTypes.object.isRequired,
    listFilter: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    menuItems: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
    filterTextPlaceHolder: PropTypes.string,
  };

  static defaultProps = {
    menuItems: [],
    disabled: false,
    filterTextPlaceHolder: 'Filter by name',
  };

  state = { searchValue: '' };

  componentWillUnmount() {
    this.props.listFilterActions.setFilter();
  }

  generateItems() {
    return [
      {
        name: 'Show All', value: 'SHOW_ALL'
      },
      {
        name: 'Owned by Me', value: 'SHOW_SELF'
      },
      {
        name: 'Owned by Others', value: 'SHOW_OTHERS'
      },
      {
        name: 'Created Today', value: 'SHOW_CREATED_TODAY'
      },
      {
        name: 'Modified Today', value: 'SHOW_MODIFIED_TODAY'
      },
    ].concat(this.props.menuItems);
  }

  clearSearch = () => {
    this.setState({ searchValue: '' });
    this.props.listFilterActions.setFilter('SHOW_ALL', '');
  }

  clearSearchText = () => {
    this.setState({ searchValue: '' });
    this.props.listFilterActions.clearFilterText();
  }

  handleFilter = (value) => {
    this.props.listFilterActions.setFilter(value);
  }

  handleFilterText = (searchValue) => {
    this.setState({ searchValue });
    this.props.listFilterActions.setFilterDebounced('SHOW_ALL', searchValue);
  }

  render() {
    const { listFilter, disabled, filterTextPlaceHolder } = this.props;

    return (
      <Wrapper>
        <Search
          id="listing-table-search"
          placeholder={filterTextPlaceHolder}
          onChange={this.handleFilterText}
          value={this.state.searchValue}
          leftIcon={<FontIcon>search</FontIcon>}
          inlineIndicator={<InlineButton onClick={this.clearSearch} icon>close</InlineButton>}
          lineDirection="right"
          autoFocus
        />
        <Filter
          id="listing-table-filter"
          fullWidth
          itemLabel="name"
          itemValue="value"
          menuItems={this.generateItems()}
          onChange={this.handleFilter}
          value={listFilter.filterValue}
          simplifiedMenu={false}
          onFocus={this.clearSearchText}
          disabled={disabled}
        />
      </Wrapper>
    );
  }
}

export default withListFilter(SelectFilter);
