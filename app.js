var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var app = express()
const tutorialRouter =  require('./routes/tutorial.js');
const indexRouter =  require('./routes/index.js');
app.use('/tutorial', tutorialRouter);
app.use('/', indexRouter);
var dataPath = 'tmp'
var logsPath = dataPath + '/logs'

//csv vars


const port = 8001
app.listen(port);
//console.log('now listening to port ' + port)
var csvFields = ['Timestamp', 'Active_Window', 'Eval_or_PBE', 'Change_Tag', /*'Changed_Content',*/ 'Success_Tag']
var newLine = '\r\n'
var mkdirp = require('mkdirp')
mkdirp(dataPath, function(err) {
    // path exists unless there was an error
    if(err){
      console.log('no' + dataPath)
    }else{
      mkdirp(logsPath, function(err2){
        if(err2){
          console.log('no' + dataPath)
        }else{
          //console.log("csv/logs folder ");
          mkdirp(logsPath+'/p1', function(err2){
            if(err2){
              console.log('no p1')
            }else{
            }
          })
          mkdirp(logsPath+'/p2', function(err2){
            if(err2){
              console.log('no p2')
            }else{
            }
          })
          mkdirp(logsPath+'/p3', function(err2){
            if(err2){
              console.log('no p3')
            }else{
            }
          })
          mkdirp(logsPath+'/p4', function(err2){
            if(err2){
              console.log('no p4')
            }else{
            }
          })
          mkdirp(logsPath+'/p5', function(err2){
            if(err2){
              console.log('no p5')
            }else{

            }
          })
        }
      })
    }
});

//app.use('/assets', express.static('assets'))
app.set('view engine', 'ejs')
app.use(cookieParser());

app.use(function (request, response, next) {
  // check if client sent cookie
  var cookie = request.cookies.uCookie;
  if (cookie === undefined)
  {
    // no: set a new cookie
    var randomNumber = Math.random().toString();
    randomNumber = randomNumber.substring(2,randomNumber.length);
    response.cookie('uCookie',randomNumber);
    //console.log('cookie created successfully');
  }
  else
  {
    // yes, cookie was already present
    //console.log('cookie exists', cookie);
  }
  next(); // <-- important!You can achieve this by using ajax and history.pushState( ) function.
});
// let static middleware do its job
app.use(function (request, response, next){
	var userFolder = dataPath +'/' + request.cookies.uCookie
  if(userFolder !== undefined){
		mkdirp(userFolder, function(err) {
			//path exists unless it don't
		})
	}
	next();
});
app.use('/assets', express.static('assets'))


