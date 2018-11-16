import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button,
  FontIcon,
  AccessibleFakeButton,
  AccessibleFakeInkedButton,
  IconSeparator,
  TextField,
} from 'react-md';
import styled from 'styled-components';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { DotActivity } from 'components/ProgressIndicators';

const IconStyle = styled.div`
  display: flex;
  align-items: center;
`;

const ListContainer = styled.div`
  max-height: 400px;
  overflow: scroll;
`;

const SeperatorStyle = styled(IconSeparator)`
  font-size: 13px;
  color: ${props => props.theme.colors.font};

  a {
    display: block;
    max-width: 250px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    height: 20px;
  }

  &:last-child {
    padding-left: 3px;
    padding-right: 8px;
  }

  a:first-child {
    padding-right: 6px;
  }
`;

const DropDownButton = styled(AccessibleFakeInkedButton)`
  border-radius: 50%;

  i {
    font-size: 24px !important;
  }

  &:hover {
    background: ${props => props.theme.colors.backgroundVariant};
  }
`;

const SearchWrapper = styled.div`
  padding: 12px;
`;

const InlineButton = styled(Button)`
  padding: 0;
  height: 20px;
  max-width: 20px;
`;

const Title = styled.div`
  max-width: 250px;
`;

class BreadCrumbLayoverDropDown extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    menuItems: PropTypes.array,
    title: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    createLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    createRoute: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onOpen: PropTypes.func,
    pending: PropTypes.bool,
  };

  static defaultProps = {
    title: null,
    menuItems: [],
    onOpen: null,
    pending: false,
    createLabel: null,
    createRoute: null,
  };

  state = {
    filterText: '',
    menuItems: this.props.menuItems,
    anchorEl: null,
    open: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.menuItems !== this.props.menuItems) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ menuItems: this.props.menuItems });
    }
  }

  handleOpen = (event) => {
    const { currentTarget } = event;
    const { open } = this.state;
    const { onOpen, menuItems } = this.props;

    if (!open && onOpen) {
      onOpen();
    }

    this.setState(prevState => ({
      filterText: '',
      anchorEl: !prevState.open ? currentTarget : null,
      open: !prevState.open,
      menuItems,
    }));
  };

  handleClose = () => {
    const { menuItems } = this.props;

    this.setState({
      anchorEl: null,
      open: false,
      filterText: '',
      menuItems,
    });
  };

  handleListItemClose(onClick) {
    this.handleClose();

    // fwd the onClick
    if (onClick) {
      onClick();
    }
  }

  onFilterChange = (value) => {
    const { menuItems } = this.props;
    const filterText = value || '';

    this.setState({
      filterText,
      menuItems: menuItems.filter(item => item.name.toLowerCase().includes(filterText.toLowerCase()) || item.secondaryName.toLowerCase().includes(filterText.toLowerCase())),
    });
  }

  clearSearch = () => {
    const { menuItems } = this.props;
    this.setState({
      filterText: '',
      menuItems,
    });
  }

  renderListItems() {
    const { menuItems } = this.state;
    const { id, pending } = this.props;

    if (pending) {
      return (
        <DotActivity
          id={`${id}--loader`}
          size={1.2}
          primary
          centered
        />
      );
    }

    return menuItems.map(({ name, secondaryName, onClick, divider, ...item }) => {
      if (divider) {
        return <Divider />;
      }

      return (
        <ListItem
          id={item.name}
          key={item.id}
          button
          onClick={e => this.handleListItemClose(onClick, e)}
          {...item}
        >
          <ListItemText primary={name} secondary={secondaryName} />
        </ListItem>
      );
    });
  }

  render() {
    const { id, createLabel, createRoute, title, label, icon } = this.props;
    const { open, anchorEl, filterText } = this.state;

    return (
      <React.Fragment>
        <ClickAwayListener onClickAway={this.handleClose}>
          {/* container must be a div vs a Fragment or clickaway will only attach to first node */}
          <div>
            <AccessibleFakeButton
              onClick={this.handleOpen}
              component={IconSeparator}
              iconBefore
              label={
                <SeperatorStyle label={label}>
                  <DropDownButton>
                    <FontIcon>arrow_drop_down</FontIcon>
                  </DropDownButton>
                </SeperatorStyle>
              }
            >
              <IconStyle>{icon}</IconStyle>
            </AccessibleFakeButton>

            <Popper
              id="breadcrumbs-popper"
              open={open}
              anchorEl={anchorEl}
              style={{ zIndex: 100 }}
              disablePortal
              placement="bottom-start"
            >

              <Paper>
                <SearchWrapper key={`${title}--search`}>
                  {title && <Title>{title}</Title>}
                  <TextField
                    id={`filter-${id}-dropdown`}
                    label="Filter"
                    fullWidth={true}
                    onChange={this.onFilterChange}
                    value={filterText}
                    inlineIndicator={<InlineButton onClick={this.clearSearch} icon>close</InlineButton>}
                  />
                </SearchWrapper>

                {createLabel && createRoute &&
                <Button
                  flat
                  iconChildren={<FontIcon>add</FontIcon>}
                  component={Link}
                  to={createRoute}
                  onClick={this.handleClose}
                >
                  {createLabel}
                </Button>}

                <ListContainer>
                  <List>
                    {this.renderListItems()}
                  </List>
                </ListContainer>
              </Paper>
            </Popper>
          </div>
        </ClickAwayListener>
      </React.Fragment>
    );
  }
}

export default BreadCrumbLayoverDropDown;
