# graflow
Work flow tool for GraphQL developers

- Use to compare two GraphQL Schema, show there differences.

- Referred to [graphql-schema_comparator (Ruby)](https://github.com/xuorig/graphql-schema_comparator), translate it to JavaScript. 

- A few adaptive changes.

## Getting started

``` bash
# install dependencies
npm install

# install nodemon to hot reload
npm install nodemon -g

# serve with hot reload at localhost:3000
# already changed the config in package.json
npm start
# otherwise
nodemon start
```

## Use it
Compare JSON in browser page
- [Preview](http://193.112.47.78/)
- http://localhost:3000

Calling interface to compare
- request http://localhost:3000/api/compare
- it receive two params: `oldSchema`, `newSchema`
- `oldSchema`, `newSchema` are graphql schmea JSON Object, not JSON String

Use in your code
- require or import
``` javascript
// check the right path in your code
const { Schema, Result } = require('src/schema-comparator');

// use import 
import { Schema, Result } from 'src/schema-comparator';
```

- get changes result
``` javascript
// get changes of two Schema
let changes = new Schema(newSchema).diff(new Schema(oldSchema));

// filter change info and get result
let result = new Result(changes).getResult();
```

