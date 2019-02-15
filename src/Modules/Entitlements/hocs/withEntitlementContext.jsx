import React from 'react';
import { ModalConsumer } from 'Modules/ModalRoot/ModalContext';

export default BaseComponent => props => (
  <ModalConsumer>
    {context => <BaseComponent {...props} entitlements={context} />}
  </ModalConsumer>
);
