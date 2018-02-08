/**
 * priority-promise
 * Promise with Priority
 * Created by vincent on 2018/02/07.
 *
 * import PriorityPromise from 'priority-promise';
 * let target = Promise.resolve();
 * new PriorityPromise(target)
 * .then(()=>{
 *    console.log('Priority 0');
 *  }, null, 0)
 * .then(()=>{
 *    console.log('Priority 1');
 *  }, null, 1)
 * .then(()=>{
 *    console.log('Priority -1');
 *  }, null, -1);
 *
 *  // Priority 1
 *  // Priority 0
 *  // Priority -1
 *
 */
function PriorityPromise(target){
  if (!(this instanceof PriorityPromise)){
    return new PriorityPromise(target);
  }
  this.mThenQueue = [];
  var _this = this;
  this.promise = target.then(function(data, error){
    var promise = new Promise((resolve, reject)=>error?reject(error):resolve(data));
    var callback = function(listener){
      promise = promise[listener.type].apply(promise, listener.params);
    };
    _this.mThenQueue.forEach(function(priorityObj){
      priorityObj.then && priorityObj.then.forEach(callback);
      priorityObj.catch && priorityObj.catch.forEach(callback);
      priorityObj.finally && priorityObj.finally.forEach(callback);
    });
    return promise;
  })
};
PriorityPromise.prototype.$addQueue = function $addQueue(type, params, priority=0){
  var find = false;
  var listener = {type: type, params: params};
  var priorityObj;
  for(var i=0, l=this.mThenQueue.length; i<l; i++){
    priorityObj = this.mThenQueue[i];
    if(priority >= priorityObj.priority){
      if(priority > priorityObj.priority){
        priorityObj = {priority: priority};
        this.mThenQueue.splice(i, 0, priorityObj); // insert priorityObj at i
      }
      if(!priorityObj[type]){
        priorityObj[type] = [listener];
      }else{
        priorityObj[type].push(listener);
      }
      find = true;
      break;
    }
  }
  if(!find){
    priorityObj = {priority};
    priorityObj[type] = [listener];
    this.mThenQueue.push(priorityObj);
  }
};
PriorityPromise.prototype.then = function(onFulfilled, onRejected, priority){
  if(typeof onRejected == 'function'){
    this.$addQueue('then', [onFulfilled, onRejected], priority);
  }else{
    this.$addQueue('then', [onFulfilled, undefined], priority || onRejected);
  }
  return this;
};
PriorityPromise.prototype.catch = function(onRejected, priority){
  this.$addQueue('catch', [onRejected], priority);
  return this;
};
PriorityPromise.prototype.finally = function(onFinally, priority){
  this.$addQueue('finally', [onFinally], priority);
  return this;
};
module.exports = PriorityPromise;
