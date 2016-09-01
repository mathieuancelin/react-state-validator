# react-state-validator

[![build status][1]][2]

A simple API to validate your React components state as it changes in time

```
npm install react-state-validator
```

or

```html
<script src="https://unpkg.com/react-state-validator/dist/react-state-validator.js"></script>
```

## Validate your state

Sometimes it can be helpful to validate your component state when in dev mode, even if you should be sure of what kind of data are merged to the state.

With `react-state-validator` you can reuse the React validation API for props to validate your state. You just have to defined a `stateTypes` property on your component, and pass the component into an enhancer. You can use the `enhanceWithValidState` API to create an Higher Order Component that can work with `React.Component` or `React.createClass` as the following code.

**WARNING**

As the validation is only performed in dev mode (for performance reason), in dev mode you should define a `process.env.NODE_ENV` variable with a value that is not `production` (ie. `test`, or `dev`). In production mode, set the same variable to `production`.

Also you have to be aware that `react-state-validator` can have serious impact on performances if you change your state a lot and if your state is big with a lot of validation. You should use it with caution and only for development.

```javascript
import React from 'react';
import { enhanceWithValidState } from 'react-state-validator';

export const HellWorld = enhanceWithValidState(React.createClass({
  getInitialState() {
    return {
      name: 'World',
    };
  },
  stateTypes: {
    name: React.PropTypes.string.isRequired,
  },
  render() {
    return (
      <h1>Hello {this.state.name}!</h1>
    );
  }
}));
```

or

```javascript
import React from 'react';
import { enhanceWithValidState } from 'react-state-validator';

class HellWorld extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: 'World' };
  }
  render() {
    return (
      <h1>Hello {this.state.name}!</h1>
    );
  }
}

HellWorld.stateTypes = {
  name: React.PropTypes.string.isRequired,
};

export default enhanceWithValidState(HellWorld);
```

Each time you state doesn't comply to validation constraints in dev mode, a error will be logged in your console.

[1]: https://api.travis-ci.org/mathieuancelin/react-state-validator.svg
[2]: https://api.travis-ci.org/mathieuancelin/react-state-validator
