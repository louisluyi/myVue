/**
 * Created by luyi on 2016/1/8.
 */
Event.prototype.getTarget = function(){
    return this.target || this.srcElement;
}
Event.prototype.getRelatedTarget = function(){
    return this.relatedTarget || this.fromElement || this.toElement;
}

var DOM = {
    contains:function(node1, node2){
        if(!node1 || !node2) return false;
        if(node1.nodeType !== 1) return false;
        return node1 === node2 || DOM.contains(node1, node2.parentNode);
    }
}