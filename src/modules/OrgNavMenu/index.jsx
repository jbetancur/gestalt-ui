import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import styled from 'styled-components';
import TextField from 'react-md/lib/TextFields';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import * as actions from './actions';

const EnhancedMenuButton = styled(MenuButton)`
  height: 100%;
  margin-left: .5em;
  font-size: 12px;

  .md-icon-text:last-child {
    padding: 1px;
  }
`;


class OrgNavMenu extends Component {
  static propTypes = {
    fetchAllOrgs: PropTypes.func.isRequired,
    filterOrgs: PropTypes.func.isRequired,
    organizations: PropTypes.array.isRequired,
    orgFetching: PropTypes.bool.isRequired,
    onUnload: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      menuName: ''
    };
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  setMenuName(menuName) {
    this.setState({ menuName });
  }

  filterOrgs(value) {
    this.props.filterOrgs(value);
  }

  fetchOrgList(e) {
    e.preventDefault();
    this.props.filterOrgs('');
    this.props.fetchAllOrgs();
  }

  renderOrgMenuItems(item) {
    return (
      <ListItem
        key={item.id}
        value={item.properties.fqon}
        component={Link}
        primaryText={item.description || item.name}
        secondaryText={item.name}
        to={`/${item.properties.fqon}/organizations`}
        onClick={() => this.setMenuName(item.name)}
      />
    );
  }

  renderSearch() {
    const { orgFetching } = this.props;

    return (
      <div>
        <div style={{ padding: '1em', color: 'black' }}>
          {!orgFetching ?
            <div>
              <TextField
                id="search-orgs"
                label="Search"
                fullWidth={true}
                onChange={value => this.filterOrgs(value)}
              />
            </div> : null}
        </div>
        <div style={{ textAlign: 'center' }}>
          {orgFetching ? <CircularProgress id="orgs-nav-menu" /> : null}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <EnhancedMenuButton
          id="orgs-menu"
          label="Switch Organization"
          flat
          fullWidth
          position="below"
          buttonChildren="expand_more"
          onClick={e => this.fetchOrgList(e)}
        >
          {/* https://github.com/mlaursen/react-md/issues/259 */}
          {[<div key="orgs-nav-menu">
            {this.renderSearch()}
            {this.props.organizations.map(this.renderOrgMenuItems, this)}
          </div>]}
        </EnhancedMenuButton>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { orgnavmenu } = state;
  return {
    organizations: orgnavmenu.organizations.organizations.filter(val => val.name.includes(orgnavmenu.filter.filterText) || (val.description && val.description.includes(orgnavmenu.filter.filterText))),
    orgFetching: orgnavmenu.organizations.pending,
  };
};

export default connect(mapStateToProps, actions)(OrgNavMenu);
