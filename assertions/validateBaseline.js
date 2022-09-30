const eventEmitter = require('../utils/eventEmitter');

exports.assertion = function(baselineInput) {
  this.retryAssertionTimeout = 0;
  this.rescheduleInterval = 50;

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
     const message = `Testing if the baseline attributes are matching the actual page attributes`

     return {
       message,
       args: []
     }
   };

  /**
    * Returns the expected value of the assertion which is displayed in the case of a failure
    *
    * @return {string}
    */
   this.expected = function() {
     return this.negate ? `is not '${expectedText}'` : `matched`;
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
     return passed ? `matched` : `does not matched`;
   };

  /**
    * The command which is to be executed by the assertion runner; Nightwatch api is available as this.api
    * @param {function} callback
    */
  this.command = function(callback) {
    let testStatus = true;
    const unprocessedElementIds = [];

    eventEmitter.on('validating-baseline-element', (response) => {
      if (response.elementId) {
        unprocessedElementIds.splice(unprocessedElementIds.indexOf(response.elementId), 1);

        if (!response.passed) {
          testStatus = false;
        }

        if (!unprocessedElementIds.length) {
          callback({
            value: testStatus
          });
        }
      }
    });

    this.api.getBaselineAttributes(baselineInput, (result) => {
      result.value.forEach((item, index) => {
        const elementId = `${index}-baselineElement`;

        unprocessedElementIds.push(elementId);

        this.api.verify.validateElementAttributes(item, elementId);
      })
    })
  };
};
