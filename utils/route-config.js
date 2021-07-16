import ExpansionConfig from './expansion-config';
import MetaConfig from './meta-config';

export default class RouteConfig {
  constructor ({
    baseName,
    unlisted,
    name,
    alias,
    meta,
    subroutes,
  }) {
    if (!(typeof baseName === 'string' || baseName instanceof String)) { throw new TypeError('baseName must be a string'); }
    this.baseName = baseName;
    this.name = name ?? baseName;
    this.unlisted = unlisted ?? !Array.isArray(subroutes);
    this.alias = alias ?? [];
    this.meta = meta ?? [];
    this.subroutes = subroutes ?? [];

    if (!Array.isArray(this.subroutes)) { throw new TypeError('subroutes must be an array or undefined'); }
    if (!Array.isArray(this.meta)) { throw new TypeError('meta must be an array or undefined'); }

    this.subroutes.forEach((item) => {
      if (!(item instanceof RouteConfig || item instanceof ExpansionConfig)) {
        throw new TypeError('subroutes must only contain RouteConfig or ExpansionConfig');
      }
    });
    this.meta.forEach((item) => {
      if (!(item instanceof MetaConfig)) {
        throw new TypeError('meta must only contain MetaConfig');
      }
    });
  }
}
