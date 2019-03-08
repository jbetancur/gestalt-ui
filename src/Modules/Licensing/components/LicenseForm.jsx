import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexybox';
import { Field } from 'react-final-form';
import styled from 'styled-components';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from 'components/Fields/Checkbox';
import { FormattedDate } from 'react-intl';
import { FlatButton } from 'components/Buttons';
import Form, { TextField } from 'components/Form';
import Label from 'components/Label';
import { H4 } from 'components/Typography';
import { composeValidators, required, validator } from 'util/forms';
import { isBase64 } from 'util/validations';

const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  bottom: 0;
  right: 0;
  height: 64px;
  position: absolute;
  padding-right: 16px;
  background-color: white;

  button {
    margin: 3px;
  }
`;

const LicenseForm = ({
  submitting,
  pristine,
  invalid,
  handleSubmit,
  onClose,
  licenseInfo,
  pending,
  form,
}) => {
  const close = () => {
    form.reset();
    onClose();
  };

  const generateDetailItems = () => (
    Object.keys(licenseInfo).map((detailItem) => {
      if (detailItem !== 'features') {
        if (detailItem === 'issued' || detailItem === 'notBefore' || detailItem === 'notAfter') {
          return (
            <div key={detailItem}>
              <Label>{detailItem}</Label>
              <H4><FormattedDate value={licenseInfo[detailItem]} /></H4>
            </div>
          );
        }

        return (
          <div key={detailItem}>
            <Label>{detailItem}</Label>
            <H4>{licenseInfo[detailItem]}</H4>
          </div>
        );
      }

      return null;
    })
  );

  return (
    <Form onSubmit={handleSubmit} autoComplete="off" disabled={pending} disableFooter>
      <Row gutter={5}>
        <Col flex={5} xs={12}>
          <Field
            component={TextField}
            name="properties.data"
            placeholder="License Key"
            type="text"
            multiline
            required
            disabled={pending}
            validate={
              composeValidators(
                required('a license key is required'),
                validator(isBase64, 'invalid license key - make sure there are no line breaks in your regex'),
              )
            }
          />
        </Col>
        {licenseInfo.consumerType &&
        <Col flex={7} xs={12}>
          <Row gutter={5}>
            <Col flex={6} xs={12}>
              {generateDetailItems()}
            </Col>
            <Col flex={6} xs={12}>
              <FormGroup>
                {Object.keys(licenseInfo.features).map(feature => (
                  <Checkbox
                    id={feature}
                    name={feature}
                    key={feature}
                    label={feature}
                    checked={licenseInfo.features[feature]}
                    disabled
                  />
                ))}
              </FormGroup>
            </Col>
          </Row>
        </Col>}
      </Row>
      <Footer>
        <FlatButton
          label="Cancel"
          disabled={submitting}
          onClick={close}
        />
        <FlatButton
          label="Update"
          variant="contained"
          type="submit"
          disabled={pristine || invalid || submitting}
          color="primary"
        />
      </Footer>
    </Form>
  );
};

LicenseForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  licenseInfo: PropTypes.object.isRequired,
  pending: PropTypes.bool.isRequired,
};

export default LicenseForm;
