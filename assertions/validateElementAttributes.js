const eventEmitter = require('../utils/eventEmitter');

exports.assertion = function({expected, actual}, elementId) {
  this.retryAssertionTimeout = 0;
  this.rescheduleInterval = 50;

  // If the custom commands operates with DOM elements, this options should be set
  // this.options = {
  //   elementSelector: true
  // };

  /**
   * Returns the message format which will be used to output the message in the console and also
   *  the arguments which will be used for replace the place holders, used in the order of appearance
   * 
   * The message format also takes into account whether the .not negate has been used
   *
   * @return {{args: [], message: string}}
   */
  this.formatMessage = function() {
    // Use this.negate to determine if ".not" is in use
    // Example: 
    const message = `Testing if element %s attributes are matching`;

    return {
      message,
      args: [`'${expected.text}'`]
    }
  };

  /**
    * Returns the expected value of the assertion which is displayed in the case of a failure
    *
    * @return {string}
    */
  this.expected = function() {
      return 'matched'
  };

  /**
    * Given the value, the condition used to evaluate if the assertion is passed
    * @param {*} value
    * @return {Boolean}
    */
  this.evaluate = function(value) {
    if (typeof value != 'boolean') {
      return false;
    }

    return value;
  };

  /**
    * Called with the result object of the command to retrieve the value which is to be evaluated
    *
    * @param {Object} result
    * @return {*}
    */
  this.value = function(result) {
    return result.value;
  };

  /**
    * When defined, this method is called by the assertion runner with the command result, to determine if the
    *  value can be retrieved successfully from the result object
    *
    * @param result
    * @return {boolean|*}
    */
  this.failure = function(result) {
    return result === false || result && result.status === -1;
  };

  /**
    * When defined, this method is called by the assertion runner with the command result to determine the actual
    *  state of the assertion in the event of a failure
    *
    * @param {Boolean} passed
    * @return {string}
    */
  this.actual = function(passed) {
    return passed ? 'matched' : 'does not matched';
    //return passed ? `contains '${expectedText}'` : `does not contain '${expectedText}'`;
  };

  /**
    * The command which is to be executed by the assertion runner; Nightwatch api is available as this.api
    * @param {function} callback
    */
  this.command = function(callback) {
    let passed = true;

    // Validation each attribute of an element with the actual attribute; Also incase of failure setting a flag as false
    Object.keys(expected.attributes).forEach((attributeKey, index) => {

      const lastItem = Object.keys(expected.attributes).length - 1 == index;

      this.api.verify.equal(expected.attributes[attributeKey], actual.attributes[attributeKey], `Matching ${attributeKey} to be ${expected.attributes[attributeKey]} ${lastItem ? '\n' : ''}`);

      const equals = expected.attributes[attributeKey] == actual.attributes[attributeKey];

      if(!equals) {
        passed = false
      }
    });

    callback({
      value: passed
    })

    setTimeout(() => {
      eventEmitter.emit('validating-baseline-element', {passed, elementId});
    }, Object.keys(expected.attributes).length * 5)
  };
};
