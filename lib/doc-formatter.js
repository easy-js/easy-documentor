/*!
 * doc-formatter.js
 * 
 * Copyright (c) 2014
 */

/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

// 3rd party
var _ = require('easy-utils');

// lib
var FuncFormatter = require('./func-formatter');


/* -----------------------------------------------------------------------------
 * DocFormatter
 * ---------------------------------------------------------------------------*/

/**
 * @private
 * @constructor
 *
 * @desc Reformat jsdoc data for easydoc templating.
 *
 * @param {object} data - jsdoc data object.
 */
var DocFormatter = function (data) {
  this.data = data;
};

/**
 * @private
 * @memberof DocFormatter
 *
 * @desc Loop over classes/functions/namespaces and reformat accordingly.
 */
DocFormatter.prototype.format = function () {
  this.formatClasses(this.data.classes);
  this.formatFunctions(this.data.functions);
  this.formatNamespaces(this.data.namespaces);

  return this.data;
};

/**
 * @private
 * @memberof DocFormatter
 *
 * @desc Loop over and formatch each individual class.
 *
 * @param {object} classes - jsdoc classes array.
 */
DocFormatter.prototype.formatClasses = function (classes) {
  _.each(classes, this.formatObj, this);
};

/**
 * @private
 * @memberof DocFormatter
 *
 * @desc Loop over and format each individual function.
 *
 * @param {object} functions - jsdoc functions array.
 */
DocFormatter.prototype.formatFunctions = function (functions) {
  _.each(functions, this.formatFunction, this);
};

/**
 * @private
 * @memberof DocFormatter
 *
 * @desc Loop over and format each individual namespace.
 *
 * @param {object} namespaces - jsdoc namespaces array.
 */
DocFormatter.prototype.formatNamespaces = function (namespaces) {
  _.each(namespaces, this.formatObj, this);
};

/**
 * @private
 * @memberof DocFormatter
 *
 * @desc Format individual obj parts (constructor/namespace).
 *
 * @param {object} obj - jsdoc object (constructor/namespace).
 */
DocFormatter.prototype.formatObj = function (obj) {
  var constructor = obj['constructor'];
  var functions   = obj['functions'];

  if (constructor) {
    this.formatFunction(constructor);
  }

  if (functions) {
    this.formatFunctions(functions);
  }
};

/**
 * @private
 * @memberof DocFormatter
 *
 * @desc Format function by creating a new FuncFormatter instance.
 *
 * @param {object} functionObj - jsdoc function object.
 */
DocFormatter.prototype.formatFunction = function (functionObj) {
  var funcFormatter = new FuncFormatter(functionObj);
  funcFormatter.format();
};


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

module.exports = DocFormatter;