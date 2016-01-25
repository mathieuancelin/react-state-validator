/* eslint no-console: 0 */

import { validate } from './statevalidator';

const listeners = [];

function getGlobalObject() {
  if (typeof global !== 'undefined') {
    return global;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof self !== 'undefined') {
    return self;
  }
  return new Function('return this')(); // eslint-disable-line
}

const globalObject = getGlobalObject();
if (!globalObject.process) globalObject.process = {};
if (!globalObject.process.env) globalObject.process.env = {};
if (!globalObject.process.env.hasOwnProperty('NODE_ENV')) globalObject.process.env.NODE_ENV = 'production';

function broadcast(name, errors) {
  listeners.forEach(l => l(name, errors));
}

export function __subscribeToErrors(listener) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}

export function enhanceWithValidState(Component, run) {
  const shouldRun = run || process.env.NODE_ENV !== 'production';
  return class Enhancer extends Component {
    constructor(props) {
      super(props);
      const name = Component.name || Component.displayName;
      const stateTypes = this.constructor.stateTypes || this.stateTypes;
      if (shouldRun && stateTypes) {
        const errors = validate(this.state, stateTypes, name);
        if (errors.length > 0) {
          broadcast(name, errors);
          errors.forEach(e => console.error(`Warning: Failed stateType: ${e.message}`));
        }
      }
    }
    componentWillUpdate(nextProps, nextState) {
      if (super.componentWillUpdate) super.componentWillUpdate(nextProps, nextState);
      const name = Component.name || Component.displayName;
      const stateTypes = this.constructor.stateTypes || this.stateTypes;
      if (shouldRun && stateTypes) {
        const errors = validate(nextState, stateTypes, name);
        if (errors.length > 0) {
          broadcast(name, errors);
          errors.forEach(e => console.error(`Warning: Failed stateType: ${e.message}`));
        }
      }
    }
    render() {
      return super.render();
    }
  };
}
