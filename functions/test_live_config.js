const chai = require('chai');
const assert = chai.assert;

// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');

const env = require('./env.json');
// Require firebase-admin so we can stub out some of its methods.
const admin = require('firebase-admin');

const test = require('firebase-functions-test')({
  projectId: env.projectId,
  databaseURL: env.databaseURL,
}, './key.json');

const functions = require('firebase-functions');

