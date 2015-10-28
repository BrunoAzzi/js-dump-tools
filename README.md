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

The App expects the correct dump with no quotes and `;` as csv delimiter.

### Features to be developed
- csv - json converter;
- dump test;
- dump clean;
  - filter the dumps to have the same date interval ✅
- diff reports;
- html reports exporter;
- jenkins publisher;


### What could have in the report:
 - Total of orders; 
  - Quantity of orders; ✅
  - Amount of Orders;
 - Diference between orders;
  - Diference of amount;
  - Diference of quantity; ✅
