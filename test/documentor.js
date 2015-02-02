/*!
 * test/documentor.js
 * 
 * Copyright (c) 2014
 */

/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

// core
var fs   = require('fs');
var path = require('path');

// 3rd party
var _      = require('easy-utils');
var assert = require('chai').assert;

// lib
var Documentor = require('../lib/documentor');
var docData    = require('./fixtures/jsdoc');


/* -----------------------------------------------------------------------------
 * common
 * ---------------------------------------------------------------------------*/

var srcPath  = path.resolve(__dirname, './fixtures/src');
var tmplPath = path.resolve(__dirname, './fixtures/tmpl.hbs');

var docStr  = fs.readFileSync('./test/fixtures/expected.html', 'utf8');


/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('documentor.js', function () {

  beforeEach(function () {
    this.documentor = new Documentor({
      src: srcPath,
      theme: { docsTmpl: tmplPath }
    });
  });


  /* ---------------------------------------------------------------------------
   * _getData()
   * -------------------------------------------------------------------------*/

  describe('_getData()', function () {

    it('Should execute callback with passed data.', function (done) {
      this.documentor._getData(function (err, data) {
        assert.deepEqual(data, docData);
        done();
      });
    });

  });


  /* ---------------------------------------------------------------------------
   * _formatData()
   * -------------------------------------------------------------------------*/

  describe('_formatData()', function () {

    beforeEach(function () {
      this.original = docData;
      this.clone    = _.jsonClone(this.original);
    });

    it('Should return formatted data.', function () {
      var self = this;

      this.documentor._formatData(this.clone, function (err, data) {
        assert.notDeepEqual(self.original, data);
      });
    });

  });


  /* ---------------------------------------------------------------------------
   * _render()
   * -------------------------------------------------------------------------*/

  describe('_render()', function () {

    beforeEach(function (done) {
      var self = this;

      self.documentor._formatData(_.jsonClone(docData), function (err, data) {
        self.original = data;
        self.clone    = _.jsonClone(data);

        done(); 
      });
    });

    it('Should execute callback with rendered tmpl.', function (done) {
      this.documentor._render(this.clone, function (err, doc) {
        assert.equal(docStr, doc);
        done();
      });
    });

  });


  /* ---------------------------------------------------------------------------
   * render()
   * -------------------------------------------------------------------------*/

  describe('render()', function () {

    it('Should execute callback with rendered tmpl.', function (done) {
      this.documentor.render(function (err, doc) {
        assert.equal(docStr, doc);
        done();
      });
    });

  });

});