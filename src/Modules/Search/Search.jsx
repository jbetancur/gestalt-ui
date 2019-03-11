import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import AutoComplete from 'components/Fields/AutoComplete';
import withSearch from './hocs/withSearch';

class Search extends PureComponent {
  static propTypes = {
    userSearchResults: PropTypes.array.isRequired,
    assetSearchResults: PropTypes.array.isRequired,
    userSearchPending: PropTypes.bool.isRequired,
    assetSearchPending: PropTypes.bool.isRequired,
    searchActions: PropTypes.object.isRequired,
    onResult: PropTypes.func.isRequired,
    searchLabel: PropTypes.string,
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

  handleOnResult = (value) => {
    const { userSearch, userSearchResults, assetSearchResults } = this.props;
    const results = userSearch ? userSearchResults : assetSearchResults;

    this.props.onResult(results.find(r => r.id === value.value));
  }

  render() {
    const { userSearch, userSearchResults, assetSearchResults, userSearchPending, assetSearchPending, searchLabel, helpText } = this.props;

    return (
      <AutoComplete
        id="search-dropdown"
        label={searchLabel}
        data={userSearch ? userSearchResults : assetSearchResults}
        dataLabel="name"
        dataValue="id"
        placeholder={searchLabel}
        onSelected={this.handleOnResult}
        onInputChange={this.handleSearch}
        helpText={helpText}
        openMenuOnClick={false}
        noOptionsMessage={() => 'no results found'}
        isLoading={userSearch ? userSearchPending : assetSearchPending}
      />
    );
  }
}

export default withSearch()(Search);
