import { W1, W2, W3, B1, B2, B3 } from './weights'

export function relu(x) {
  return Math.max(0, x);
}

function softmax(x) {
  let s = 0;
  for (let i = 0; i < x.length; i++) {
    s += x[i];
  }
  for (let i = 0; i < x.length; i++) {
    x[i] /= s;
  }
  return x;
}

export function dense(x, w, b, f = relu) {
  let out = [];
  for (let j = 0; j < b.length; j++) {
    let n = b[j];
    for (let i = 0; i < x.length; i++) {
      n += x[i] * w[i][j];
    }
    out.push(f(n));
  }
  return out;
}

export function predict(num) {
  let out = [];
  out = dense(num, W1, B1);
  out = dense(out, W2, B2);
  out = dense(out, W3, B3, Math.exp);
  return softmax(out);
}

