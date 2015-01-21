/*!
 * test/doc-formatter.js
 * 
 * Copyright (c) 2014
 */

/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

// core
var path = require('path');

// 3rd party
var _      = require('easy-utils');
var assert = require('chai').assert;

// lib
var DocFormatter = require('../lib/doc-formatter');
var docData      = require('./fixtures/jsdoc');


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('doc-formatter.js', function () {

  /* ---------------------------------------------------------------------------
   * format()
   * -------------------------------------------------------------------------*/

  describe('format()', function () {

    beforeEach(function () {
      this.original  = docData;
      this.clone     = _.jsonClone(this.original);

      this.formatter = new DocFormatter(this.clone);
    });

    it('Should format every function in the doc.', function () {
      this.formatter.format();

      assert.ok(this.clone.classes[0].constructor.objects);
      assert.ok(this.clone.functions[0].objects);
      assert.ok(this.clone.namespaces[0].functions[0].objects);
    });

  });

});