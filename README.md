node-express3-mvc
=================

This is a boilerplate node.js application working with express v3, mongoose, mongoDB and everyauth, 
illustrating mvc features used in web development. 
The demo app has a frontend and a backend to manage users and others.
It is possible to use signin using google, facebook, twitter, github and simple registrations. 
The backend has a simple CRUD section for users, the only object implemented on this demo.
Sending email is available too.

**Note:** You need to have node.js and mongodb installed and running

## Install
```sh
$ git clone git://github.com/physalix/node-express3-mvc.git
$ npm install
```

Import the database

```sh
$ sh data/importToMongo.sh
```

**NOTE:** Do not forget to update your application parameters in : 
  * `config/app.js`
  * `config/database.js`
  * `config/mailer.js`
  * `config/security.js`

## Quick start
Start the server:
```
$ node app
```

Then visit [http://localhost:3000/](http://localhost:3000/) for the frontend and [http://localhost.admin:3000/](http://localhost.admin:3000/) for the backend

## Directory structure
```
-app.js
-bootstrap.js
-apps/
  |__backend/
  |____controllers/
  |____views/
  |______includes/
  |______layouts/
  |__frontend/
  |____controllers/
  |____views/
  |______includes/
  |______layouts/
  |__models/
  |______user.js
  |__emails/
  |______test.html
  |______test.txt
-config/
  |__app.js			 (apps config)
  |__database.js (db config)
  |__mailer.js 	 (mailer config)
  |__security.js (auth config)
-data/
  |__importToMongo.sh
  |__users.json
-lib/
  |__auth-handler.js 	(authentication lib)
  |__db-connect.js 		(database lib)
  |__error-handler.js (errors lib)
  |__helpers.js 			(helpers lib)
-public/
  |__css/
  |__images/
  |__js/
```

If you are looking for a specific feature, please use the issue tracker. I will try to come
up with a demo as earliest as I can. Please feel free to fork and send updates :)

## Features
  * Express v3 implementation [Express](http://github.com/visionmedia/express.git)
  * Authentication with [Everyauth](http://github.com/bnoguchi/everyauth)
  * Send email with [Phx-mailer](http://github.com/physalix/phx-mailer.git)
  * HTTP helpers (redirection, caching, etc)
  * Environment based configuration

## TODO
  * Unit testing
  * Mailer implementation
  * Images management

---

## License
(The MIT License)

Copyright (c) 2012 [Physalix](www.physalix.com) < [fs@physalix.com](mailto:fs@physalix.com) >

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.