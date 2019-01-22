import React, { PureComponent } from 'react';
import Mousetrap from 'mousetrap';

export default function withKeyBindings(BaseComponent) {
  class KeysHoc extends PureComponent {
    static displayName = 'Keys (HOC)';

    constructor(props) {
      super(props);

      this.keyBindings = [];
    }

    add = (keys, callback) => {
      Mousetrap.bind(keys, callback);
      this.keyBindings.push(keys);
    }

    remove = (key) => {
      const index = this.keyBindings.indexOf(key);

      if (index > -1) {
        this.keyBindings.splice(index, 1);
      }

      Mousetrap.unbind(key);
    }

    removeAll() {
      if (this.keyBindings.length > 0) {
        this.keyBindings.forEach(key => Mousetrap.unbind(key));
        this.keyBindings = [];
      }
    }

    componentWillUnmount() {
      this.removeAll();
    }

    render() {
      const methods = {
        add: this.add,
        remove: this.remove,
      };

      return (
        <BaseComponent
          {...this.props}
          keyBindings={methods}
        />
      );
    }
  }

  return KeysHoc;
}
