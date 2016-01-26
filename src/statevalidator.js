export function validate(state, shape, name) {
  const errors = [];
  function handleError(err, key) {
    const e = err;
    e.message = e.message
      .replace('Invalid prop', 'Invalid state')
      .replace('Required prop', 'Required state')
      .replace('prop', 'state');
    e.errorInfos = {
      key,
      name,
      message: e.message,
    };
    errors.push(e);
  }
  for (const key in shape) {
    if (shape.hasOwnProperty(key)) {
      try {
        const ret = shape[key](state, key, name, 'prop', key);
        if (ret) handleError(ret, key);
      } catch (e) {
        handleError(e, key);
      }
    }
  }
  return errors;
}
