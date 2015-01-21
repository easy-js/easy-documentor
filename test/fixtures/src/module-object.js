/*!
 * test/fixtures/src/module-object.js
 * 
 * Copyright (c) 2014
 */

define(function () {


/* -----------------------------------------------------------------------------
 * moduleObject
 * ---------------------------------------------------------------------------*/

/**
 * @global
 * @public
 * @namespace
 *
 * @desc Class used to test jsdoc templating. This class will start very minimal
 * and grow as various documenting use cases become apparent.
 */
var moduleObject = {};


/* -----------------------------------------------------------------------------
 * api
 * ---------------------------------------------------------------------------*/

/**
 * @public
 * @memberof moduleObject
 *
 * @desc Class used to test jsdoc templating. This class will start very minimal
 * and grow as various documenting use cases become apparent.
 *
 * @example
 * moduleObject.method({
 *   prop1: 'super duper important'
 *   prop2: 'ehhh'
 * });
 *
 * @param {object} opts - moduleFunction options.
 * @param {string} opts.prop1 - A very import property.
 * @param {string} opts.prop2 - A less important property.
 */
moduleObject.method = function (str, arr, obj, callback) {

};


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

return moduleObject;


});