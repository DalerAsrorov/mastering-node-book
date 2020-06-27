let operand = 3;

function square() {
  return operand * operand;
}

// Make first pass to gather type information
square();
// Ask the next call of #square trigger an optimization attempt
%OptimizeFunctionOnNextCall(square);
operand = 3.01;
square();
