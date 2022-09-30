const { readDataFromFS } = require('../utils');
const Events = require('events');

module.exports = class GetBaselineAttributes extends Events {
  async getElementAttributes(elementConfig) {
    return new Promise((resolve) => {
      this.api.execute(function(elementConfig) {

        let elements;
  
        // get element using xpath
        const getElementByXpath = function(xpathToExecute){
          const result = [];
          const nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
          for ( let i=0 ; i < nodesSnapshot.snapshotLength; i++ ){
            result.push( nodesSnapshot.snapshotItem(i) );
          }
          return result;
        };
  
        if(elementConfig.selector) {
          // get element using xpath
          elements = getElementByXpath(elementConfig.selector);
        } else if(elementConfig.tag && elementConfig.text) {
          // get unique element using tag and text
          const tagRelatedElements = document.getElementsByTagName(elementConfig.tag);
          elements = [...tagRelatedElements].filter((tagRelatedElement) => { 
            return tagRelatedElement.innerText.trim() === elementConfig.text;
          });
        }
  
        if(elements.length) {
          // get attribute value
          const computedStyle = window.getComputedStyle(elements[0], null);
          return Object.keys(elementConfig.attributes).reduce((acc, attributeKey) => {
            acc[attributeKey] = computedStyle.getPropertyValue(attributeKey);
            return acc;
          }, {});
        }
        return {};
      }, [elementConfig], (result) => {
        resolve({
          actual: {
            attributes: result.value
          },
          expected: elementConfig
        })
      });
    })
  };

  processElementsConfig(elementsConfig, cb) {
    const promises = elementsConfig.map((elementConfig) => {
      return this.getElementAttributes(elementConfig)
    })

    Promise.all(promises).then((allAttributes) => {
      if(cb) {
        cb.call(this.api, {status: 0, value: allAttributes});
      }
      this.emit('complete', {status: 0, value: ''});
    }).catch((e) => {
      this.emit('error', e);
    })
  }

  command(baselineInput, cb) {
    if (typeof baselineInput === 'string') {
      const baselineFilePath = require('path').resolve(process.cwd(), this.api.globals.baselineDirPath, baselineInput);

      readDataFromFS(baselineFilePath).then((baseline) => {
        this.processElementsConfig(baseline, cb);
      })
    } else {
      const input = Object.prototype.toString.call(baselineInput) === '[object Array]' ? baselineInput : [baselineInput];

      this.processElementsConfig(input, cb);
    }
  }
};
