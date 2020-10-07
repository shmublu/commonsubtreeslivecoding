var express = require('express')
var http = require('http')
var fs = require('fs')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var parse = require('../test_modules/parsingFunc')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var dataPath = 'tmp'
const router = express.Router();
router.use(cookieParser());


router.get('/', function(request, response){
    var problem_name = 'tutorial_'
  
    var description = ''
    var start_code = ''
      var start_examples = ''
    var samples = ''
      var items = fs.readdirSync('./.problems')
      //console.log(items)
  
    //description
    if(items.includes(problem_name +'description.txt')){
          description = fs.readFileSync('./.problems/'+ problem_name +'description.txt', 'utf8')
          //console.log('description has been uploaded')
      }else {
      console.log('we missing:' + problem_name +'description.txt')
    }
    //code
      if(items.includes(problem_name +'code.js')){
          start_code = fs.readFileSync('./.problems/'+ problem_name +'code.js', 'utf8')
          //console.log('code has been uploaded')
      }else {
      console.log('we missing:' + problem_name +'code.js')
    }
    //samples
      if(items.includes(problem_name +'samples.json')){
          var raw_samples = fs.readFileSync('./.problems/'+ problem_name +'samples.json', 'utf8')
      samples = JSON.stringify(raw_samples)
      }else {
      console.log('we missing:' + problem_name +'samples.json')
    }
  
      var data = {
      description: JSON.stringify(description),
          code: start_code,
          examples: start_examples,
      samples: samples
      }
      response.render('livetutorial', {data: data});
  
  })

  router.post('/', urlencodedParser, function(request, response){
    var problem_name = 'tutorial_'
      console.log('request (post) was made: ' + request.url);
    var parsedProgram = JSON.parse(request.body.user_program)
      //grab text bodies
      var up_code = parsedProgram.up_code
      var up_examples = parsedProgram.up_examples
    var trigger = parsedProgram.trigger //'pbe' or 'eval'
    var cursorPos = parsedProgram.cursorPos
  
      //savefiles in hidden folder tmp
      var userFolder = dataPath +'/' + request.cookies.uCookie + '/'
      fs.writeFileSync(userFolder + problem_name +'code.js', up_code)
      fs.writeFileSync(userFolder + problem_name +'code.js.examples', up_examples)
    var path = userFolder +problem_name +'code.js.sl'
  
    var res = parse.updateCodeEvalJS(up_code, parse.parseExamples(up_examples.trim()), path)
    var up = parse.parseResponse(up_code, up_examples, res, trigger, cursorPos)
      response.send(up);
  
  });

module.exports = router;