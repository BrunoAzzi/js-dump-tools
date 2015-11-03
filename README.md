[ ![Codeship Status for brunoazzi/js-dump-tools](https://codeship.com/projects/74c87c30-5fa7-0133-f1bb-4e587625a674/status?branch=master)](https://codeship.com/projects/111855)

The production version (master branch build) is runnig in http://js-dump-tools.herokuapp.com .

# Instalation

If you dont have node.js you can download [here](https://nodejs.org/en/).

Then just run:
```
npm install
```

## Usage
Start the local server:
```
npm start
```
Then go to http://localhost:8000/app/index.html

The App expects the correct dump with no quotes and `;` as csv delimiter. It must have the oid, pid, uid, quantity, price and sku columns;

### Features to be developed
- csv - json converter;
- dump test;
- dump clean;
  - auto filter the dumps to have the same date interval ✅
  - a selector to the user delimit the date interval
- diff reports;
  - a diff chart (number of orders by day) ✅
- html reports exporter;
- jenkins publisher;


### What could have in the report:
 - Total of orders;
  - Quantity of orders; ✅
  - Amount of Orders;
 - Diference between orders;
  - Diference of amount;
  - Diference of quantity; ✅
