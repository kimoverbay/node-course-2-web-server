const express = require('express');
const hbs = require('hbs'); //handlebars hbs is a view engine for express
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs'); //key value pair to set view engine of app

app.use((request, response, next) => { // registering a handler down below... next is to tell express when middleware is done
                                        // can have lots of middleware registered to a single express app
                                        // if we do something asynchronously, the middleware will not move on until 
                                        // we call next to let it know we're ready
    var now = new Date().toString();
    var log = `${now}: ${request.method} ${request.url}`;
    fs.appendFile('server.log',log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server log.')
        }
    });
    console.log(log);
    next(); 
});

// under maintenance block. app.use '/public' has to come after this to impact static pages.
// app.use((request, response, next)=> {
//     response.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
    // return 'test';
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//register a handler .. set up a route
app.get('/',(request, response) => { //url, what to run... / is root route :)
    // response.send('<h1>hello express</h1>');
    response.render('home.hbs',{
        name: 'Kimmy',
        likes: [
            'Abby Dog',
            'Horses',
            'World Peace'],
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to the home page!',
    });
});

app.get('/about', (request, response)  => {
   // response.send('About page');
   response.render('about.hbs', {
        pageTitle: 'About Page',
   });
});

app.get('/bad', (request, response) => {
    response.send({
        errorMessage: 'Unable to fulfill request'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
}); //3000 is a common port for developing locally. binding the port, will listen for requests until we tell it to stop

