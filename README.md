# priority-promise

Promise with Priority

## Usage

```js
import PriorityPromise from 'priority-promise';

let target = Promise.resolve();
new PriorityPromise(target)
  .then(()=>{
    console.log('Priority 0');
  }, null, 0)
  .then(()=>{
    console.log('Priority 1');
  }, null, 1)
  .then(()=>{
    console.log('Priority -1');
  }, null, -1);
// Priority 1
// Priority 0
// Priority -1
```