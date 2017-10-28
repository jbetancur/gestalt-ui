import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import Label from 'components/Label';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';

const Span = styled.span`
  font-size: 13px;
  color: ${props => props.theme.colors[' $md-grey-800']};
`;

const ResourceProperties = (props) => {
  const { model, isOrganization, isEnvironment } = props;
  const name = model.description || model.name;

  return (
    <div>
      <div><Label>Name: </Label><Span>{name}</Span></div>
      <div><Label>short-name: </Label><Span>{model.name}</Span></div>
      {isOrganization && <div><Label>fqon: </Label><Span>{model.properties.fqon}</Span></div>}
      {model.created.timestamp && <div><Label>Created: </Label><Span><FormattedRelative value={model.created.timestamp} /> (<FormattedDate value={model.created.timestamp} /> <FormattedTime value={model.created.timestamp} />)</Span></div>}
      {model.modified.timestamp && <div><Label>Modified: </Label><Span><FormattedRelative value={model.modified.timestamp} /> (<FormattedDate value={model.modified.timestamp} /> <FormattedTime value={model.modified.timestamp} />)</Span></div>}
      {isEnvironment && <div><Label>Environment Type: </Label><Span>{model.properties.environment_type}</Span></div>}
      {model.owner.name && <div><Label>Owner: </Label><Span>{model.owner.name}</Span></div>}
      <div><Label>UUID: </Label><Span>{model.id}</Span></div>
    </div>
  );
};

ResourceProperties.propTypes = {
  model: PropTypes.object.isRequired,
  isOrganization: PropTypes.bool,
  isEnvironment: PropTypes.bool,
};

ResourceProperties.defaultProps = {
  isOrganization: false,
  isEnvironment: false,
};

export default withTheme(ResourceProperties);
