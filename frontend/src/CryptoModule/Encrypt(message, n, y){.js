function Encrypt(message, n, y){
    let number = Math.pow(10,message);
    let u = 9; // generate from range(1,n)
    let n_2 = n * n;
    let c = pow(y,number,n_2) * pow(u,n,n_2) % n_2;
    return c;
    var encrypt = new JSEncrypt();
    window.crypto.getRandomValues();
}

function Decrypt(message,a,x,n){
    let n_2 = n * n;
    return ((pow(message,a,n_2) - 1) / n) * x % n;
}
message = 123
n = 123;
y = 123;
console.log(Encrypt())