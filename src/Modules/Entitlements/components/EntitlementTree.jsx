import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import EntitlementCheckbox from './EntitlementCheckbox';
import { setEntitlementToggleStates } from '../entitlementToggleStates';

const UL = styled.ul`
  list-style-type: none;
  margin-bottom: 0;
  padding-left: 1em;

  .md-selection-control-container {
    height: 1.5em;
  }

  .md-btn--icon {
    height: 1.3em;
    padding: 0;
    padding-right: 1.6em;
    width: 1.3em;
  }
`;

const EntitlementItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

class EntitlementTreeItems extends PureComponent {
  static propTypes = {
    entitlements: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
  }

  handleChecked = (action) => {
    setEntitlementToggleStates(this.props.entitlements, action, !action.toggled);
    this.forceUpdate();
  }

  handleCheckAll = (entitlement) => {
    // eslint-disable-next-line no-param-reassign
    entitlement.toggled = !entitlement.toggled;
    entitlement.actions.forEach((action) => {
      setEntitlementToggleStates(this.props.entitlements, action, entitlement.toggled, true);
    });
    this.forceUpdate();
  }

  render() {
    const { entitlements } = this.props;

    return (
      <EntitlementItems>
        {entitlements.map(entitlement => (
          <UL key={entitlement.type}>
            <li key={entitlement.type}>
              <EntitlementCheckbox
                id={entitlement.type}
                name={entitlement.type}
                label={entitlement.type}
                checked={entitlement.toggled}
                model={entitlement}
                onChange={this.handleCheckAll}
              />
            </li>
            <UL>
              {entitlement.actions.map((action, index) => (
                <li key={`${action.key}-${index}`}>
                  <EntitlementCheckbox
                    id={`${action.key}-${index}`}
                    name={action.key}
                    label={action.action}
                    checked={action.toggled}
                    model={action}
                    onChange={this.handleChecked}
                  />
                </li>
              ))}
            </UL>
          </UL>
        ))}
      </EntitlementItems>
    );
  }
}

export default EntitlementTreeItems;
