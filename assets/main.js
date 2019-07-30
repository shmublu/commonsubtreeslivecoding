$(document).ready(function(){
  //codemirror orginall from cm.js
  var codeArea = $("#up_code")[0]
  var editor = CodeMirror.fromTextArea(codeArea, {
    lineNumbers : true,
    mode : "javascript"
  })
  editor.on('inputRead', function(editor, change){
    //console.log('gotcode')
    var doc = editor.getDoc()
    sendPost(doc)
    console.log('inputread event')
  })

  $('#up_examples').change(function(){
     console.log('gotex')
     console.log(editor)
     var doc = editor.getDoc()
     sendPost(doc)
   })
   //triggers
   // $('#up_code').on('input',function(editor){
   //    console.log('gotcode')
   //    sendPost()
   //  })
   //  $('#up_examples').change(function(editor){
   //     console.log('gotex')
   //     sendPost()
   //   })
})
