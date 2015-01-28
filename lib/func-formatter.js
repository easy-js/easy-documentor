/*!
 * func-formatter.js
 * 
 * Copyright (c) 2014
 */

/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

// 3rd party
var _ = require('easy-utils');


/* -----------------------------------------------------------------------------
 * FuncFormatter
 * ---------------------------------------------------------------------------*/

/**
 * @private
 * @constructor
 *
 * @desc Formatter used to adjust jsdoc `haruki` template. Extracts object
 * parameters into a seperate property so that they may be templated
 * seperately.
 *
 * @param {object} data - jsdoc function data object.
 */
var FuncFormatter = function (data) {
  this.data = data;

  // Store objects to delete until after iteration is complete. 
  this.toDelete = [];

  // Keep a map of objects names and there associated index. This allows
  // us to add multiple paramters to an object and maintain the order of the
  // parameters.
  this.objectMap = {};
};

/**
 * @private
 * @memberof FuncFormatter
 *
 * @desc Loop through parameters and reformat any namespaced parameters.
 */
FuncFormatter.prototype.format = function () {
  // adds functionality for optinionally templating default.
  _.each(this.data.parameters, function (parameterObj) {
    if (parameterObj['default'] !== '') {
      this.data.hasDefault = true;
    }
  }, this);

  // pull out objects
  _.each(this.data.parameters, this.formatParamater, this);

  // Clean up by deleting paramaters that were moved to objects
  this.deleteParameters();
  this.toDelete = [];

  return this.data;
};

/**
 * @private
 * @memberof FuncFormatter
 *
 * @desc Remove parameters which were moved to `objects` property.
 */
FuncFormatter.prototype.deleteParameters = function () {
  var delta = 0;

  _.each(this.toDelete, function (parameterIndex) {
    this.data.parameters.splice(parameterIndex - delta++, 1);
  }, this);
};

/**
 * @private
 * @memberof FuncFormatter
 *
 * @desc Examines parameterName and if namespaced, proxies to corresponding
 * methods to move the parameter to the `objects` property.
 *
 * @param {object} parameterObj - jsdoc parameterObj.
 * @param {number} parameterIndex - index parameter can be found at in
 *   `parameters` property.
 */
FuncFormatter.prototype.formatParamater = function (parameterObj, parameterIndex) {
  var parts   = parameterObj.name.split('.');
  var lindex  = parts.length - 1;

  if (parts.length > 1) {
    this.data.objects = this.data.objects || [];

    this.addToObjects(parts[lindex - 1], parts[lindex], parameterObj);
    this.toDelete.push(parameterIndex);
  }
};

/**
 * @private
 * @memberof FuncFormatter
 *
 * @desc Add a specified parameter to an `object in the `objects` property.
 * Responsible for creating the corresponding object if it does not yet exist.
 *
 * @param {string} objectName - Name of object property corresponds to.
 * @param {string} propName - Name of property on object.
 * @param {object} propObject - jsdoc parameterObj.
 */
FuncFormatter.prototype.addToObjects = function (objectName, propName, propObj) {
  var objectIndex = this.objectMap[objectName];

  // If object does not exist create it and push it on to the end of the
  // objects array.
  if (_.isUndefined(objectIndex)) {
    objectIndex = this.addObject(objectName);
  }

  this.addProp(propObj, propName, objectIndex);
};

/**
 * @private
 * @memberof FuncFormatter
 *
 * @desc Creates/Adds an `object` to the `objects` array. Object index will be
 * stored for lookup to avoid duplicate `object`s being pushed.
 *
 * @param {string} objectName - Name of object to create.
 */
FuncFormatter.prototype.addObject = function (objectName) {
  var object = { name: objectName, properties: [] };
  var objectIndex = this.data.objects.push(object);

  return this.objectMap[objectName] = objectIndex - 1;
};

/**
 * @private
 * @memberof FuncFormatter
 *
 * @desc Add `property` to an object.
 *
 * @param {object} propObj - jsdoc parameterObj to store as a property on the
 *  `object`.
 * @param {string} propName - Name of property (the last string in the parameter
 *   namespace.
 * @param {number} objectIndex - Index at which the `object` can be found at in
 *   the `objects` array.
 */
FuncFormatter.prototype.addProp = function (propObj, propName, objectIndex) {
  this.data.objects[objectIndex].properties.push(propObj);

  // we are overwriting the namespaced version of the parameter
  // with the name of the object property.
  propObj.name = propName;
};


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

module.exports = FuncFormatter;