import ExpansionConfig from './utils/expansion-config';
import MetaConfig from './utils/meta-config';
import RouteConfig from './utils/route-config';

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'router-test',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '~/modules/paramRoutes',
    'nuxt-typed-router',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    followSymlinks: true,
  },

  typedRouter: {
    filePath: './models/__routes.js', // or .ts,
  },

  parameterisedRoutes: {
    '~client': {
      oppasland: {
        userapp: ['somepart'],
        postcodes: ['beginpoint', 'endpoint'],
        translations: false,
      },
      huurstunt: {
        userapp: false,
        postcodes: true,
        translations: true,
      },
      opzeggen: ['userapp', 'translations'],
      all: ['userapp', 'postcodes', 'translations'],
    },
  },

  paramRoutes: [
    new ExpansionConfig({
      paramRoute: '~client',
      expansions: [
        new RouteConfig({
          baseName: '~client',
          name: 'oppasland',
          unlisted: false,
          meta: [
            new MetaConfig({
              key: 'api',
              data: 'api-v2',
              recursive: true,
            }),
            new MetaConfig({
              key: 'local',
              data: 'data',
              recursive: false,
            }),
          ],
          subroutes: [
            new RouteConfig({
              baseName: 'userapp',
              name: 'userapp',
              unlisted: false,
              subroutes: [
                new RouteConfig({
                  baseName: 'somepart',
                }),
              ],
            }),
            new RouteConfig({
              baseName: 'postcodes',
              name: 'postcodes',
              unlisted: false,
              subroutes: [
                new RouteConfig({
                  baseName: 'beginpoint',
                }),
                new RouteConfig({
                  baseName: 'endpoint',
                }),
              ],
            }),
          ],
        }),
        new RouteConfig({
          baseName: '~client',
          name: 'huurstunt',
          unlisted: false,
          meta: [
            new MetaConfig({
              key: 'api',
              data: 'api-v1',
              recursive: true,
            }),
          ],
          subroutes: [
            new RouteConfig({
              baseName: 'postcodes',
              name: 'postcodes',
              unlisted: true,
            }),
            new RouteConfig({
              baseName: 'translations',
              name: 'translations',
            }),
          ],
        }),
        new RouteConfig({
          baseName: '~client',
          name: 'opzeggen',
          unlisted: false,
          meta: [
            new MetaConfig({
              key: 'api',
              data: 'api-v1',
              recursive: true,
            }),
          ],
          subroutes: [
            new RouteConfig({
              baseName: 'userapp',
              name: 'userapp',
              alias: ['cancel-users'],
              unlisted: true,
              subroutes: [
                new RouteConfig({
                  baseName: 'somepart',
                }),
              ],
            }),
            new RouteConfig({
              baseName: 'postcodes',
              unlisted: true,
              subroutes: [
                new RouteConfig({
                  baseName: 'beginpoint',
                }),
                new RouteConfig({
                  baseName: 'endpoint',
                }),
              ],
            }),
          ],
        }),
        new RouteConfig({
          baseName: '~client',
          name: 'all',
          unlisted: true,
        }),
      ],
    }),
    new RouteConfig({
      baseName: 'index',
    }),
  ],
};
