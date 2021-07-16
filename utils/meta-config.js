export default class MetaConfig {
  constructor ({
    key,
    data,
    recursive,
  }) {
    if (typeof key !== 'string') { throw new TypeError('key must be a string'); }
    if (data === undefined) { throw new TypeError('data must be defined'); }
    if (
      recursive !== undefined &&
      typeof recursive !== 'boolean'
    ) { throw new TypeError('recursive must be a boolean'); }

    this.key = key;
    this.data = data;
    this.recursive = recursive ?? false;
  }
}
