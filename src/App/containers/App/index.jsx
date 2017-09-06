import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import i18next from 'i18next';
import styled from 'styled-components';
import { Row, Col } from 'react-flexybox';
import cn from 'classnames';
import HierarchyRoot from 'modules/Hierarchy';
import { licenseActions } from 'modules/Licensing';
import Toolbar from 'react-md/lib/Toolbars';
import FontIcon from 'react-md/lib/FontIcons';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import Avatar from 'react-md/lib/Avatars';
import Divider from 'react-md/lib/Dividers';
import ActivityContainer from 'components/ActivityContainer';
import OrgNavMenu from 'modules/OrgNavMenu';
import ModalRoot from 'modules/ModalRoot';
import LoginModal from 'modules/Auth/components/LoginModal';
import { GestaltIcon, USEnglishLangIcon } from 'components/Icons';
import { loginActions } from 'modules/Auth';
import { withMetaResource } from 'modules/MetaResource';
import AppError from '../../components/AppError';
import { UI_VERSION, DOCUMENTATION_URL } from '../../../constants';
import actions from '../../actions';

class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    fetchSelf: PropTypes.func.isRequired,
    fetchLicense: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    selfPending: PropTypes.bool.isRequired,
    self: PropTypes.object.isRequired,
    currentOrgContext: PropTypes.object.isRequired,
    currentWorkspaceContext: PropTypes.object.isRequired,
    currentEnvironmentContext: PropTypes.object.isRequired,
    setCurrentOrgContextfromState: PropTypes.func.isRequired,
    activityIndicator: PropTypes.bool.isRequired,
    browser: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    showLicenseModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: {},
  }

  constructor(props) {
    super(props);

    this.state = { drawerVisible: false };
  }

  componentDidMount() {
    const {
      // match,
      fetchSelf,
      // setCurrentOrgContextfromState,
      fetchLicense,
    } = this.props;
    // sets our current logged in users home org
    fetchSelf();
    // Check License Status
    fetchLicense('root');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.self !== this.props.self && !this.props.match.params.fqon) {
      this.props.setCurrentOrgContextfromState(nextProps.self.properties.gestalt_home.properties.fqon);
      this.props.history.replace(`/${nextProps.self.properties.gestalt_home.properties.fqon}/hierarchy`);
    }
  }

  getCurrentOrgContext() {
    const { currentOrgContext, self } = this.props;
    // if we don't have an org context then get it from the user self
    // in the future we can map this to a favorite org
    return currentOrgContext.id ? currentOrgContext : self.properties.gestalt_home;
  }

  logout() {
    const { history, logout } = this.props;

    logout();
    history.replace('/login');
  }

  handleVisibleState(visible) {
    this.setState({ drawerVisible: visible });
  }

  renderActionsMenu() {
    const { self, browser, t } = this.props;

    const renderAvatar = iconSized =>
      <Avatar iconSized={iconSized}>{self.name && self.name.substring(0, 1).toUpperCase()}</Avatar>;

    return [
      <OrgNavMenu {...this.props} />,
      <MenuButton
        id="main-menu"
        flat={browser.greaterThan.xs}
        icon={browser.lessThan.sm}
        label={browser.greaterThan.xs && self.name}
        buttonChildren={browser.lessThan.sm ? 'person' : 'expand_more'}
        position={MenuButton.Positions.TOP_RIGHT}
        iconBefore={false}
      >
        <ListItem
          id="main-menu--profile"
          primaryText={self.name || ''}
          leftAvatar={renderAvatar(true)}
          component={Link}
          to={`/${self.properties.gestalt_home.properties.fqon}/users/${self.id}/edit`}
        />
        <ListItem
          id="main-menu--locale"
          primaryText={t('general.nouns.language')}
          leftIcon={<FontIcon>language</FontIcon>}
          nestedItems={[
            <ListItem
              primaryText="English"
              leftIcon={<USEnglishLangIcon />}
              key={0}
              onClick={() => i18next.changeLanguage('en')}
            />,
          ]}
        />
        <Divider />
        <ListItem
          id="main-menu--logout"
          primaryText={t('auth.logout')}
          leftIcon={<FontIcon>power_settings_new</FontIcon>}
          onClick={() => this.logout()}
        />
      </MenuButton>,
      <MenuButton
        id="info-menu"
        icon
        buttonChildren="info_outline"
        position={MenuButton.Positions.TOP_RIGHT}
        style={{ verticalAlign: 'middle' }}
      >
        <ListItem
          primaryText={`Ui v${UI_VERSION}`}
          leftIcon={<FontIcon>info_outline</FontIcon>}
        />
        <Divider />
        <ListItem
          primaryText={t('documentation.title')}
          leftIcon={<FontIcon>library_books</FontIcon>}
          component={styled.a`text-decoration: none;`}
          href={DOCUMENTATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          inkDisabled
        />
        <ListItem
          primaryText="Licensing"
          leftIcon={<FontIcon>vpn_key</FontIcon>}
          onClick={() => this.props.showLicenseModal()}
        />
      </MenuButton>,
    ];
  }

  renderProgress() {
    return <ActivityContainer id="app-main-progess" />;
  }

  renderAppLogo() {
    const logoClass = cn({
      logo: true,
      'logo-loading': this.props.activityIndicator,
    });

    return (
      this.props.browser.greaterThan.sm &&
        <Row justifyContent="center" alignItems="center" className="logo-container">
          <Col flex className={logoClass}><GestaltIcon /></Col>
        </Row>
    );
  }

  renderMain() {
    return (
      this.props.self.id ?
        <main>
          <Toolbar
            colored
            fixed
            title={this.renderAppLogo()}
            actions={this.renderActionsMenu()}
          />
          <LoginModal />
          <ModalRoot />
          <HierarchyRoot />
        </main> : <AppError {...this.props} />
    );
  }

  render() {
    return this.props.selfPending ? this.renderProgress() : this.renderMain();
  }
}

function mapStateToProps(state) {
  const { app, browser } = state;

  return {
    activityIndicator: app.activityIndicator.activity,
    browser,
  };
}

export default withMetaResource(connect(mapStateToProps, Object.assign({}, actions, licenseActions, loginActions))(translate()(App)));
