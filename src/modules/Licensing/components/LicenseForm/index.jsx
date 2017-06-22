import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Checkbox from 'react-md/lib/SelectionControls/Checkbox';
import { FormattedDate } from 'react-intl';
import Card from 'react-md/lib/Cards/Card';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import { Button } from 'components/Buttons';
import TextField from 'components/TextField';
import Label from 'components/Label';
import P from 'components/P';

const LicenseForm = (props) => {
  const {
    submitLabel,
    updatedLicenseInfoPending,
    submitting,
    pristine,
    invalid,
    handleSubmit,
    onSubmit,
    history,
    licenseInfo,
  } = props;

  const generateDetailItems = () => (
    Object.keys(licenseInfo).map((detailItem) => {
      if (detailItem !== 'features') {
        if (detailItem === 'issued' || detailItem === 'notBefore' || detailItem === 'notAfter') {
          return (
            <div key={detailItem}>
              <Label>{detailItem}</Label>
              <P><FormattedDate value={licenseInfo[detailItem]} /></P>
            </div>
          );
        }

        return (
          <div key={detailItem}>
            <Label>{detailItem}</Label>
            <P>{licenseInfo[detailItem]}</P>
          </div>
        );
      }

      return null;
    })
  );

  return (
    <div>
      <form className="flex-row" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="flex-row center-center">
          <Card className="flex-10 flex-xs-12 flex-sm-12">
            <CardText className="flex-row">
              <div className="flex-row">
                <div className="flex-row flex-5 flex-xs-12">
                  <Field
                    className="flex-12"
                    component={TextField}
                    name="properties.data"
                    label="License Key"
                    type="text"
                    rows={4}
                    required
                  />
                </div>
                {!licenseInfo.consumerType ? null : <div className="flex-row flex-7 flex-xs-12">
                  <div className="flex-6 flex-xs-12">
                    {generateDetailItems()}
                  </div>
                  <div className="flex-6 flex-xs-12">
                    {Object.keys(licenseInfo.features).map(feature => (
                      <Checkbox
                        id={feature}
                        name={feature}
                        key={feature}
                        label={feature}
                        defaultChecked={licenseInfo.features[feature]}
                        disabled
                      />
                    ))}
                  </div>
                </div>}
              </div>
            </CardText>
            {updatedLicenseInfoPending ? <LinearProgress id="license-form" /> : null}
            <CardActions>
              <Button
                flat
                label="Cancel"
                disabled={updatedLicenseInfoPending || submitting}
                onClick={() => history.goBack()}
              />
              <Button
                raised
                label={submitLabel}
                type="submit"
                disabled={pristine || updatedLicenseInfoPending || invalid || submitting}
                primary
              />
            </CardActions>
          </Card>
        </div>
      </form>
    </div>
  );
};

LicenseForm.propTypes = {
  updatedLicenseInfoPending: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  submitLabel: PropTypes.string,
  history: PropTypes.object.isRequired,
  licenseInfo: PropTypes.object.isRequired,
};

LicenseForm.defaultProps = {
  submitLabel: '',
  cancelLabel: 'Cancel'
};

export default LicenseForm;
