I'm gonna start writing explanations to make sure I'm learning from these problems

[link to problem](https://adventofcode.com/2022/day/11)

Todays big learning topic: **Modulo Arithmetic**

The most important concept to grasp right off the bat, is that you can condense the size of some operations in this problem by using modulo arithmetic. We'll focus specifically on the following idea:

```js
(A + B) % M = (A % M) + (B & M) % M
```

As in, you can reduce the value of the numbers that you are adding or multiplying, and achieve the same remainder in the end.

Let's take an example:

```js
(64343 + 56040) % 5
= 3

// can also be written

(64343 % 5) + (56040 % 5) % 5
= 3 + 0 % 5
= 3
```

Both of these result in the same remainder, however the second equation has significantly lower values. **This also applies for multiplication btw**.

This was useful for today's part 2, because the challenge was that the raw numbers became so exponentially large, that memory was exceeded and it was impossible to find the solution by brute force.

The part where this comes into play is the idea of a `superModulo`:

```js
const superModulo = monkeys.reduce((acc, curr) => {
  return acc * curr.test.divisor; // Test: divisible by <divisor>
}, 1);
```

Basically, we're going through each monkey's modulo, and getting an unholy lovechild of all of the divisors multiplied together. This is our supermodulo, which is tool that will come in handy later.

Then we have our `performMonkeyBusiness` function, which is something like:

```js
const performMonkeyBusiness = (monkey: Monkey, index: number) => {
  while (monkey.items.length > 0) {
    const item = monkey.items[0];
    // perform the operation to get the new value of the item
    let newValue = performOperationFor(
      monkey.operation.first,
      monkey.operation.second,
      monkey.operation.op,
      item,
      index
    );
    newValue = newValue % superModulo;

    const passesTest = newValue % monkey.test.divisor === 0;
    if (passesTest) {
      monkey.items.shift();
      monkeys[monkey.test.ifTrue].items.push(newValue);
    } else {
      monkey.items.shift();
      monkeys[monkey.test.ifFalse].items.push(newValue);
    }
  }
};
```

Basically, we're going to go through and inspect each item as a monkey. Every iteration, we're pulling the next item as the one to inspect. Then, we're getting our new value based on the operation of that monkey. We have the `first` and `second` variables, along with an `op` variable which work together to find the correct value.

The next line is where things get tricky. The `newValue` variable is set to `newValue % superModulo`, which, since `superModulo` is applied consistently, allows us to keep track of a consistent behavior from the monkeys (because the remainder is always consistent), while also not melting our CPUs.

**Why does this work?????????????**
That is a really good question. It's safe to say that the value of the `superModulo` itself is as far as I can tell arbitrary. The idea that you need some sort of consistent modulo to continually use to compress your `newValue` makes sense, otherwise `newValue` will get really big really quick. The `superModulo` is simply the value that they selected for us to use, and is a way for them to calculate what the right answer is. So, the `superModulo` works by consistently shrinking the worry size without changes the value of the remainder, therefore preserving the expected decision of the monkey.
