import './utils';
import { gcd, lcm, pow, L, modinv} from './utils';


export class cryptoSurvey {

    constructor(expertsNumber) {
        this.expertsNumber = expertsNumber;
    }

    SetKey(keys){
        this.keys = keys
    }

    GenerateKey(keysize=1024){
        var bigInt = require("big-integer");
        let p = this.randInt(keysize/2);
        let q = this.randInt(keysize/2);
        let n = p.multiply(q)
        let n_2 = n.pow(2);
        let alf = bigInt.lcm(p.minus(1),q.minus(1));
        let y = this.randInt(n.bitLength() - 2)
        let u = y.modPow(alf,n_2)
        let l = L(u,n)
        let s = l.modInv(n);
        let x = s.divmod(n).remainder; 
        return {'public_key':y, 'public_exponent':n, 'private_key':alf,'private_exponent':x}
    }

    randInt(keysize){
        var bigInt = require("big-integer");
        let isPrime = false;
        let consta = bigInt(2);
        let rand = bigInt(0);
        while(!isPrime){
            rand = bigInt.randBetween(consta.pow(keysize-1),consta.pow(keysize));
            isPrime = rand.isProbablePrime();
        }
        return rand;
    }

    EncryptSurvey(survey){
        for (let id in survey.chooses){
            let choose = survey.chooses[id] + 1;
            let encode_choose = this.EncodeAnswer(choose);
            let encrypt_choose = this.Encrypt(encode_choose,this.n,this.y);
            survey.chooses[id] = encrypt_choose; 
        }
        return survey;
    }

    Encrypt(message){
        var bigInt = require("big-integer");
        let pub_key = bigInt(this.keys.pub_key.toString());
        let pub_exp = bigInt(this.keys.pub_exp.toString());
        let random = bigInt('9'); // add rabinMiller
        let n_2 = pub_exp.pow(2);
        return pub_key.modPow(message,n_2).multiply(random.modPow(pub_exp,n_2)).divmod(n_2).remainder; 
    }

    Decrypt(message){
        var bigInt = require("big-integer");
        let a = bigInt(this.keys.priv_key);
        let x = bigInt(this.keys.priv_exp);
        let n = bigInt(this.keys.pub_exp);
        let n_2 = n.pow(2);
        return L(message.modPow(a,n_2),n).multiply(x).divmod(n).remainder;
    }

    EncodeAnswer(answer){
        let n = this.expertsNumber;
        let k = Math.ceil(Math.log2(n));
        let encode_answer = Math.pow(2,(k * (answer - 1)));
        return encode_answer;
    }
}

export default Crypto;

