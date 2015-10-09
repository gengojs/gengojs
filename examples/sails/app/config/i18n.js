/**
 * Internationalization / Localization Settings
 * (sails.config.i18n)
 *
 * If your app will touch people from all over the world, i18n (or internationalization)
 * may be an important part of your international strategy.
 *
 *
 * For more informationom i18n in Sails, check out:
 * http://sailsjs.org/#!/documentation/concepts/Internationalization
 */
module.exports.i18n = {
  /****************************************************************************
   *                                                                          *
   * Override the namespaces used for debugging.                              *
   * See https://github.com/gengojs/core for documentation.                   *
   ****************************************************************************/
  // debug : {
  //  enabled: true,
  //  namespaces:[ 'core', 'parser', 'router', 'api', 'header', 'localize', 'backend' ]
  //},

  /****************************************************************************
   *                                                                          *
   * Override any default plugins for gengojs.                                *
   * See https://github.com/gengojs/core for documentation.                   *
   ****************************************************************************/
  // plugins : {},

  /****************************************************************************
   *                                                                          *
   * API Options                                                              *
   * See https://github.com/gengojs/plugin-api for documentation.             *
   ***************************************************************************/
  // api: {
  //     /** 
  //      * 'global' refers to the api use for i18n your phrases. 
  //      * ( e.g. __("Hello") )
  //      */
  //   "global":"__",
  //   /** 
  //    * 'localize' refers to the api use for i18n your date, time, and number. 
  //    * ( e.g. __l("ja").date().now() )
  //    */
  //   "localize":"__l"
  // },

  /****************************************************************************
   *                                                                          *
   * Backend Options                                                          *
   * See https://github.com/gengojs/plugin-backend for documentation.         *
   ***************************************************************************/
  // backend: {
  //  /**
  //   * 'directory' refers to the path to your dictionary respect to the
  //   * root of your sails app.
  //   */
  //   "directory": "/config/locales",
  //  /**
  //   * 'extension' refers to the file extension of your dictionary.
  //   */
  //   "extension": "json",
  //  /**
  //   * 'prefix' refers to the prefix in your file's name.
  //   */
  //   "prefix": "",
  //  /**
  //   * 'cache' refers to caching and enables gengo to store the dictionary
  //   * without changes until the server has been restarted.
  //   */
  //   "cache": true
  // },

  /****************************************************************************
   *                                                                          *
   * Header Options                                                           *
   * See https://github.com/gengojs/plugin-header for documentation.          *
   ***************************************************************************/
  header: {
  //   /**
  //    * 'detect' refers to the detection type. Note that it is best to use up to two
  //    * types of detection.
  //    */
  //     "detect": {
  //       /**
  //        * 'query' enables query parsing for any key that refers to the locale.
  //        * ( e.g. http://example.com/hello?locale=ja )
  //        */
  //         "query": false,
  //         /**
  //          * 'subdomain' enables subdomain parsing for the locale.
  //          * ( e.g. http://ja.example.com )
  //          */
  //         "subdomain": false,
  //         /**
  //          * 'url' enables url parsing for the locale.
  //          * ( e.g. http://www.example.com/ja )
  //          */
  //         "url": false,
  //         /**
  //          * 'cookie' enables cookie parsing for the locale.
  //          */
  //         "cookie": false,
  //         /**
  //          * 'header' enables header parsing for the locale.
  //          * ( e.g. Accept-Language )
  //          */
  //         "header": true
  //   },
  //   /**
  //    * 'keys' refers to the key used in cookie and query parsing.
  //    */
  //     "keys": {
  //         "cookie": "locale",
  //         "query": "locale"
  //   },
  //   /**
  //    * 'supported' refers to the locales supported in your app.
  //    */
      "supported": ["en-US", 'fr', 'ja', 'en', 'de'],
  //     /**
  //      * 'default' refers to the default locale of your app.
  //      */
  //     "default": "en-US"
  },

  /****************************************************************************
   *                                                                          *
   * Parser Options                                                           *
   * See https://github.com/gengojs/plugin-parser for documentation.          *
   ***************************************************************************/
  // parser : {
  //   /**
  //    * 'type' refers to the type of parser used.
  //    * ( e.g. 'default' = template/interpolation and sprintf, 'format' = message format, '*' = all/auto )
  //    */    
  //   "type": "default",
  //   /**
  //    * 'markdown' refers to options for markdown-it.
  //    * See https://github.com/markdown-it/markdown-it for documentation.
  //    */
  //   "markdown": {
  //   /**
  //    * 'enabled' refers to enabling markdown-it.
  //    */
  //     "enabled": false,
  //     "html": false,
  //     "xhtmlOut": false,
  //     "breaks": false,
  //     "langPrefix": "language-",
  //     "linkify": false,
  //     "typographer": false,
  //     "quotes": "“”‘’"
  //   },
  //   /**
  //    * 'template' refers to interpolation.
  //    * ( e.g. __('{{greet}}', 'hello') -> 'hello'
  //    */
  //   "template": {
  //   /**
  //    * 'enabled' refers to enabling interpolation.
  //    */
  //     "enabled": true,
  //   /**
  //    * 'open' refers to opening expression.
  //    */
  //     "open": "{{",
  //   /**
  //    * 'open' refers to opening expression.
  //    */
  //     "close": "}}"
  //   },
  //   /**
  //    * 'sprintf' refers to sprintf
  //    */
  //   "sprintf": {
  //   /**
  //    * 'enabled' refers to enabling sprintf.
  //    */
  //     "enabled": true
  //   },
  //   /**
  //    * 'keywords' refers to the keywords used in your dictionary.
  //    */
  //   "keywords": {
  //   /**
  //    * 'default' refers to the default phrase in your dictionary (in your native language).
  //    */
  //     "default": "default",
  //   /**
  //    * 'translated' refers to the translated phrase in your dictionary (in another language).
  //    */
  //     "translated": "translated",
  //   /**
  //    * 'global' refers to the globally used dictionary when router is enabled (router independent).
  //    */
  //     "global": "global"
  //   }
  // },

  /****************************************************************************
   *                                                                          *
   * Router Options                                                           *
   * See https://github.com/gengojs/plugin-router for documentation.          *
   ***************************************************************************/
  // router: {
  //  /**
  //   * 'enabled' refers to enabling the special data structure in your dictionary.
  //   * ( e.g. URL path = '/greet/', Dictionary = { 'index': {'greet': { /* ... */ } } } )
  //   */
  //   "enabled": false
  // }
};