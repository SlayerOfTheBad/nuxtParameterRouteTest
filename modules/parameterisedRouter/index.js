import util from 'util';

export default function () {
  const options = this.nuxt.options.parameterisedRoutes || undefined;

  if (options === undefined) {
    return;
  }

  this.options.router.extendRoutes = function (routes) {
    constructRoutes(routes, options);
  };
  // console.log('extended routes');
}

function constructRoutes (routes, options) {
  console.log(routes[0]);
  console.log(options);
  // console.log('FILTERS ROUTES START');
  // Parse the config
  const newRoutes = recursiveFilterRoutes(routes, options);

  // Set the routes to be the generated routes
  // Might need to be changed, it does not necessarily have to be replace all
  // (or that needs to be handled in recursiveFilterRoutes
  routes.length = 0;
  newRoutes.forEach(route => routes.push(route));
  // console.log('FILTERS ROUTES END');

  // Shows the new routes;
  console.log('NEW ROUTES BEGIN');
  console.log(util.inspect(routes, false, null, true));
  console.log('NEW ROUTES END');
}

function recursiveFilterRoutes (routeArray, parameters) {
  if (!Array.isArray(routeArray)) {
    console.log(routeArray);
    return;
  }

  let routes = [];

  // An array of strings describing (sub)modules that need to be imported in their entirety
  if (Array.isArray(parameters)) {
    parameters.forEach((module) => {
      // The values can only be strings, as they describe the to-be imported (sub)modules;
      if (!(typeof module === 'string' || module instanceof String)) {
        throw new TypeError('Arrays in parameterisedRoutes config must only contain strings');
      }

      // Add the route and all its subroutes belonging to the specified module;
      routes = routes.concat(routeArray.filter(struct => struct.path.includes(module)));
    });
  } else if (typeof parameters === 'object') {
    // An object where the keys describe the are the (sub)modules that need to be imported,
    // and the value is further configuration.

    Object.keys(parameters).forEach((module) => {
      // <module>: false indicates the entire module can be discarded
      if (parameters[module] === false) {
        return;
      }

      // <module>: true indicates the entire module should be used. See the array part of this function.
      if (parameters[module] === true) {
        routes = routes.concat(routeArray.filter(struct => struct.path.includes(module)));
        return;
      }

      // Add a ~ to the begining of a folder name to make that route parameterizable
      // (expand into multiple separate well-defined routes).
      // e.g. ~client can become huurstunt, oppasland and 123opzeggen.
      if (module.match('~.*')) {
        // Grab the route struct of the parameterisable route;
        const routeStruct = routeArray.filter(struct => struct.name === module)[0];
        // If it does not exist, your config or your folders is fucked.
        if (routeStruct === undefined) {
          throw new Error('provided key ' + module + ' does not match any route');
        }

        // Parameterise the route and add all versions to the routes.
        routes = routes.concat(parameterizeRoutes(routeStruct, parameters[module]));
        return;
      }

      // Configuration is further configuration (either an array or an object)
      // And its children need to be recursively processed

      // Gather the module
      const routeStruct = routeArray.filter(struct => struct.path.includes(module))[0];
      // Set the children to the processed children
      routeStruct.children = recursiveFilterRoutes(
        routeStruct.children,
        parameters[module],
      );

      // Add them to the routes
      routes = routes.concat(routeStruct);
    });
  }

  return routes;
}

function parameterizeRoutes (routeStruct, parameters) {
  const parameterisedRoutes = [];
  // For each key in the parameterisation object...
  Object.keys(parameters).forEach((key) => {
    // Copy the struct
    let routeChunk = JSON.parse(JSON.stringify(routeStruct));
    // Rename the path to the parameter
    routeChunk.path = routeChunk.path.replace(routeChunk.name, key);
    // Rename the route and the child route's names to have the parameter instead of the slug
    routeChunk = recursiveRenameRoutes(routeChunk, routeChunk.name, key);

    // If it has children, have them be filtered according to the given construct.
    if (routeChunk.children) {
      routeChunk.children = recursiveFilterRoutes(routeChunk.children, parameters[key]);
    }

    // Add route structure to the routes
    parameterisedRoutes.push(routeChunk);
  });

  return parameterisedRoutes;
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
