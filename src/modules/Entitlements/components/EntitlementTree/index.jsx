import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import styled from 'styled-components';

const UL = styled.ul`
    list-style-type: none;
    margin-top: .3em;
    margin-bottom: .3em;
    padding-left: 1em;

    .md-selection-control-container {
      height: 1.3em;
    }

    .md-btn--icon {
      height: 1.3em;
      padding: 0;
      width: 1.3em;
    }

    i {
      font-size: 1.3em;
    }
`;

const EntitlementDiv = styled.div`
  height: 24.5em;
  overflow: scroll;
`;

class EntitlementTreeItems extends PureComponent {
  static propTypes = {
    entitlements: PropTypes.array.isRequired,
    setEntitlementToggleStates: PropTypes.func.isRequired,
    selectedIdentity: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  handleChecked(action) {
    this.props.setEntitlementToggleStates(this.props.entitlements, action, !action.toggled);
    this.forceUpdate();
  }

  handleCheckAll(entitlement) {
    // eslint-disable-next-line no-param-reassign
    entitlement.toggled = !entitlement.toggled;
    entitlement.actions.forEach((action) => {
      this.props.setEntitlementToggleStates(this.props.entitlements, action, entitlement.toggled, true);
    });
    this.forceUpdate();
  }

  render() {
    return (
      <div className="flex-row">
        {(this.props.entitlements.length && this.props.selectedIdentity.name) ?
          <fieldset style={{ height: '100%' }}>
            <legend>{`Entitlements for ${this.props.selectedIdentity.name}`}</legend>
            <EntitlementDiv className="flex-row">
              {this.props.entitlements.map(entitlement => (
                <UL key={entitlement.type}>
                  <li key={entitlement.type}>
                    <Checkbox
                      id={entitlement.type}
                      name={entitlement.type}
                      label={entitlement.type}
                      checked={entitlement.toggled}
                      onChange={() => this.handleCheckAll(entitlement)}
                    />
                  </li>
                  <UL>
                    {entitlement.actions.map(action => (
                      <li key={action.key}>
                        <Checkbox
                          id={action.key}
                          name={action.key}
                          label={action.action}
                          checked={action.toggled}
                          onChange={() => this.handleChecked(action)}
                        />
                      </li>
                    ))}
                  </UL>
                </UL>))}
            </EntitlementDiv>
          </fieldset> : null}
      </div>
    );
  }
}

export default EntitlementTreeItems;
