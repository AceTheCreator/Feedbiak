//Required Modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const SignupController = require('./controllers/signup');

//Initializations
const app = express();

//Middlewares
app.use(bodyParser.json())
app.use(bodyParser({extended:false}));

//set view engine
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars', exphbs({
    defaultLayout:"main",
}));
app.set('view engine', 'handlebars')
//set static folder
app.use('/public/', express.static(path.join(__dirname,'public')));

//Controllers
app.get('/signup', SignupController);


const PORT = 5000;

app.listen(PORT,()=>{
    console.log(`app now listening to port ${PORT}`)
});