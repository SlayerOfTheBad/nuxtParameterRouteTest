const util = require('util');

export default function () {
  const options = this.nuxt.options.parameterisedRoutes || undefined;

  if (options === undefined) {
    return;
  }

  this.options.router.extendRoutes = function (routes) {
    constructRoutes(routes, options);
  };
  console.log('extended routes');
}

function constructRoutes (routes, options) {
  console.log(routes);
  console.log(options);
  console.log('FILTERS ROUTES START');
  const newRoutes = recursiveFilterRoutes(routes, options);
  routes.length = 0;
  newRoutes.forEach(route => routes.push(route));
  console.log('FILTERS ROUTES END');
  console.log('NEW ROUTES BEGIN');
  console.log(util.inspect(routes, false, null, true));
  console.log('NEW ROUTES END');
}

function recursiveFilterRoutes (routeArray, parameters) {
  let routes = [];
  if (Array.isArray(parameters)) {
    parameters.forEach((module) => {
      if (!(typeof module === 'string' || module instanceof String)) {
        throw new TypeError('Arrays in parameterisedRoutes config must only contain strings');
      }

      routes = routes.concat(routeArray.filter(struct => struct.path.includes(module)));
    });
  } else if (typeof parameters === 'object') {
    Object.keys(parameters).forEach((module) => {
      if (module.match('~.*')) {
        const routeStruct = routeArray.filter(struct => struct.name === module)[0];
        if (routeStruct === undefined) {
          throw new Error('provided key ' + module + ' does not match any route');
        }
        routes = routes.concat(parameterizeRoutes(routeStruct, parameters[module]));
        return;
      }

      if (parameters[module] === false) {
        return;
      }
      if (parameters[module] === true) {
        routes = routes.concat(routeArray.filter(struct => struct.path.includes(module)));
        return;
      }
      const routeStruct = routeArray.filter(struct => struct.path.includes(module))[0];
      routeStruct.children = recursiveFilterRoutes(
        routeStruct.children,
        parameters[module],
      );

      routes = routes.concat(routeStruct);
    });
  }

  return routes;
}

function parameterizeRoutes (routeStruct, parameters) {
  const parameterisedRoutes = [];
  Object.keys(parameters).forEach((key) => {
    let routeChunk = JSON.parse(JSON.stringify(routeStruct));
    routeChunk.path = routeChunk.path.replace(routeChunk.name, key);
    routeChunk = recursiveRenameRoutes(routeChunk, routeChunk.name, key);

    if (routeChunk.children) {
      routeChunk.children = recursiveFilterRoutes(routeChunk.children, parameters[key]);
    }

    parameterisedRoutes.push(routeChunk);
  });

  return parameterisedRoutes;
}

function recursiveRenameRoutes (routeStruct, slug, replacement) {
  if (routeStruct.name) {
    routeStruct.name = routeStruct.name.replace(slug, replacement);
  }
  if (routeStruct.children) {
    routeStruct.children = routeStruct.children.map(child => recursiveRenameRoutes(child, slug, replacement));
  }
  return routeStruct;
}
