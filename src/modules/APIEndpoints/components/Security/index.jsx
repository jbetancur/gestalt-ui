import React, { PureComponent } from 'react';
// import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
// import FontIcon from 'react-md/lib/FontIcons';
import Checkbox from 'components/Checkbox';
// import Autocomplete from 'react-md/lib/Autocompletes';
// import List from 'react-md/lib/Lists/List';
// import ListItem from 'react-md/lib/Lists/ListItem';

export default class APIEndpointSecurity extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    values: PropTypes.object.isRequired,
    enabledName: PropTypes.string.isRequired,
    // identities: PropTypes.array.isRequired,
    // fetchIdentities: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      items: [],
    };
  }

  // setInput(autocomplete) {
  //   if (autocomplete) {
  //     // eslint-disable-next-line react/no-find-dom-node
  //     this.selectedItem = findDOMNode(autocomplete).querySelector('api-endpoints-security-dropdown');
  //   }
  // }

  removeIdentity(value) {
    const index = this.state.items.indexOf(value);
    this.setState({ items: [...this.state.items.slice(0, index), ...this.state.items.slice(index + 1)] });
  }

  // handleAutoComplete(value) {
  //   if (this.selectedItem) {
  //     this.setState({ items: [...this.state.items, { id: this.selectedItem.id, name: this.selectedItem.name }] });
  //   }
  // }

  render() {
    const { values } = this.props;
    const securityEnabled = values.properties.plugins.gestaltSecurity && values.properties.plugins.gestaltSecurity.enabled;

    return (
      <div className={this.props.className}>
        <fieldset>
          <legend>Authorization</legend>
          <div className="flex-row">
            <Field
              id="show-api-endpoints-security"
              component={Checkbox}
              name={this.props.enabledName}
              checked={securityEnabled}
              label="Require Authentication "
              style={{ minWidth: '10em' }}
              className="flex-12 flex-xs-12"
              helpText="test"
            />

            {/* {securityEnabled &&
            <div>
              <div className="flex-12 flex-sm-6 flex-xs-12">
                <Autocomplete
                  id="api-endpoints-security-dropdown"
                  data={this.props.identities}
                  dataLabel="name"
                  dataValue="id"
                  type="search"
                  label="Whitelist a User/Group"
                  clearOnAutocomplete
                  onClick={() => fetchIdentities('root')}
                  onAutocomplete={value => this.handleAutoComplete(value)}
                  ref={value => this.setInput(value)}
                  helpText="search for a user or group to whitelist"
                />
              </div>
              <div className="flex-12 flex-sm-6 flex-xs-12">
                {this.state.items.length > 0 && <h4>Whitelisted Users/Groups</h4>}
                <List>
                  {this.state.items.map(item => (
                    <ListItem
                      key={item.id}
                      primaryText={item.name}
                      rightIcon={<FontIcon style={{ color: 'red' }}>remove_circle</FontIcon>}
                      onClick={() => this.removeIdentity(item)}
                    />
                  ))}
                </List>
              </div>
            </div>} */}
          </div>
        </fieldset>
      </div>
    );
  }
}
