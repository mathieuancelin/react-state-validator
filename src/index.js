/* eslint no-console: 0 */

import { validate } from './statevalidator';

const listeners = [];

export function __subscribeToErrors(listener) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}

function broadcast(name, errors) {
  listeners.forEach(l => l(name, errors));
}

export function enhanceWithValidState(Component) {
  return class Enhancer extends Component {
    constructor(props) {
      super(props);
      const name = Component.name || Component.displayName;
      const stateTypes = this.constructor.stateTypes || this.stateTypes;
      if (process.env.NODE_ENV !== 'production' && stateTypes) {
        const errors = validate(this.state, stateTypes, name);
        if (errors.length > 0) {
          broadcast(name, errors);
          errors.forEach(e => console.warn(`Warning: Failed stateType: ${e.message}`));
        }
      }
    }
    componentWillUpdate(nextProps, nextState) {
      if (super.componentWillUpdate) super.componentWillUpdate(nextProps, nextState);
      const name = Component.name || Component.displayName;
      const stateTypes = this.constructor.stateTypes || this.stateTypes;
      if (process.env.NODE_ENV !== 'production' && stateTypes) {
        const errors = validate(nextState, stateTypes, name);
        if (errors.length > 0) {
          broadcast(name, errors);
          errors.forEach(e => console.warn(`Warning: Failed stateType: ${e.message}`));
        }
      }
    }
    render() {
      return super.render();
    }
  };
}
