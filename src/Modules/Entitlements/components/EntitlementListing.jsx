import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import styled from 'styled-components';
import { Row, Col } from 'react-flexybox';
import { Search } from 'Modules/Search';
import Fieldset from 'components/Fieldset';
import { Button } from 'components/Buttons';
import { ActivityContainer } from 'components/ProgressIndicators';
import { H3 } from 'components/Typography';
import { UserIcon, GroupIcon } from 'components/Icons';
import Div from 'components/Div';
import SearchFields from './SearchFields';
import EntitlementTree from './EntitlementTree';
import { USER } from '../../../constants';
import withEntitlements from '../hocs/withEntitlements';
import withSearch from '../../Search/hocs/withSearch';
import withSelf from '../../../App/hocs/withSelf';

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 48px;

  button {
    margin: 0 5px;
  }
`;

class EntitlementListing extends PureComponent {
  static propTypes = {
    fqon: PropTypes.string.isRequired,
    entityId: PropTypes.string,
    entityKey: PropTypes.string,
    entitlements: PropTypes.array.isRequired,
    entitlementsPending: PropTypes.bool.isRequired,
    entitlementActions: PropTypes.object.isRequired,
    searchActions: PropTypes.object.isRequired,
    self: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entityId: null,
    entityKey: null,
  };

  state = {
    selectedIdentityId: this.props.self.id,
    selectedIdentityName: this.props.self.name,
    selectedIdentityType: USER,
    selectedSearchFieldName: 'Group',
    selectedSearchFieldValue: 'groups',
  };

  componentDidMount() {
    const { fqon, entitlementActions, entityId, entityKey } = this.props;

    entitlementActions.fetchEntitlements({ fqon, entityId, entityKey, identityId: this.state.selectedIdentityId });
  }

  update = () => {
    const { fqon, entitlementActions, entitlements, entityId, entityKey } = this.props;
    const { selectedIdentityId } = this.state;
    const identityId = selectedIdentityId;
    const compiledActions = entitlements.flatMap(entitlement => entitlement.actions.map(action => action));

    const onSuccess = () => entitlementActions.fetchEntitlements({ fqon, entityId, entityKey, identityId });
    entitlementActions.updateEntitlement({ fqon, identityId, actions: compiledActions, entitlementActions, onSuccess });
  }

  handleSelectedIdentity = (selectedIdentityId, selectedIdentity) => {
    const { fqon, entitlementActions, entityId, entityKey } = this.props;

    this.setState({
      selectedIdentityId,
      selectedIdentityName: selectedIdentity.name,
      selectedIdentityType: selectedIdentity.typeId,
    });

    entitlementActions.fetchEntitlements({ fqon, entityId, entityKey, identityId: selectedIdentityId });
  }

  handleFieldNameChange = (selectedSearchFieldValue) => {
    const { searchActions } = this.props;

    searchActions.unloadSearchUsers();
    this.setState({ selectedSearchFieldValue });
  }

  render() {
    const { entitlements, entitlementsPending, onClose } = this.props;
    const { selectedIdentityId, selectedIdentityType, selectedIdentityName, selectedSearchFieldValue } = this.state;
    const hasEntitlements = entitlements.length > 0;
    const isUserQuery = selectedSearchFieldValue === 'users';
    const searchLabel = isUserQuery ? 'Search username' : 'Search group name';
    const searchField = isUserQuery ? 'username' : 'name';
    const identityTypeIcon = selectedIdentityType === USER
      ? <UserIcon size={24} />
      : <GroupIcon size={24} />;

    return (
      <React.Fragment>
        {hasEntitlements &&
          <Fieldset
            legend="Select Identity"
            legendFontSize="1.3em"
            maxHeight="7em"
            overflow="visible"
            border={false}
          >
            <Row>
              <Col flex={8} xs={12}>
                <Search
                  fqon="root"
                  entity={selectedSearchFieldValue}
                  searchLabel={searchLabel}
                  searchField={searchField}
                  onResult={this.handleSelectedIdentity}
                  helpText="search is case sensitive"
                  userSearch
                />
              </Col>

              <Col flex={4} xs={12}>
                <SearchFields
                  onChange={this.handleFieldNameChange}
                />
              </Col>
            </Row>
          </Fieldset>}

        {selectedIdentityId &&
          <Fieldset
            legend={<span>{identityTypeIcon} {selectedIdentityName}</span>}
            legendFontSize="1.3em"
            height="28em"
            overflow="scroll"
          >
            <div>
              {entitlementsPending &&
                <ActivityContainer
                  primary
                  size={2.5}
                  id="entitlements-loading"
                  centered
                />}

              <Div disabled={entitlementsPending}>
                <EntitlementTree
                  selectedIdentityId={selectedIdentityId}
                  selectedIdentityType={selectedIdentityType}
                  {...this.props}
                />
              </Div>
            </div>


            {!hasEntitlements && !entitlementsPending &&
            <Row center fill>
              <Col flex style={{ textAlign: 'center' }}>
                <H3>You do not have permissions to view these Entitlements</H3>
              </Col>
            </Row>}
          </Fieldset>}

        <Actions>
          <Button
            primary
            raised
            onClick={this.update}
            disabled={entitlementsPending || !entitlements.length}
          >
            Apply Entitlements
          </Button>
          <Button flat onClick={onClose}>Close</Button>
        </Actions>
      </React.Fragment>
    );
  }
}

export default compose(
  withSelf,
  withSearch({ unload: false }),
  withEntitlements(),
)(EntitlementListing);
