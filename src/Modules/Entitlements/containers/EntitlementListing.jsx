import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withMetaResource } from 'Modules/MetaResource';
import { Row, Col } from 'react-flexybox';
import Search from 'Modules/Search';
import Fieldset from 'components/Fieldset';
import { Button } from 'components/Buttons';
import { DotActivity } from 'components/ProgressIndicators';
import { H3 } from 'components/Typography';
import { UserIcon, GroupIcon } from 'components/Icons';
import SearchFields from '../components/SearchFields';
import EntitlementTree from '../components/EntitlementTree';
import actions from './../actions';
import { USER } from '../../../constants';

class EntitlementListing extends PureComponent {
  static propTypes = {
    fqon: PropTypes.string.isRequired,
    entityId: PropTypes.string,
    entityKey: PropTypes.string,
    entitlements: PropTypes.array.isRequired,
    fetchEntitlements: PropTypes.func.isRequired,
    unloadEntitlements: PropTypes.func.isRequired,
    entitlementsPending: PropTypes.bool.isRequired,
    entitlementsUpdatePending: PropTypes.bool.isRequired,
    updateEntitlements: PropTypes.func.isRequired,
    unloadSearch: PropTypes.func.isRequired,
    self: PropTypes.object.isRequired,
  };

  static defaultProps = {
    entityId: null,
    entityKey: null,
  };

  constructor(props) {
    super(props);

    // make self the default identity
    this.state = {
      selectedIdentityId: props.self.id,
      selectedIdentityName: props.self.name,
      selectedIdentityType: USER,
      selectedSearchFieldName: 'Group',
      selectedSearchFieldValue: 'groups',
    };
  }

  componentDidMount() {
    const { fqon, fetchEntitlements, entityId, entityKey } = this.props;

    fetchEntitlements(fqon, entityId, entityKey, this.state.selectedIdentityId);
  }

  componentWillUnmount() {
    this.props.unloadEntitlements();
  }

  update = () => {
    const { fqon, fetchEntitlements, updateEntitlements, entitlements, entityId, entityKey } = this.props;
    const identity = this.state.selectedIdentityId;

    const entitlementActions = [];
    entitlements.forEach((entitlement) => {
      entitlement.actions.forEach((action) => {
        entitlementActions.push(action);
      });
    });

    const onSuccess = () => fetchEntitlements(fqon, entityId, entityKey, identity);
    updateEntitlements(fqon, identity, entitlementActions, entityId, entityKey, onSuccess);
  }

  handleSelectedIdentity = (selectedIdentityId, selectedIdentity) => {
    const { fqon, fetchEntitlements, entityId, entityKey } = this.props;

    this.setState({
      selectedIdentityId,
      selectedIdentityName: selectedIdentity.name,
      selectedIdentityType: selectedIdentity.typeId,
    });

    fetchEntitlements(fqon, entityId, entityKey, selectedIdentityId);
  }

  handleFieldNameChange = (selectedSearchFieldValue) => {
    this.props.unloadSearch();
    this.setState({ selectedSearchFieldValue });
  }

  render() {
    const { entitlements, entitlementsPending, entitlementsUpdatePending } = this.props;
    const isPending = entitlementsPending || entitlementsUpdatePending;
    const showEntitlementTree = entitlements.length > 0 && !isPending;
    const isUserQuery = this.state.selectedSearchFieldValue === 'users';
    const searchLabel = isUserQuery ? 'Search username' : 'Search group name';
    const searchField = isUserQuery ? 'username' : 'name';
    const identityTypeIcon = this.state.selectedIdentityType === USER ? <UserIcon size={24} /> : <GroupIcon size={24} />;

    return (
      <Row>
        <Col flex={12}>
          <Fieldset legend="Select Identity" legendFontSize="1.3em" maxHeight="7em" overflow="visible">
            <Row>
              <Col flex={8} xs={12}>
                <Search
                  fqon="root"
                  entity={this.state.selectedSearchFieldValue}
                  searchLabel={searchLabel}
                  searchField={searchField}
                  onResult={this.handleSelectedIdentity}
                  helpText="search is case sensitive"
                />
              </Col>

              <Col flex={4} xs={12}>
                <SearchFields
                  onChange={this.handleFieldNameChange}
                />
              </Col>
            </Row>
          </Fieldset>
          {this.state.selectedIdentityId &&
            <Fieldset
              legend={<span>{identityTypeIcon} {this.state.selectedIdentityName}</span>}
              legendFontSize="1.3em"
              height="28em"
            >
              {showEntitlementTree &&
                <Row>
                  <EntitlementTree
                    selectedIdentityId={this.state.selectedIdentityId}
                    selectedIdentityType={this.state.selectedIdentityType}
                    {...this.props}
                  />

                  <Row gutter={5} center padding="1em">
                    <Button
                      primary
                      raised
                      onClick={this.update}
                    >
                      Apply Entitlements
                    </Button>
                  </Row>
                </Row>}

              {isPending &&
              <Row center fill>
                <Col flex>
                  <DotActivity
                    primary
                    size={2.5}
                    id="entitlements-loading"
                    centered
                  />
                </Col>
              </Row>}

              {!showEntitlementTree && !isPending &&
              <Row center fill>
                <Col flex style={{ textAlign: 'center' }}>
                  <H3>You do not have permissions to view these Entitlements</H3>
                </Col>
              </Row>}
            </Fieldset>}
        </Col>
      </Row>
    );
  }
}

function mapStateToProps(state) {
  return {
    self: state.metaResource.self.self,
  };
}

export default withMetaResource(connect(mapStateToProps, actions)(EntitlementListing));

