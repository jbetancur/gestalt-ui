import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MenuButton from 'components/Menus/MenuButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DateIcon from '@material-ui/icons/DateRange';
import { FormattedRelative } from 'react-intl';
import { Card } from 'components/Cards';
import { FavoriteCheckbox } from 'Modules/UserProfile';
import CardTitle from './GFCardTitle';

const CardStyle = styled(Card)`
  display: flex;
  min-height: 115px;
`;

const Type = styled.div`
  position: absolute;

  /* fixes chrome issue where on zoom in where there is a gap in the logo */
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-top: 35px solid ${props => props.cardColor};
  border-right: 35px solid transparent;

  i,
  svg {
    position: absolute;
    top: -31px;
    left: 3px;
    color: white;
  }
`;

const Content = styled.div`
  position: relative;
  flex: 1;
  cursor: pointer;
  width: calc(100% - 48px);
`;

const Actions = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0 4px 0;
  width: 52px;
`;

const EnvironmentType = styled.div`
  max-width: 180px;
  padding-left: 24px;
  padding-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
  color: ${props => props.theme.colors.font};
  font-size: 12px;

  svg {
    font-size: 16px !important;
    padding-right: 3px;
  }
`;

const Created = styled.div`
  position: absolute;
  left: 8px;
  bottom: 6px;
  line-height: 12px;
  color: ${props => props.theme.colors.fontCaption};

  span {
    font-size: 12px;
  }

  svg {
    font-size: 16px !important;
    padding-right: 3px;
  }
`;

const GFCard = memo(({
  id,
  title,
  subtitle,
  environmentType,
  created,
  cardColor,
  cardIcon,
  menuActions,
  onClick,
  favorited,
  onFavoriteToggled
}) => (
  <CardStyle raise>
    <Content onClick={onClick}>
      <Type
        cardIcon={cardIcon}
        cardColor={cardColor}
      >
        {cardIcon}
      </Type>
      <CardTitle
        title={title}
        subtitle={subtitle}
      />
      {environmentType &&
        <EnvironmentType>
          {environmentType}
        </EnvironmentType>}

      <Created>
        <DateIcon fontSize="small" color="action" />
        <FormattedRelative value={created} />
      </Created>
    </Content>

    <Actions>
      <MenuButton
        id={`${id}--actions`}
        icon={<MoreVertIcon color="primary" fontSize="small" />}
      >
        {menuActions.map(action => (
          <ListItem
            key={action.id}
            onClick={action.onClick}
            dense
            button
          >
            {action.icon}
            <ListItemText primary={action.title} />
          </ListItem>
        ))}
      </MenuButton>
      <FavoriteCheckbox id={id} checked={favorited} onChange={onFavoriteToggled} />
    </Actions>
  </CardStyle>
));

GFCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  environmentType: PropTypes.string,
  created: PropTypes.string.isRequired,
  cardIcon: PropTypes.oneOfType([
    PropTypes.node
  ]),
  cardColor: PropTypes.string,
  menuActions: PropTypes.array,
  onClick: PropTypes.func,
  favorited: PropTypes.bool,
  onFavoriteToggled: PropTypes.func,
};

GFCard.defaultProps = {
  subtitle: '',
  cardIcon: '',
  cardColor: '#b0bec5',
  menuActions: [],
  onClick: () => { },
  environmentType: null,
  favorited: false,
  onFavoriteToggled: () => { },
};

export default GFCard;
