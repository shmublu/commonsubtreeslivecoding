var actualSynthesisBackend = require('live-backend-nfn5')
var parseExamples = actualSynthesisBackend.parseExamples
var writeExamples = actualSynthesisBackend.writeExamples
var reeval = actualSynthesisBackend.reeval
var updateCodeEvalJS = actualSynthesisBackend.updateCodeEvalJS

function parseResponse(up_code, up_examples, res, trigger, cursorPos){
  //possible triggers {'live code eval', 'window lost focus pbe', 'equal eval', 'newline pbe', 'changed input eval'}
  if(trigger == 'live code eval' || trigger == "equal eval" || trigger == "changed input eval"){
    console.log('in eval')
    if (res.newExamples != null) {//eval sucess
      var up = {
        change: 'reeval',
        code: up_code,
        examples: writeExamples(res.newExamples),
        fixCursor: ((trigger == 'changed input eval') ? cursorPos : null)
      }
    }else{//eval error
      var up = {
        change: 'code eval error',
        code: up_code,
        examples: up_examples,
        fixCursor: ((trigger == 'changed input eval') ? cursorPos : null)
      }
    }
  }
  else{ //trigger == 'pbe'
    console.log('in pbe')
    if (res.newCode != null && res.newCode != up_code) {//pbe success
      var up = {
        change: 'pbe',
    		code: res.newCode,
    		examples: up_examples
      }
    }else  if (res.newExamples === null && res.newCode == up_code){//pbe failed (res.newExamples === null && res.newCode == up_code)
      var up = {
        change: 'pbe synth error',
        code: up_code,
        examples: up_examples,
        pbeStatus: "pbe synthesis failed, please try new examples"
      }
    }
    else{
      var up = {
        change: 'pbe no change',
        code: up_code,
        examples: up_examples,
      }
    }
  }
  return up
}

function saveData(csvPath, logPath, timestamp, active_window, eval_or_pbe, change_tag, success_tag, post_trigger, incoming_code, incoming_examples, outcoming_code, outcoming_examples)
{
  var appendingToLog = `@${timestamp} ${post_trigger} request was received in ${active_window}.
    incoming code:
    ${incoming_code}incoming_examples:
    ${incoming_examples}
    performed ${eval_or_pbe} with ${success_tag}.
    status: ${(change_tag == 'no change') ? 'no change' : 'user program updated with ' + change_tag}.
    outcoming code:
    ${outcoming_code}outcoming_examples
    ${outcoming_examples}\n\n`;

  fs.appendFile(logPath, appendingToLog, function (err) {
      if (err) throw err;
      //console.log('The log was appended to file!');
  });
  var appendingData = [
    {
    'Timestamp' : timestamp,
    'Active_Window' : active_window,
    'Eval_or_PBE' : eval_or_pbe,
    'Change_Tag' : change_tag,
    /*'Changed_Content' : changed_content,*/
    'Success_Tag' : success_tag
    }
  ]
  var readyCSV = json2csv.parse(appendingData, {field: csvFields, header: false}) + newLine
  fs.appendFile(csvPath, readyCSV, function (err) {
    if (err) throw err;
    //console.log('The "data to append" was appended to file!');
  });
}
module.exports = {saveData, parseResponse, updateCodeEvalJS, parseExamples, reeval};