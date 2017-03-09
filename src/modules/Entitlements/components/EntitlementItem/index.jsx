import React, { Component, PropTypes } from 'react';
import Card from 'react-md/lib/Cards/Card';
import { CardTitle } from 'components/GFCard';
import styled from 'styled-components';
import FontIcon from 'react-md/lib/FontIcons';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import Breadcrumbs from 'modules/Breadcrumbs';
import Button from 'react-md/lib/Buttons/Button';
import EntitlementTree from '../EntitlementTree';
import { USER } from '../../constants';

const MembersList = styled(List)`
  min-height: 20em;
  box-shadow: none;
  // border: 1px solid #f5f5f5;
`;

class EntitlementItem extends Component {
  static propTypes = {
    fetchEntitlements: PropTypes.func.isRequired,
    fetchIdentities: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    identities: PropTypes.array.isRequired,
    pendingEntitlements: PropTypes.bool.isRequired,
    pendingIdentities: PropTypes.bool.isRequired,
    pendingUpdateEntitlements: PropTypes.bool.isRequired,
    selectedIdentity: PropTypes.object.isRequired,
    entitlements: PropTypes.array.isRequired,
    updateEntitlements: PropTypes.func.isRequired,
    onUnload: PropTypes.func.isRequired,
    self: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { fetchIdentities, self } = this.props;
    // get all users and groups from users base org
    if (self.properties.gestalt_home.properties.fqon) {
      fetchIdentities(self.properties.gestalt_home.properties.fqon);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  update(e) {
    e.stopPropagation();

    const { params, updateEntitlements, entitlements, selectedIdentity } = this.props;
    const entityId = params.workspaceId || params.environmentId || null;
    const entityKey = params.workspaceId ? 'workspaces' : 'environments';

    const actions = [];
    entitlements.forEach((entitlement) => {
      entitlement.actions.forEach((action) => {
        actions.push(action);
      });
    });

    updateEntitlements(params.fqon, selectedIdentity, actions, entityId, entityKey);
  }

  handleSelectedIdentity(identity) {
    const { params, fetchEntitlements } = this.props;
    const entityId = params.workspaceId || params.environmentId || null;
    const entityKey = params.workspaceId ? 'workspaces' : 'environments';

    fetchEntitlements(params.fqon, entityId, entityKey, identity);
  }

  render() {
    const identities = this.props.identities.map(ident =>
      <ListItem
        key={ident.id}
        primaryText={ident.name}
        rightIcon={this.props.selectedIdentity.id === ident.id ? <Button flat primary label="Save" style={{ marginTop: '-.3em' }} onClick={e => this.update(e)} disabled={this.props.pendingEntitlements || this.props.pendingUpdateEntitlements} /> : null}
        leftIcon={<FontIcon>{ident.typeId === USER ? 'person' : 'group'}</FontIcon>}
        active={this.props.selectedIdentity.id === ident.id}
        onClick={() => this.handleSelectedIdentity(ident)}
        inkDisabled
        disabled={this.props.pendingEntitlements || this.props.pendingUpdateEntitlements}
      />);

    return (
      <div className="flex-row">
        <Card className="flex-row flex-12">
          <CardTitle
            title={
              <div>
                <div className="gf-headline">Entitlements</div>
                {this.props.params.workspaceId ? null : <div className="md-caption"><Breadcrumbs /></div>}
              </div>
            }
          />
          <div className="flex-row">
            <div className="flex-6 flex-xs-12">
              {this.props.pendingEntitlements || this.props.pendingUpdateEntitlements ?
                <CircularProgress id="entitlements-loading" centered scale={2} /> :
                <EntitlementTree {...this.props} />}
            </div>
            <div className="flex-6 flex-xs-12">
              <fieldset>
                <legend>Users & Groups</legend>
                <MembersList>
                  {this.props.pendingIdentities ? <CircularProgress id="identities-loading" centered scale={2} /> : identities}
                </MembersList>
              </fieldset>
            </div>
          </div>
        </Card>
      </div>
    );
  }
}

export default EntitlementItem;

