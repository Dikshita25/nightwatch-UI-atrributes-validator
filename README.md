### Validate UI attributes using NightwatchJS
This package allows you to validate the UI attributes against baseline using NightwatchJS.

### What is a baseline?
A baseline is a simple JSON file that will have different elements and their attributes that we you would like to validate. You can create multiple baseline files according to your need.

A typical example of a baseline file
`homepage.json`
```
[
  {
    "tag": "h2",
    "selector": "//h2[contains(text(),'HELPING MILLIONS OF SMILES')]",
    "text": "HELPING MILLIONS OF SMILES",
    "attributes": {
      "font-family": "\"Open Sans\", sans-serif",
      "font-weight": 800,
      "color": "rgb(22, 68, 107)",
      "font-size": "48px",
      "line-height": "52px",
      "letter-spacing": "normal",
      "text-transform": "uppercase",
      "display": "block"
    }
  },
  {
    "tag": "a",
    "selector": "//a[@id="tryItOn]",
    "text": "Try it On",
    "attributes": {
      "font-family": "\"Open Sans\", sans-serif",
      "font-weight": 800,
      "color": "rgb(22, 68, 107)",
      "font-size": "24",
      "line-height": "32px",
      "letter-spacing": "normal",
      "text-transform": "lowercase",
    }
  }
]
```
* This package identifies elements using either of the 2 approaches
1. By passing a unique text
```
[
  {
    "tag": "h2",
    "text": "HELPING MILLIONS OF SMILES",
    "attributes": {
      "font-family": "\"Open Sans\", sans-serif",
      "font-weight": 800,
    }
  },
]
```
**Note:** In the above example `HELPING MILLIONS OF SMILES` is an unique text on the screen

2. By passing the exact xpath of the element
```
[
    {
    "tag": "a",
    "selector": "//a[@id="tryItOn]",
    "text": "Try it On",
    "attributes": {
      "font-family": "\"Open Sans\", sans-serif",
      "font-weight": 800,
    }
  }
]
```
**Note:** In the above example, the selector of an element has been defined. Also if both text and selector is provided for an element, preference is given to the selector of the element. 

### Configuration
1. Install the package using command: 
```
npm install nightwatch-UI-atrributes-validator
```

2. Add custom command to the configuration of `nightwatch.conf.js`. You can refer the [link](https://nightwatchjs.org/guide/configuration/)

```
  custom_commands_path: [
    './node_modules/nightwatch-UI-atrributes-validator/commands'
  ]
```

3. Lastly pass the path of the baseline folder to the configuration, under the `nightwatch.conf.js`
```
  globals: {
    baselineDirPath : "./baseline",
  }
```

### Usage
To use the above, we simply need to use the custom command `validateBaseline` and it accepts 1 parameter.
1. fileName of the baseline

```test.js
describe('Verify the UI attributes of homepage', function() {
  it('Verify the UI attributes for 414 screen', function(browser) {
    browser
      .url('https://example.com/')
      .validateBaseline("homepage.json")
      .end();
  });
});
```
**Here:** In the above example `homepage.json` is file under `baseline` folder.

### Output
You can choose the kind of reports you need, by using nightwatch provided reporters.[Here's](https://nightwatchjs.org/guide/overview/what-is-nightwatch.html) a for reference. 

**Note:** This package works with NightwatchJS & NightwatchJS with CucumberJS integration too :)

