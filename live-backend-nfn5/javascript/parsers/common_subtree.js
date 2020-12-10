
const v8 = require('v8');
const structuredClone = obj => {  return v8.deserialize(v8.serialize(obj));};
var treeDupes = function treeDuplicate(tree) {
    if(!Array.isArray(tree)) {return tree;}
    else {
        var n = turnArrayToTree(tree);
        var c = getTreePermutations(n);
        console.log(c);
      //  console.log(c);
    }
}
function getTreePermutations(convertedTree) {
    //outputs  list of node possibilities, of which the original node is the head node of all of them
    var root = structuredClone(convertedTree);
    var data = root.data;
    if(root.listOfChildren!=null) {    
    var permutationList = [];
    var childList = structuredClone(root.listOfChildren);
    for(i = 0; i < childList.length; i++) {
        if(childList[i].listOfChildren!=null){
        var childList2 = replaceGivenIndex(childList, i, new Node(" ", null, true));
        permutationList.push(new Node(data, childList2, false));
        }
    }
    for(i = 0; i < childList.length; i++) {
        var child = childList[i];
        if(!child.isLeaf)  {
        var childPermutationsList = getTreePermutations(child);
        if(childPermutationsList!=null){
        for(j = 0; j <childPermutationsList.length; j++) {
            if(childPermutationsList[j] !=null && child.listOfChildren!=null) {
            var childList2 = replaceGivenIndex(childList, i, childPermutationsList[j]);
            permutationList.push(new Node(data, childList2, false));
            }
        }
    } } } 
    return permutationList; }
    else {
        return null;
    }
}

function turnArrayToTree(tree) {
        if(!Array.isArray(tree)) {
        return new Node(tree, null, false);
    }
    else {
        var listOfKids = []; 
        for(i = 1; i < tree.length; i++) {
            var tNode = turnArrayToTree(tree[i]);
             listOfKids.push(tNode);
        }
        if(listOfKids.length < tree.length -1) {
            var tNode = turnArrayToTree(tree[tree.length-1]);
             listOfKids.push(tNode);
        }
        
        return new Node(tree[0], listOfKids, false);
            }
}

class Node {
     data;
     listOfChildren = null;
     isPlaceholder=false;
    constructor(data,listOfChildren, isPlaceholder) {
        this.data= data;
        this.listOfChildren=listOfChildren;
        this.isPlaceholder =isPlaceholder;
    }
    isLeaf() {
        if(this.listOfChildren==null || this.listOfChildren==[]) {
            return true;
        }
        return false;
    }
    get listOfChildren() {
        return this.listOfChildren;
    }
    get data() {
        return this.data;
    }
}
function replaceGivenIndex(array, index, value) {
  returnArray = [];
  for(i = 0; i < array.length; i++) {
 		if(i==index) {
    returnArray[i]=value;
    }
    else {
    returnArray[i]= array[i];
    }
  }
  if(returnArray.length==0) {
         }
  return returnArray;

}


  module.exports = treeDupes