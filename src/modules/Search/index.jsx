import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withMetaResource } from 'modules/MetaResource';
import { debounce } from 'lodash';
import { isEmail } from 'validator';
import Autocomplete from 'react-md/lib/Autocompletes';

class Search extends PureComponent {
  static propTypes = {
    searchResults: PropTypes.array.isRequired,
    doSearch: PropTypes.func.isRequired,
    unloadSearch: PropTypes.func.isRequired,
    onResult: PropTypes.func.isRequired,
    fqon: PropTypes.string.isRequired,
    entity: PropTypes.string.isRequired,
    searchLabel: PropTypes.string,
    clearOnAutocomplete: PropTypes.bool,
    helpText: PropTypes.string,
    allowEmail: PropTypes.bool,
  };

  static defaultProps = {
    clearOnAutocomplete: true,
    searchLabel: 'Search',
    helpText: '',
    allowEmail: false,
  };

  componentWillMount() {
    this.handleSearch = debounce(this.handleSearch, 300);
  }

  componentWillUnmount() {
    this.props.unloadSearch();
  }

  handleSearch = (value) => {
    const { fqon, entity, doSearch, allowEmail } = this.props;

    if (value) {
      const field = (allowEmail && isEmail(value)) ? 'email' : 'name';

      doSearch(fqon, entity, value, field);
    }
  }

  handleOnResult = (value, index, matches) => {
    const item = matches[index];

    this.props.onResult(value, item);
  }

  render() {
    const { searchResults, clearOnAutocomplete, searchLabel, helpText } = this.props;

    return (
      <Autocomplete
        id="search-dropdown"
        data={searchResults}
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


export default withMetaResource(Search);
