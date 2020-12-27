const cloneDeep = require('lodash.clonedeep')
const v8 = require('v8');
const structuredClone = obj => {  return v8.deserialize(v8.serialize(obj));};
var treeDupes = function treeDuplicate(tree) {
    if(!Array.isArray(tree)) {return tree;}
    else {
        var n = turnArrayToTree(tree);
        var nList = getAllLevelPerms(n);

      console.log(findPlaceholderLocation(nList[2]));
    }

    return tree;
}

function treePermsAtLevel(nodedTree1, sdepth) {
    var nodedTree = structuredClone(nodedTree1);
    if(nodedTree==null) {
        return null;
    }
    else if(nodedTree.depth > sdepth) {
        return null;

    }
    else if(nodedTree.depth < sdepth) {
        var list = new Array()
        if(nodedTree.listOfChildren!=null) {
            for(i = 0; i < nodedTree.listOfChildren.length; i++) {
                var p = structuredClone(nodedTree.listOfChildren);
                var childC = treePermsAtLevel(nodedTree.listOfChildren[i], sdepth);
                if(childC!=null) {
                    for(j = 0; j < childC.length; j++) {
                        list.push(childC[j]);
                    }
                }
                nodedTree.listOfChildren= p;
            }
        }
        return list;
    }
    else if(nodedTree.depth== sdepth) {
        if(nodedTree.listOfChildren!=null) {
            var placeholder = structuredClone(nodedTree);
            nodedTree.listOfChildren=null;
            nodedTree.isPlaceholder= true;
            var c = structuredClone(returnRootNode(nodedTree));
            nodedTree.listOfChildren= placeholder.listOfChildren;
            nodedTree.isPlaceholder= false;
            return new Array(c);

        }
        return null;
    }
        
}
function getAllLevelPerms(nodedTree) {
    var listOfPerms = [];
    for(var j = Math.ceil(nodedTree.height /2); j >0; j--) {
     var permLevel = treePermsAtLevel(nodedTree, j);
     listOfPerms =listOfPerms.concat(permLevel)
    }
    return listOfPerms;
}

function returnRootNode(nodedTreeChild) {
    var c = nodedTreeChild;
    while(c.parent!=null){
        c=c.parent;
    }
    return c;
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
        
        var c = new Node(tree[0], listOfKids, false);
        c.setDown(0);
        return c;
            }
}
function postOrder(nodedTree) {
    if(nodedTree==null) {
    }
    else if(nodedTree.listOfChildren!=null) {
        console.log(nodedTree.data + " " + nodedTree.isPlaceholder)
        console.group()
    for(i = 0; i < nodedTree.listOfChildren.length; i++) {
        postOrder(nodedTree.listOfChildren[i]);
    }
    console.groupEnd()
    }
    else {
        console.log(nodedTree.data + " " + nodedTree.isPlaceholder)
    }
    
}

function findPlaceholderLocation(nodedTree) {
    if(nodedTree.isPlaceholder) {
        return -1;
    }
    if(nodedTree.listOfChildren==null || nodedTree==null || nodedTree.data==null) {
        return null;
    }
    console.log(nodedTree)
    for(i = 0; i < nodedTree.listOfChildren.length; i++) {
        var c = findPlaceholderLocation(nodedTree.listOfChildren[i]);
        if(c==null) {
            //do nothing
        }
        else if (c==-1) {
            //was a placeholder!

            return [i];
        }
        else {
            return [i].concat(c);
        }
    }
}

class Node {
     data;
     listOfChildren = null;
     isPlaceholder=false;
     parent = null;
     depth = 0;
     height = -1;
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
    setDown(d){
        this.depth = d;
        if(this!=null && this.listOfChildren!=null) {
        for(i = 0; i < this.listOfChildren.length; i++) {
            this.listOfChildren[i].parent= this;
            this.listOfChildren[i].setDown(d+1);
        }
    }
        else {
            this.height = 0;
            if(this.parent!=null) {
            this.parent.setUp(d);
            }
        }

    }
    setUp(h) {
        var c= (this.depth - h) * -1
        if(c>this.height) {
            this.height=c;
        }
        if(this.parent!=null) {
        this.parent.setUp(h);
        }
    }
    
    get listOfChildren() {
        return this.listOfChildren;
    }
    get data() {
        return this.data;
    }
    get isPlaceholder() {
        return this.isPlaceholder;
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
