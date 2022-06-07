function gcd(a,b){
    /* asd */
    if (arguments[1] === 0) return arguments[0]

    return gcd(arguments[1], arguments[0] % arguments[1])
}

function lcm(a,b){
    return (a * b) / gcd(a,b)
}

function pow(number,power,module){
    let result = 1;
    while(power--){
        result = (result * number) % module;
    }
    return result;
}

export {gcd, lcm, pow};

