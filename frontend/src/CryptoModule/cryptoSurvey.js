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
        let y = bigInt(65536)
        let u = y.modPow(alf,n_2)
        let l = L(u,n)
        let s = l.modInv(n);
        let x = s.divmod(n).remainder; 
        return {'public_exponent':y.toString(16), 'public_modulus':n.toString(16), 
        'private_exponent':alf.toString(16),'private_modulus':x.toString(16)}
    }

    randInt(keysize){
        var bigInt = require("big-integer");
        var crypto = require("randombytes");
        let a = {
            'size': 2048,
            'public': 123,
            'private': 456
        }
        while(true){
            let random =  crypto(keysize/8)
            random[random.byteLength-1] = random[random.byteLength-1] | 0x01   
            random[0] = random[0] | 0x80
            let rand = bigInt(random.toString('hex'),16);
            if (rand.isProbablePrime()) {
                return rand;
            }
        }
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

    EncryptMessages(messages){
        let result = Array()
        for (let message in messages) {
            result.push(this.Encrypt(message));
        }
        return result;
    }

    Encrypt(message){
        var bigInt = require("big-integer");
        let pub_key = bigInt(this.keys.public_key,16);
        let pub_exp = bigInt(this.keys.public_exponent,16);
        let random = this.randInt(pub_exp.bitLength() - 3)
        let n_2 = pub_exp.pow(2);
        return pub_key.modPow(message,n_2).multiply(random.modPow(pub_exp,n_2)).divmod(n_2).remainder; 
    }

    DecryptMessages(messages,factor){
        let result = Array()
        for (let message in messages) {
            result.push(this.Decrypt(message) / factor)
        }
        return result
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
        let k = this.GetStep();
        let encode_answer = Math.pow(2,(k * (answer - 1)));
        return encode_answer;
    }

    DecodeResult(result){
        let k = this.GetStep();
        let decoded = {}
        let index = 1
        while (result > 0) {
            let r = result & ~(-k);
            result >>= k
            decoded[index++] = r
        }
        return decoded
    }

    InterpQuantitative(answers){
        let result = {}
        //decryptAnswers = this.DecryptMessages(answers); 
    }

    GetStep(){
        return Math.ceil(Math.log2(this.expertsNumber));
    }
}

export default Crypto;

