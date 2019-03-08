import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { FlatButton } from 'components/Buttons';
import { FullPageFooter } from 'components/FullPage';
import SaveIcon from '@material-ui/icons/Save';

const FormStyle = styled.form`
  height: 100%;
  width: 100%;
  ${props => !props.noFooterPadding && 'padding-bottom: 56px'};
  ${props => props.disabled && 'pointer-events: none'};
  ${props => props.disabled && 'opacity: 0.4'};
`;

const Form = memo(({ match, children, disabled, disabledCancel, disabledSubmit, submitTitle, showCancel, cancelTo, noFooterPadding, disableFooter, ...rest }) => (
  <FormStyle
    noValidate
    noFooterPadding={noFooterPadding || disableFooter}
    disabled={disabled}
    {...rest}
  >
    {children}
    {!disableFooter &&
      <FullPageFooter
        leftActions={(
          showCancel &&
          <FlatButton
            disabled={disabledCancel}
            component={Link}
            to={cancelTo}
            label="Cancel"
          />
        )}
        rightActions={(
          <FlatButton
            variant="contained"
            type="submit"
            disabled={disabledSubmit}
            color="primary"
            label={submitTitle}
            icon={<SaveIcon fontSize="small" action="inherit" />}
          />
        )}
      />}
  </FormStyle>
));

Form.propTypes = {
  match: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  disabled: PropTypes.bool,
  disabledCancel: PropTypes.bool,
  disabledSubmit: PropTypes.bool,
  submitTitle: PropTypes.string,
  showCancel: PropTypes.bool,
  cancelTo: PropTypes.string,
  noFooterPadding: PropTypes.bool,
  disableFooter: PropTypes.bool,
};

Form.defaultProps = {
  disabled: false,
  disabledCancel: false,
  disabledSubmit: false,
  submitTitle: 'Submit',
  showCancel: false,
  cancelTo: '/',
  noFooterPadding: false,
  disableFooter: false,
};

export default withRouter(Form);
