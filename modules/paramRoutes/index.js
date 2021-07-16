import ExpansionConfig from '../../utils/expansion-config';
import RouteConfig from '../../utils/route-config';

export default function () {
  const options = this.nuxt.options.paramRoutes || undefined;
  if (options === undefined) { return; }

  this.options.router.extendRoutes = (routes) => {
    routes = constructRoutes(routes, options);
    console.log(routes[0]);
    return routes;
  };
}

function constructRoutes (routeArray, configArray) {
  const routes = [];
  configArray.forEach((config) => {
    if (config instanceof RouteConfig) {
      const route = routeArray.filter(routeStruct => routeStruct.path.includes(config.baseName) || routeStruct.name === config.baseName);
      if (route.length !== 1) { throw new Error(`undefined route '${config.baseName}' in route config`); }

      routes.push(processRoute(route[0], config));
    }

    if (config instanceof ExpansionConfig) {
      const route = routeArray.filter(routeStruct => routeStruct.path.includes(config.paramRoute) || routeStruct.name === config.baseName);
      if (route.length !== 1) { throw new Error(`undefined expansion '${config.paramRoute}' in expansion config`); }

      processExpansion(route[0], config).forEach(route => routes.push(route));
    }
  });

  return routes;
}

function processExpansion (routeStruct, config) {
  const routes = [];
  config.expansions.forEach((routeConfig) => {
    // Copy the struct
    let routeChunk = JSON.parse(JSON.stringify(routeStruct));
    routeChunk = processRoute(routeChunk, routeConfig);
    routes.push(routeChunk);
  });

  return routes;
}

function processRoute (routeStruct, config) {
  if (!(config instanceof RouteConfig)) { throw new TypeError('config must be instance of Routeconfig'); }

  routeStruct = recursiveRenameRoutes(routeStruct, config.baseName, config.name);
  routeStruct.path = routeStruct.path.replace(config.baseName, config.name);
  routeStruct.alias = config.alias;
  processMeta(routeStruct, config.meta);

  const undefinedRouteArray = [];
  if (config.unlisted) {
    const definedRoutes = config.subroutes.map(routeConfig => routeConfig.baseName);
    (routeStruct.children ?? []).forEach((routeChild) => {
      for (const defined of definedRoutes) {
        if (routeChild.path.includes(defined)) { return; }
      }

      undefinedRouteArray.push(routeChild);
    });
  }

  routeStruct.children = undefinedRouteArray.concat(constructRoutes(routeStruct.children ?? [], config.subroutes));

  return routeStruct;
}

function processMeta (routeStruct, metaArray) {
  if (metaArray.length === 0) { return; }

  if (typeof routeStruct.meta !== 'object') { routeStruct.meta = {}; }
  metaArray.forEach(meta => meta.recursive ? addMetaRecursive(routeStruct, meta) : addMeta(routeStruct, meta));
}

function addMeta (routeStruct, meta) {
  // if (typeof routeStruct.meta !== 'object') { return; }

  routeStruct.meta[meta.key] = meta.data;
}

function addMetaRecursive (routeStruct, meta) {
  // if (typeof routeStruct.meta !== 'object') { return; }

  routeStruct.meta[meta.key] = meta.data;
  (routeStruct.children ?? []).forEach(routeChild => processMeta(routeChild, [meta]));
}

function recursiveRenameRoutes (routeStruct, slug, replacement) {
  // Rename route name
  if (routeStruct.name) {
    routeStruct.name = routeStruct.name.replace(slug, replacement);
  }
  // Rename route's children's route names
  if (routeStruct.children) {
    routeStruct.children = routeStruct.children.map(child => recursiveRenameRoutes(child, slug, replacement));
  }
  return routeStruct;
}
