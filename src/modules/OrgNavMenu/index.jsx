import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import TextField from 'react-md/lib/TextFields';
import CircularProgress from 'react-md/lib/Progress/CircularProgress';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import * as actions from './actions';

class OrgNavMenu extends Component {
  static propTypes = {
    fetchAllOrgs: PropTypes.func.isRequired,
    filterOrgs: PropTypes.func.isRequired,
    organizations: PropTypes.array.isRequired,
    orgFetching: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      menuName: ''
    };
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
        primaryText={item.name}
        secondaryText={item.properties.fqon}
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
          {
            !orgFetching ?
              <div>
                <TextField
                  id="search-orgs"
                  label="Search"
                  fullWidth={true}
                  onChange={value => this.filterOrgs(value)}
                />
              </div> : null
          }
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
        <MenuButton
          id="orgs-menu"
          label="Organizations"
          flat
          fullWidth
          position="below"
          buttonChildren="domain"
          className="org-nav-menubutton"
          onClick={e => this.fetchOrgList(e)}
        >
          {this.renderSearch()}
          {this.props.organizations.map(this.renderOrgMenuItems, this)}
        </MenuButton>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { orgnavmenu } = state;
  return {
    organizations: orgnavmenu.organizations.items.filter(val => val.name.includes(orgnavmenu.filter.filterText)),
    orgFetching: orgnavmenu.organizations.pending,
  };
};

export default connect(mapStateToProps, actions)(OrgNavMenu);
