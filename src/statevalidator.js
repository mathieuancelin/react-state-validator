export function validate(state, shape, name) {
  const errors = [];
  for (const key in shape) {
    if (shape.hasOwnProperty(key)) {
      try {
        const ret = shape[key](state, key, name, 'prop', key);
        if (ret) {
          ret.message = ret.message.replace('Invalid prop', 'Invalid state');
          ret.errorInfos = {
            key,
            name,
            message: ret.message,
          };
          errors.push(ret);
        }
      } catch (e) {
        errors.push(e);
      }
    }
  }
  return errors;
}
