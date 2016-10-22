import { FastPriorityQueue, Item } from '../';

interface TestObject {
  name: string;
}

type TestItem = Item<TestObject>;

describe('FastPriorityQueue', function() {
  let seed = 1;
  function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  it('example1', function() {
    var x = new FastPriorityQueue<TestObject>((a, b) => a < b);

    x.add({ name: 'obj_1' }, 1);
    x.add({ name: 'obj_0' }, 0);
    x.add({ name: 'obj_5' }, 5);
    x.add({ name: 'obj_4' }, 4);
    x.add({ name: 'obj_3' }, 3);
    if (x.poll().object.name != 'obj_0') throw 'bug';
    if (x.poll().object.name != 'obj_1') throw 'bug';
    if (x.poll().object.name != 'obj_3') throw 'bug';
    if (x.poll().object.name != 'obj_4') throw 'bug';
    if (x.poll().object.name != 'obj_5') throw 'bug';
  });

  it('example2', function() {
    const x = new FastPriorityQueue<TestObject>((a, b) => a > b);
    x.add({ name: 'obj_1' }, 1);
    x.add({ name: 'obj_0' }, 0);
    x.add({ name: 'obj_5' }, 5);
    x.add({ name: 'obj_4' }, 4);
    x.add({ name: 'obj_3' }, 3);
    if (x.poll().object.name != 'obj_5') throw 'bug';
    if (x.poll().object.name != 'obj_4') throw 'bug';
    if (x.poll().object.name != 'obj_3') throw 'bug';
    if (x.poll().object.name != 'obj_1') throw 'bug';
    if (x.poll().object.name != 'obj_0') throw 'bug';
  });

  it('Random', function() {
    for (let ti = 0; ti < 100; ti++) {
      const b = new FastPriorityQueue<TestObject>((a, b) => a < b);
      const N = 1024 + ti;
      for (let i = 0; i < N; ++i) {
        b.add({ name: `obj_${i}` }, Math.floor((random() * 1000000) + 1));
      }

      let v = 0;
      while (!b.isEmpty()) {
        const nv = b.poll();
        if (nv.priority < v) throw 'bug';
        v = nv.priority;
      }
    }
  });

  it('RandomArray', function() {
    for (let ti = 0; ti < 100; ti++) {
      const b = new FastPriorityQueue<TestObject>((a, b) => a < b);
      const array = new Array<TestItem>();
      const N = 1024 + ti;
      for (let i = 0; i < N; ++i) {
        const val = Math.floor((random() * 1000000) + 1);
        const item = b.add({ name: `obj_${val}`}, val);
        array.push(item);
      }

      array.sort((a, b) => b.priority - a.priority);

      while (!b.isEmpty()) {
        var nv = b.poll();
        var nx = array.pop();
        if (nv.priority != nx.priority) throw 'bug';
      }
    }
  });

  it('RandomArrayEnDe', function() {
    for (let ti = 0; ti < 100; ti++) {
      const b = new FastPriorityQueue<TestObject>((a, b) => a < b);
      const array = new Array<TestItem>();
      const N = 16 + ti;
      for (let i = 0; i < N; ++i) {
        const val  = Math.floor((random() * 1000000) + 1);
        const item = b.add({ name: `obj_${val}`}, val);
        array.push(item);
      }
      array.sort((a, b) => b.priority - a.priority);
      for (var j = 0; j < 1000; ++j) {
        const nv = b.poll();
        const nx = array.pop();
        if (nv != nx) throw 'bug';
        const val  = Math.floor((random() * 1000000) + 1);
        const item = b.add({ name: `obj_${val}`}, val);
        array.push(item );
        array.sort((a, b) => b.priority - a.priority);
      }
    }
  });
});
