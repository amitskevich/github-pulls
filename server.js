const app = require('./app');

//set the api port
app.set('port', 3003);

app.listen(app.get('port'), () => {});