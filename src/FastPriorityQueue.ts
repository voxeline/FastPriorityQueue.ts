/**
 * FastPriorityQueue.js : a fast heap-based priority queue  in JavaScript.
 * (c) the authors
 * Licensed under the Apache License, Version 2.0.
 *
 * Speed-optimized heap-based priority queue for modern browsers and JavaScript engines.
 *
 * Usage :
         Installation (in shell, if you use node):
         $ npm install fastpriorityqueue

         Running test program (in JavaScript):

         // var FastPriorityQueue = require("fastpriorityqueue");// in node
         var x = new FastPriorityQueue();
         x.add(1);
         x.add(0);
         x.add(5);
         x.add(4);
         x.add(3);
         x.peek(); // should return 0, leaves x unchanged
         x.size; // should return 5, leaves x unchanged
         while(!x.isEmpty()) {
           console.log(x.poll());
         } // will print 0 1 3 4 5
         x.trim(); // (optional) optimizes memory usage
 */

export interface Comparator {
  (lhs: number, rhs: number): boolean;
}

const defaultcomparator: Comparator = function (a, b) {
  return a < b;
};

export interface Item<T> {
  object: T;
  priority: number;
}

// the provided comparator function should take a, b and return *true* when a < b
class FastPriorityQueue<T> {
  array: Item<T>[];
  size: number;
  compare: Comparator;

  constructor(comparator: Comparator) {
    this.array = [];
    this.size = 0;
    this.compare = comparator || defaultcomparator;
  }

  // Add an element the the queue
  // runs in O(log n) time
  public add(myval: T, priority: number) {
    var i = this.size;
    const item: Item<T> = { object: myval, priority };
    this.array[this.size++] = item;
    while (i > 0) {
      var p = (i - 1) >> 1;
      var ap = this.array[p];
      if (!this.compare(priority, ap.priority)) break;
      this.array[i] = ap;
      i = p;
    }
    return this.array[i] = item;
  }

  // replace the content of the heap by provided array and "heapifies it"
  public heapify(arr: Item<T>[]) {
    this.array = arr;
    this.size = arr.length;
    for (var i = (this.size >> 1); i >= 0; i--) {
      this._percolateDown(i);
    }
  }

  // Look at the top of the queue (a smallest element)
  // executes in constant time
  //
  // This function assumes that the priority queue is
  // not empty and the caller is resposible for the check.
  // You can use an expression such as
  // "isEmpty() ? undefined : peek()"
  // if you expect to be calling peek on an empty priority queue.
  //
  public peek() {
    return this.array[0];
  }

  // remove the element on top of the heap (a smallest element)
  // runs in logarithmic time
  //
  //
  // This function assumes that the priority queue is
  // not empty, and the caller is responsible for the check.
  // You can use an expression such as
  // "isEmpty() ? undefined : poll()"
  // if you expect to be calling poll on an empty priority queue.
  //
  // For long-running and large priority queues, or priority queues
  // storing large objects, you may  want to call the trim function
  // at strategic times to recover allocated memory.
  public poll() {
    var ans = this.array[0];
    if (this.size > 1) {
      this.array[0] = this.array[--this.size];
      this._percolateDown(0 | 0);
    } else --this.size;
    return ans;
  }

  // recover unused memory (for long-running priority queues)
  public trim() {
    this.array = this.array.slice(0, this.size);
  }

  // Check whether the heap is empty
  public isEmpty() {
    return this.size == 0;
  }

  // for internal use
  private _percolateUp(i: number) {
    var myval = this.array[i];
    while (i > 0) {
      var p = (i - 1) >> 1;
      var ap = this.array[p];
      if (!this.compare(myval.priority, ap.priority)) break;
      this.array[i] = ap;
      i = p;
    }
    this.array[i] = myval;
  }

  // for internal use
  private _percolateDown(i: number) {
    var size = this.size;
    var hsize = this.size >>> 1;
    var ai = this.array[i];
    while (i < hsize) {
      var l = (i << 1) + 1;
      var r = l + 1;
      var bestc = this.array[l];
      if (r < size) {
        if (this.compare(this.array[r].priority, bestc.priority)) {
          l = r;
          bestc = this.array[r];
        }
      }
      if (!this.compare(bestc.priority, ai.priority)) {
        break;
      }
      this.array[i] = bestc;
      i = l;
    }
    this.array[i] = ai;
  }
}

export default FastPriorityQueue;
