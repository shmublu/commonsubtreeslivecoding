//TODO:
//-change the splitting functionality so we aren't relying on splitCharacter
//-change array passed by patternFinder into a JSON object
//-fix glitch where an operation at the end of a pattern causes it to end one repitition early
const splitCharacter = "^%G8hd";
var commonSubtree = require('live-backend-nfn5/javascript/parsers/common_subtree.js')

var ast_cleaner = function smt_parser(input) {
    commonSubtree(input);
    return input;
    //input needs to be converted to infix, then deParen'd, then patternFinder to find the patterns,
    // then repeatSplicer will condense the string
    var inputTreeString = deParen(infixConverter(input));
    var patterns = patternFinder(inputTreeString); //in format [pattern, lengthOfModelPattern, startingIndex, timesRepeated]
    console.log(input);
    var x = treeBuilder(shuntingYard(repeatSplicer(inputTreeString, patterns)));
    return x;
  }

function repeatSplicer(treeString, patternsArray) {
    var splitString = treeString.split(splitCharacter);
    var shorteningFactor = 0;
patternsArray.forEach(element => {
    var length = element[1];
    var patternStartIndex = element[2];
    var timesRepeated = element[3];
    var repeatOperator = element[0].pop();
    splitString.splice(patternStartIndex - shorteningFactor, (length * timesRepeated),["repeat", element[0], timesRepeated, repeatOperator], repeatOperator);
    shorteningFactor += (length * timesRepeated) - 2;
});
return splitString;
}
function shuntingYard(infixArray) {
    //converts infix array to postfix array, based on operator precedence in getOperatorPrecedence()
    var postFix =[];
    var tempStack = []
    infixArray.forEach(element => {
        if(isOperator(element)) { 
            if(tempStack.length==0 || (getOperatorPrecedence(tempStack[tempStack.length-1]) < getOperatorPrecedence(element))) {
                tempStack.push(element);
            }
            else {
                while(tempStack.length > 0 && (getOperatorPrecedence(tempStack[tempStack.length-1]) >= getOperatorPrecedence(element))) {
                    postFix.push(tempStack.pop());
                }
                tempStack.push(element);
            }
        }
        else {
            postFix.push(element);
        }
    })
    while(tempStack.length > 0) {
        postFix.push(tempStack.pop());
    }
    return postFix;
}
function treeBuilder(postfixArray) {
    var tree =[];
    var tempStack = []
    postfixArray.forEach(element => {
        if(isOperator(element)) {
            var right = tempStack.pop();
            var left = tempStack.pop();
            var combinedNodes = [element, left, right];
            tempStack.push(combinedNodes);
        }
        else {
            var elementPush = element;
            if(Array.isArray(element)) {
                elementPush = repeatNodeParser(element);
            }
            tempStack.push(elementPush);
        }
    })
    return tempStack.pop();
}

function repeatNodeParser(element) {
    if(element[3].valueOf() == "str.++") {
        //it is a string repeat
        
        var patternIntoTree = treeBuilder(shuntingYard(element[1]));
        var newNode = [element[0], patternIntoTree, element[2]];
        return newNode;

    }

}

function patternFinder(expression) {
    //using ^ as the split character because spaces needed in string-definitely fix this later
    var returnArray = [];
    var split_expression = expression.split(splitCharacter);
    for(i = 0; i < split_expression.length - 1; i++) {
        if(!isOperator(split_expression[i])) {
        for(j = 1; j < split_expression.length / 2; j++) {
            var testPattern = split_expression.slice(i, i + j);
            var testPatternLength = testPattern.length;
            var timesRepeated = 0;
            for(k = i + j + testPatternLength; k <= split_expression.length; k = k + testPatternLength) {
                var testedSubstring = split_expression.slice(i + j, k);
                var repeated = new Array(testedSubstring.length / testPatternLength).fill(testPattern).flat();
                if(JSON.stringify(testedSubstring) === JSON.stringify(repeated)) {
                    
                    timesRepeated= 1 + testedSubstring.length / testPatternLength;
                }
                else {
                    k = split_expression.length + 2;
                }
            }
            if(timesRepeated > 0) {
               console.log("This pattern: " + (testPattern) + " of length " + testPatternLength+ " starting at index " + i + " repeats " + timesRepeated + " times.");
                returnArray.push([testPattern, testPatternLength,i, timesRepeated]);
                i+= (testPatternLength * (timesRepeated)) - 1;
                 j = 1;
                 break;
            }
            else {

            }
            
           
            
        }
    }
    }
    return returnArray;
}

function infixConverter(tree) {
    var s  = "";
    if(Array.isArray(tree)) {
        if(!isOperator(tree[0])) {
            if(tree[0]=="str.at") {
             //   console.log(tree[1] + "[" + tree[2] + "]");
                return tree[1] + "[" + tree[2] + "]";
            }
            return tree[0];
        }
        else {
            //using ^ instead of spaces for pattern finding purposes
            return "(" + infixConverter(tree[1]) + splitCharacter + tree[0] + splitCharacter + infixConverter(tree[2]) + ")";
        }
    }
    else {
        return tree; }}
function deParen(expression_string1) {
    expression_string= String(expression_string1);
    if(expression_string==null) {
        return null;
    }
    //returns a de-parenthesized string if we only have addition, subtraction, and concat, otherwise returns false
   else if(expression_string.includes("*") || expression_string.includes("/") ) {
        return expression_string;
    }
    else{
        new_string = expression_string.replace("(", "");
        while(new_string.includes(")")) {
            new_string = new_string.replace(")", "");
        }
        while(new_string.includes("(")) {
            new_string = new_string.replace("(", "");
        }
        return new_string;
    }

}
function isOperator(value) {
    if(value.valueOf() == "+" || value.valueOf() == "-" || value.valueOf() == "*" || value.valueOf() == "/" || value.valueOf() == "str.++") {
        return true;
    }
    return false;
}
function getOperatorPrecedence(value) {
    if(value.valueOf() == "*" || value.valueOf() == "/") {
        return 3;
    }
    else if(value.valueOf() == "+" || value.valueOf() == "-" ||value.valueOf() == "str.++") {
        return 1;
    }
}
  module.exports = ast_cleaner