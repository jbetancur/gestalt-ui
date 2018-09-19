import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withSearch } from 'Modules/MetaResource';
import { debounce } from 'lodash';
import { Autocomplete } from 'react-md';

class Search extends PureComponent {
  static propTypes = {
    userSearchResults: PropTypes.array.isRequired,
    assetSearchResults: PropTypes.array.isRequired,
    searchActions: PropTypes.object.isRequired,
    onResult: PropTypes.func.isRequired,
    searchLabel: PropTypes.string,
    clearOnAutocomplete: PropTypes.bool,
    helpText: PropTypes.string,
    /**
     * entity
     * entity is the resourceType endpoint e.g. users, groups, workspaces, etc...
     */
    entity: PropTypes.string.isRequired,
    /**
     * searchField
     * searchField is only required when userSearch: true
     */
    searchField: PropTypes.string,
    /**
     * userSearch
     * Searching for users is a different deal
     */
    userSearch: PropTypes.bool,
  };

  static defaultProps = {
    clearOnAutocomplete: true,
    searchLabel: 'Search',
    helpText: '',
    searchField: 'username',
    userSearch: false,
  };

  componentWillMount() {
    this.handleSearch = debounce(this.handleSearch, 300);
  }

  handleSearch = (value) => {
    const { userSearch, entity, searchActions, searchField } = this.props;

    if (value) {
      if (userSearch) {
        const searchValue = `*${value}*`;
        searchActions.doSearchUsers({ entity, value: searchValue, field: searchField });
      } else {
        searchActions.doSearchAssets({ entity, value });
      }
    }
  }

  handleOnResult = (value, index, matches) => {
    const item = matches[index];

    this.props.onResult(value, item);
  }

  render() {
    const { userSearch, userSearchResults, assetSearchResults, clearOnAutocomplete, searchLabel, helpText } = this.props;

    return (
      <Autocomplete
        id="search-dropdown"
        data={userSearch ? userSearchResults : assetSearchResults}
        dataLabel="name"
        dataValue="id"
        placeholder={searchLabel}
        clearOnAutocomplete={clearOnAutocomplete}
        onChange={this.handleSearch}
        onAutocomplete={this.handleOnResult}
        filter={null}
        helpText={helpText}
      />
    );
  }
}


export default withSearch()(Search);
