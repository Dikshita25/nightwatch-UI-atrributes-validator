const { readDataFromFS } = require('../utils');

module.exports = class ValidateBaseline {
  async assertTest(elementConfig) {
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
      Object.keys(elementConfig.attributes).forEach((attributeKey) => {
        this.api.verify.equal(result.value[attributeKey], elementConfig.attributes[attributeKey], `Matching ${attributeKey} to be ${elementConfig.attributes[attributeKey]} for ${elementConfig.text}`);
      })
    });
  };

  async command(baselineFileName, cb) {
    const baselineFilePath = require('path').resolve(process.cwd(), this.api.globals.baselineDirPath, baselineFileName);

    const elementsConfig = await readDataFromFS(baselineFilePath);
    elementsConfig.forEach((elementConfig) => {
      this.assertTest(elementConfig)
    });
    return null;
  }
}
