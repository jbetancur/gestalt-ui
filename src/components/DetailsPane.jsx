import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-flexybox';
import styled from 'styled-components';
import { FormattedDate, FormattedTime, FormattedRelative } from 'react-intl';
import Label from 'components/Label';
import { Caption, H5 } from 'components/Typography';
import { StatusBubble } from 'components/Status';
import { ClipboardButton } from 'components/Buttons';
import { getLastFromSplit } from 'util/helpers/strings';

const CopyUUIDButton = styled.div`
  button {
    margin-left: 6px;
    height: 16px;
    width: 15px;
    padding: 1px;
    border-radius: none;

    i {
      font-size: 16px !important;
    }
  }
`;

const Content = styled.div`
  text-align: left;
  padding: 0 8px 0 8px;
`;

const StatusStyle = styled.div`
  display: inline-block;
`;

const DetailPane = ({ model, singleRow }) => {
  const owner = (model.owner && model.owner.name) || (model.owner && model.owner.id);
  const flex = singleRow ? 2 : 4;

  return (
    model.id ?
      <Content>
        <Row gutter={5}>
          <Col flex={flex} xs={6}>
            <StatusStyle>
              <Label>Resource State</Label>
              <StatusBubble status={getLastFromSplit(model.resource_state)} />
            </StatusStyle>
          </Col>

          <Col flex={flex} xs={6}>
            <Label>Resource Type</Label>
            <H5>{model.resource_type}</H5>
          </Col>

          <Col flex={flex} xs={6}>
            <CopyUUIDButton>
              <Label>UUID</Label>
              <ClipboardButton
                showLabel={false}
                text={model.id}
                tooltipLabel="Copy uuid to clipboard"
              />
              <H5>{model.id}</H5>
            </CopyUUIDButton>
          </Col>

          <Col flex={flex} xs={6}>
            <Label>Owner</Label>
            <H5>{owner}</H5>
          </Col>

          <Col flex={flex} xs={6}>
            <Label>Created</Label>
            {model.created.timestamp &&
              <H5>
                <div>
                  <div>
                    <FormattedRelative value={model.created.timestamp} />
                  </div>
                  <Caption>
                    <FormattedDate value={model.created.timestamp} /> <FormattedTime value={model.created.timestamp} />
                  </Caption>
                </div>
              </H5>}
          </Col>

          <Col flex={flex} xs={6}>
            <Label>Modified</Label>
            {model.modified.timestamp &&
              <H5>
                <div>
                  <FormattedRelative value={model.modified.timestamp} />
                </div>
                <Caption>
                  <FormattedDate value={model.modified.timestamp} /> <FormattedTime value={model.modified.timestamp} />
                </Caption>
              </H5>}
          </Col>

        </Row>
      </Content> : null
  );
};

DetailPane.propTypes = {
  model: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  singleRow: PropTypes.bool,
};

DetailPane.defaultProps = {
  model: {},
  singleRow: false,
};

export default DetailPane;
