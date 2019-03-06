import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import { Link } from 'react-router-dom';
import {
  AccessibleFakeButton,
  AccessibleFakeInkedButton,
  IconSeparator,
} from 'react-md';
import { FlatButton, IconButton } from 'components/Buttons';
import TextField from 'components/Fields/TextField';
import styled from 'styled-components';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import DropDownIcon from '@material-ui/icons/ArrowDropDown';
import AddIcon from '@material-ui/icons/Add';
import Divider from 'components/Divider';
import { DotActivity } from 'components/ProgressIndicators';
import { media } from 'util/helpers/media';

const IconStyle = styled.div`
  display: flex;
  align-items: center;
  ${() => media.xs`
    display: none;
  `};
`;

const ListContainer = styled.div`
  max-height: 400px;
  overflow: scroll;
`;

const SeperatorStyle = styled(IconSeparator)`
  font-size: 14px;
  color: ${props => props.theme.colors.font};
  ${() => media.xs`
    font-size: 12px;
  `};
  ${() => media.sm`
    font-size: 12px;
  `};

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
  color: ${props => props.theme.colors.defaultIcon};

  &:hover {
    background: ${props => props.theme.colors.backgroundVariant};
  }
`;

const SearchWrapper = styled.div`
  padding: 12px;
`;

const InlineButton = styled(IconButton)`
  padding: 8px !important;
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
    anchorEl: null,
    open: false,
  };

  filteredItems = memoize((list, filterText) => list.filter(item => item.name.toLowerCase().includes(filterText.toLowerCase()) || item.secondaryName.toLowerCase().includes(filterText.toLowerCase())));

  handleOpen = (event) => {
    const { currentTarget } = event;
    const { open } = this.state;
    const { onOpen } = this.props;

    if (!open && onOpen) {
      onOpen();
    }

    this.setState(prevState => ({
      filterText: '',
      anchorEl: !prevState.open ? currentTarget : null,
      open: !prevState.open,
    }));
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      open: false,
      filterText: '',
    });
  };

  handleListItemClose(onClick) {
    this.handleClose();

    // fwd the onClick
    if (onClick) {
      onClick();
    }
  }

  onFilterChange = ({ target }) => {
    const filterText = target.value || '';

    this.setState({
      filterText,
    });
  }

  clearSearch = () => {
    this.setState({
      filterText: '',
    });
  }

  renderListItems() {
    const { id, pending, menuItems } = this.props;
    const { filterText } = this.state;

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

    return this.filteredItems(menuItems, filterText).map(({ name, secondaryName, onClick, divider, ...item }) => {
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
                  <DropDownIcon />
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
            placement="bottom-start"
            disablePortal // important or will close when clicking
          >
            <Paper>
              <SearchWrapper key={`${title}--search`}>
                {title}
                <TextField
                  id={`filter-${id}-dropdown`}
                  label="Filter"
                  placeholder="Filter"
                  fullWidth
                  onChange={this.onFilterChange}
                  value={filterText}
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <InlineButton icon={<CloseIcon fontSize="small" />} />
                      </InputAdornment>
                    ),
                  }}
                />
              </SearchWrapper>

              {createLabel && createRoute &&
                <FlatButton
                  label={createLabel}
                  icon={<AddIcon />}
                  component={Link}
                  to={createRoute}
                  onClick={this.handleClose}
                />}

              <ListContainer>
                <List>
                  {this.renderListItems()}
                </List>
              </ListContainer>
            </Paper>
          </Popper>
        </div>
      </ClickAwayListener>
    );
  }
}

export default BreadCrumbLayoverDropDown;
