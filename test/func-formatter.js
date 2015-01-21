/*!
 * test/easy-docs.js
 * 
 * Copyright (c) 2014
 */

/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

// 3rd party
var _      = require('easy-utils');
var assert = require('chai').assert;

// lib
var FuncFormatter = require('../lib/func-formatter');
var docData       = require('./fixtures/jsdoc');


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('func-formatter.js', function () {

  /* ---------------------------------------------------------------------------
   * format()
   * -------------------------------------------------------------------------*/

  describe('format()', function () {

    beforeEach(function () {
      this.original  = docData.classes[0].constructor;
      this.clone     = _.jsonClone(this.original);

      this.formatter = new FuncFormatter(this.clone);
    });

    it('Should remove object props from `parameters` property.', function () {
      this.formatter.format();

      assert.equal(this.clone.parameters.length, 1);
      assert.deepEqual(this.clone.parameters[0], this.original.parameters[0]);
    });

    it('Should create new `objects` property.', function () {
      this.formatter.format();

      assert.ok(this.clone.objects);
    });

    it('Should create add `object` to `objects` array.', function () {
      this.formatter.format();

      assert.equal(this.clone.objects[0].name, 'opts');
    });

    it('Should add each `property` to the `object`.', function () {
      this.formatter.format();

      assert.equal(this.clone.objects[0].properties[0].name, 'prop1');
      assert.equal(this.clone.objects[0].properties[1].name, 'prop2');
    });

    it('Should add each `property` to the `object`.', function () {
      this.formatter.format();

      assert.equal(this.clone.objects[0].properties[0].name, 'prop1');
      assert.equal(this.clone.objects[0].properties[1].name, 'prop2');
    });

  });

});