/*!
 * documentor.js
 * 
 * Copyright (c) 2014
 */

/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

// core
var path     = require('path');
var execFile = require('child_process').execFile;

// 3rd party
var _     = require('easy-utils');
var async = require('async');

// lib
var DocFormatter = require('./doc-formatter');


/* -----------------------------------------------------------------------------
 * Documentor
 * ---------------------------------------------------------------------------*/

/**
 * @public
 * @consturctor
 *
 * @desc Documentation templater for jsdoc.
 *
 * @param {object} opts - Documentor options.
 * @param {string} opts.root - Root which all paths will be resolved
 *   relative to.
 * @param {string} opts.src - Location of src file to document.
 * @param {string} opts.tmpl - Location of template to use for documentation.
 */
Documentor = function (opts) {
  this.opts = opts;

  _.defaults(this.opts, {
    root: process.cwd(),
    src: './src'
  });

  // make sure paths are absolute
  this.opts.root = path.resolve(this.opts.root);
  this.opts.src  = path.resolve(this.opts.root, this.opts.src);

  // avoid ungly scoping issues.
  _.bindAll(this, 'render', '_getData', '_formatData', '_render');
};

/**
 * @public
 * @memberof Documentor
 *
 * @desc Render documentation and execute callback with contents.
 *
 * @param {function} callback - Function to execute after documentation has
 *   been built.
 */
Documentor.prototype.render = function (callback) {
  return async.waterfall([
    this._getData,
    this._formatData,
    this._render
  ], callback);
};

/**
 * @private
 * @memberof Documentor
 *
 * @desc Generate jsdon data from jsdoc using `templates/haruki`.
 *
 * @param {function} callback - Function to execute once json data has
 *  been retrieved from jsdoc.
 */
Documentor.prototype._getData = function (callback) {
  var jsdoc = path.join(__dirname, '../node_modules/jsdoc/jsdoc.js');

  execFile(jsdoc, [
    this.opts.src,
    '-r',
    '-t',
    'templates/haruki',
    '-d', 
    'console'
  ], function (err, stdout, stderr) {
    return err
      ? callback(err)
      : callback(err, JSON.parse(stdout));
  });
};

/**
 * @private
 * @memberof Documentor
 *
 * @desc Formats output generated from jsdoc `templates/haruki` to be compatible
 *   with `easy-docs`.
 *
 * @param {object} data - Raw jsdoc json data created from templates/haruki.
 * @param {function} callback - Function to executed after data has been
 *   reformattated for easy-dcos.
 */
Documentor.prototype._formatData = function (data, callback) {
  var docFormatter = new DocFormatter(data);

  process.nextTick(function () {
    callback(null, docFormatter.format());
  });
};

/**
 * @private
 * @memberof Documentor
 *
 * @desc Render formatted jsdoc data using specified template.
 *
 * @param {object} data - Formatted jsdoc data.
 * @param {function} callback - Function to execute once data has been rendered.
 */
Documentor.prototype._render = function (data, callback) {
  var tmpl = path.resolve(this.opts.root, this.opts.tmpl);

  _.renderFile(tmpl, data, {
    partials : this.opts.partials,
    helpers  : this.opts.helpers
  }, callback);
};


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

module.exports = Documentor;