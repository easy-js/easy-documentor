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
 * @params {string} opts.theme - Easydocs theme object containing
 *   `docsTmpl` prop.
 */
Documentor = function (opts) {
  if (!opts || !opts.theme) {
    throw new Error('missing required opts.');
  }

  // clone, merge in defaults, standardize paths, etc..
  this.opts = this._buildOpts(opts);

  // avoid ungly scoping issues.
  _.bindPrototypes(this);
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
 * @desc Return a new object which is the result of cloning specified options,
 * merging in defaults, and standardizing paths.
 *
 * @param {object} opts - Documentor opts.
 */
Documentor.prototype._buildOpts = function (options) {
  // jsonClone props to a new object in order to avoid changing passed opts.
  var opts = _.jsonClone(options);
  _.defaults(opts, {
    root : process.cwd(),
    src  : './src'
  });

  // copy over helpers (which are not cloned during jsonClone)
  if (options.theme.helpers) {
    opts.theme.helpers = _.extend({}, options.theme.helpers);
  }

  // make sure paths are absolute
  opts.root = path.resolve(opts.root);
  opts.src  = path.resolve(opts.root, opts.src);

  return opts;
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
  _.renderFile(this.opts.theme.docsTmpl, data, {
    partials : this.opts.theme.partials,
    helpers  : this.opts.theme.helpers
  }, callback);
};


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

module.exports = Documentor;