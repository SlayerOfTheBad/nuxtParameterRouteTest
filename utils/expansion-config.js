import RouteConfig from './route-config';

export default class ExpansionConfig {
  constructor ({
    paramRoute,
    expansions,
  }) {
    if (typeof paramRoute !== 'string') { throw new TypeError('paramRoute must be a string'); }
    if (!Array.isArray(expansions)) { throw new TypeError('expansions must be an array'); }
    this.paramRoute = paramRoute;
    this.expansions = expansions;

    this.expansions.forEach((item) => {
      if (!(item instanceof RouteConfig)) {
        throw new TypeError('expansions must only contain RouteConfig');
      }

      if (item.baseName !== this.paramRoute) {
        throw new TypeError('baseName of RouteConfig for ExpansionConfig must equal ExpansionConfig::paramRoute');
      }
    });
  }
}
