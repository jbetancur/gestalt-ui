import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontIcon } from 'react-md';
import InputAdornment from '@material-ui/core/InputAdornment';
import SelectField from 'components/Fields/SelectField';
import TextField from 'components/Fields/TextField';
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
`;

const Search = styled(TextField)`
  max-width: 300px;
  margin-left: 10px;
  height: 38px;
`;

const Filter = styled(SelectField)`
  max-width: 150px;
  margin-left: 10px;
  height: 38px;
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

  handleFilter = ({ target }) => {
    this.props.listFilterActions.setFilter(target.value);
  }

  handleFilterText = ({ target }) => {
    this.setState({ searchValue: target.value });
    this.props.listFilterActions.setFilterDebounced('SHOW_ALL', target.value);
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontIcon>search</FontIcon>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <InlineButton onClick={this.clearSearch} icon>close</InlineButton>
              </InputAdornment>
            ),
          }}
          autoFocus
        />
        <Filter
          id="listing-table-filter"
          itemLabel="name"
          itemValue="value"
          menuItems={this.generateItems()}
          onChange={this.handleFilter}
          value={listFilter.filterValue}
          onFocus={this.clearSearchText}
          disabled={disabled}
          autoWidth
        />
      </Wrapper>
    );
  }
}

export default withListFilter(SelectFilter);
