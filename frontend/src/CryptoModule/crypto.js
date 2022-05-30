import './utils';
import { gcd, lcm, pow } from './utils';


class Crypto {

    constructor() {

    }

    Encrypt(message, n, y){
        let number = Math.pow(10,message);
        let u = 9; // generate from range(1,n)
        let n_2 = n * n;
        let c = pow(y,number,n_2) * pow(u,n,n_2) % n_2;
        return c;
    }

    Decrypt(message,a,x,n){
        let n_2 = n * n;
        return ((pow(message,a,n_2) - 1) / n) * x % n;
    }
}

export default Crypto;

