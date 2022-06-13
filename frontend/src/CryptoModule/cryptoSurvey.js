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
        return {'public_key':y.toString(16), 'public_exponent':n.toString(16), 
        'private_key':alf.toString(16),'private_exponent':x.toString(16)}
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
        for (let id in survey.answers){
            let choose = survey.answers[id] + 1;
            let encode_choose = this.EncodeAnswer(choose);
            let encrypt_choose = this.Encrypt(encode_choose,this.n,this.y);
            survey.answers[id] = encrypt_choose.toString(16); 
        }
        return survey;
    }

    Encrypt(message){
        var bigInt = require("big-integer");
        let pub_key = bigInt(this.keys.public_key,16);
        let pub_exp = bigInt(this.keys.public_exponent,16);
        let random = this.randInt(pub_exp.bitLength() - 3)
        let n_2 = pub_exp.pow(2);
        return pub_key.modPow(message,n_2).multiply(random.modPow(pub_exp,n_2)).divmod(n_2).remainder; 
    }

    Decrypt(message){
        var bigInt = require("big-integer");
        let a = bigInt(this.keys.privave_key,16);
        let x = bigInt(this.keys.privave_exponent,16);
        let n = bigInt(this.keys.public_exponent,16);
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

