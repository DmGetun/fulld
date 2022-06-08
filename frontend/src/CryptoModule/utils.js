var bigInt = require("big-integer");
function gcd(a,b){
    /* asd */
    if (arguments[1] === 0) return arguments[0]

    return gcd(arguments[1], arguments[0] % arguments[1])
}

function lcm(a,b){
    return (a * b) / gcd(a,b)
}

function L(u,n){
    return u.minus(1).divide(n);
}

function modinv(a,m) {
    return bigInt(a).mod.modPow(-1,m);
}

var pow = function(a, b, n) {
    a = a % n;
    var result = 1;
    var x = a;
  
    while(b > 0){
      var leastSignificantBit = b % 2;
      b = Math.floor(b / 2);
  
      if (leastSignificantBit == 1) {
        result = result * x;
        result = result % n;
      }
  
      x = x * x;
      x = x % n;
    }
    return result;
  };
  
  var assert = function(actual, expected){
    if (actual != expected){
      throw new Error('Assertion failed');
    }
  };

export {gcd, lcm, pow, L, modinv};



