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
    height: 22px;
    width: 22px;
    padding: 1px;
    border-radius: none;

    i {
      font-size: 18px;
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

const DetailPane = ({ model, ...props }) => {
  const owner = (model.owner && model.owner.name) || (model.owner && model.owner.id);

  return (
    model.id ?
      <Content {...props}>
        <Row gutter={6}>
          <Col flex={2} xs={6} sm={6} md={6}>
            <StatusStyle>
              <Label>Resource State</Label>
              <StatusBubble status={getLastFromSplit(model.resource_state)} />
            </StatusStyle>
          </Col>

          <Col flex={2} xs={6} sm={6} md={6}>
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

          <Col flex={2} xs={6} sm={6} md={6}>
            <Label>Owner</Label>
            <H5>{owner}</H5>
          </Col>

          <Col flex={2} xs={6} sm={6} md={6}>
            <div>
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
            </div>
          </Col>

          <Col flex={2} xs={6} sm={6} md={6}>
            <div>
              <Label>Modified</Label>
              {model.modified.timestamp &&
                <H5>
                  <div>
                    <div>
                      <FormattedRelative value={model.modified.timestamp} />
                    </div>
                    <Caption>
                      <FormattedDate value={model.modified.timestamp} /> <FormattedTime value={model.modified.timestamp} />
                    </Caption>
                  </div>
                </H5>}
            </div>
          </Col>

          <Col flex={2} xs={6} sm={6} md={6}>
            <div>
              <Label>Resource Type</Label>
              <H5>{model.resource_type}</H5>
            </div>
          </Col>
        </Row>
      </Content> : null
  );
};

DetailPane.propTypes = {
  model: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

DetailPane.defaultProps = {
  model: {},
};

export default DetailPane;
