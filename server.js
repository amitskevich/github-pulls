const app = require('./app');

//set the api port
app.set('port', 3000);

app.listen(app.get('port'), () => {
});