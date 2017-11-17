import React, { PureComponent } from 'react';
// import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Row, Col } from 'react-flexybox';
// import FontIcon from 'react-md/lib/FontIcons';
import { Checkbox } from 'components/ReduxFormFields';
// import Autocomplete from 'react-md/lib/Autocompletes';
// import List from 'react-md/lib/Lists/List';
// import ListItem from 'react-md/lib/Lists/ListItem';
import Fieldset from 'components/Fieldset';

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
        <Fieldset legend="Authorization">
          <Row gutter={5}>
            <Col flex={12} xs={12}>
              <Field
                id="show-api-endpoints-security"
                component={Checkbox}
                name={this.props.enabledName}
                checked={securityEnabled}
                label="Require Authentication "
                style={{ minWidth: '10em' }}
                helpText="test"
              />
            </Col>
            {/* {securityEnabled &&
            <Col>
              <Col flex={12} sm={6} xs={12}>
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
              </Col>
              <Col flex={12} sm={6} xs={12}>
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
              </Col>
            </div>} */}
          </Row>
        </Fieldset>
      </div>
    );
  }
}
