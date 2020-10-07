var express = require('express')
var fs = require('fs')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var dataPath = 'tmp'
const router = express.Router();
router.use(cookieParser());
var parse = require('../test_modules/parsingFunc')
router.get('/', function(request, response){
	var start_code = ''
	var start_examples = ''
	var up = {
		code: start_code,
		examples: start_examples,
	}
	response.render('livedefault', {up: up});

})

router.post('/', urlencodedParser, function(request, response){
	console.log('request (post) was made: ' + request.url);
  var parsedProgram = JSON.parse(request.body.user_program)
	var up_code = parsedProgram.up_code
	var up_examples = parsedProgram.up_examples
  var trigger = parsedProgram.trigger //'pbe' or 'eval'
  var cursorPos = parsedProgram.cursorPos

	//savefiles in hidden folder tmp
	var userFolder = dataPath + '/' + request.cookies.uCookie + '/'
	fs.writeFileSync(userFolder + 'code.js', up_code)
	fs.writeFileSync(userFolder + 'code.js.examples', up_examples)
  var path = userFolder +'code.js.sl'

  //reeval/pbe
  var res = parse.updateCodeEvalJS(up_code, parse.parseExamples(up_examples.trim()), path)
  var up = parse.parseResponse(up_code, up_examples, res, trigger, cursorPos)
	response.send(up);
});


module.exports = router;