[ ![Codeship Status for brunoazzi/js-dump-tools](https://codeship.com/projects/74c87c30-5fa7-0133-f1bb-4e587625a674/status?branch=master)](https://codeship.com/projects/111855)

The production version (master branch build) is runnig in http://js-dump-tools.herokuapp.com .

# Usage

To use this tools you will need some things:
- The Client Dump in `.csv` format;
- The Platform Dump;
- The JsonToCsvConverter;

### The Client Dump

The Client Dump can be found in the [integration page](http://integracao.chaordic.com.br/), or you can get it with the TAM.

If the client, or you download the dump file in a .xsl or .xsls format you can just open with [libreOffice](https://www.libreoffice.org/download/libreoffice-fresh/) and save as `.csv` file.

### The Platform Dump

You can get The Platform Dump in a bunch of ways, but the easyest is from [s3 web portal](https://console.aws.amazon.com/s3/home?region=us-east-1#&bucket=platform-dumps-virginia&prefix=allBuyOrders/), you just need to sign in with your credentials.

Ok, if you clicked in the link above, now you are in `s3://platform-dumps-virginia/allBuyOrders/`, choose the latest date folder, and them download the <API_KEY>.gz (ex: carrodemola.gz) file that you want;

### The JsonToCsvConverter

In the future this tool will have an option to accept dumps in json, but for now you need to convert the file inside <API_KEY>.gz (ex: carrodemola) in a csv file. You can use the [JsonToCsvConverter](./JsonToCsvConverter) for it, just follow the instructions in the documentation of the tool to install it.

Rename the file to include his extension: carrodemola -> carrodemola.json;

Now you just need to go to the folder of JsonToCsvConverter with terminal and:

```bash
./transactions.py <API_KEY>.json
```

### The real usage

Now just go to http://js-dump-tools.herokuapp.com and fill the forms as the tools asks.

# Instalation

If you dont have node.js you can download [here](https://nodejs.org/en/).

Then just run:
```
npm install
```

## Running localy
Start the local server:
```
npm start
```
Then go to http://localhost:8000/app/index.html

The App expects the correct dump with no quotes. It must have the oid, pid, uid, quantity, price and sku columns;
