/**
* @author Rafael Vidaurre
* @requires Utils
*/

'use strict';

var _ = require('lodash');
var utils = require('./utils');

/**
* Is the product of a Task being built, contains status data, the main method of the task and other,
* stuff required for it to be run
* @class
*/
function BuiltTask (main, params) {
  /**
  * Parameters which will be used by its main method
  */
  this.params = params;

  /**
  * Main method to be run
  */
  this.main = main;

  /**
  * Number of retries performed by the built task
  */
  this.retries = 0;
}

/**
* @class
*/
function Task () {
  /**
  * The main method of the Task
  * @private
  */
  this._main = null;

  /**
  * Set of hooks for the task, defined at setup time
  * @private
  */
  this._hooks = {};

  /**
  * Task's builder method, by default will instantiate the task once with empty parameters
  * @private
  */
  this._builder = function () {return {};};
}

/**
* Executes the build function and builds
*/
Task.prototype._build = function () {
  
};

/**
* Sets main task's method
* @param {function} mainMethod main task method, this contains the scraping logic that makes a task
* unique
*/
Task.prototype.main = function (mainMethod) {
  if (!_.isFunction(mainMethod)) throw new Error('Main method must be a function');
  this._main = mainMethod;

  return this;
};

/**
* Sets the task hooks, which will be called at specific points of the task's execution
* @param {object} hooksObj key-value pairs which define the task hooks
*/
Task.prototype.hooks = function (hooksObj) {
  var _this = this;

  var hookKeys, slotIsArray, hookSlot;
  if (!_.isObject(hooksObj) || _.isArray(hooksObj)) {
    throw new Error('Hooks parameter must be an object');
  }

  // Add new hooks to _hooks object and initialize new keys
  hookKeys = _.keys(hooksObj);
  _.each(hookKeys, function (hookKey) {
    hookSlot = _this._hooks[hookKey];
    slotIsArray = _.isArray(hookSlot);

    if (!slotIsArray) {
      _this._hooks[hookKey] = [];
      hookSlot = _this._hooks[hookKey]; // Reassign variable (because it was pointing to undef)
    }

    hookSlot.push(hooksObj[hookKey]);
  });

  return this;
};

/**
* Sets the task's builder method overriding its default building behaviour
* @param {function} builderMethod method which defines task's building logic, if the builder returns
* an array, the task will be instanced once for every element in the array, passing each element in
* it as a parameter to its corresponding task
*/
Task.prototype.builder = function (builderMethod) {
  if (!_.isFunction(builderMethod)) throw new Error('Builder must be a function');

  this._builder = builderMethod;
  return this;
};

module.exports = Task;
