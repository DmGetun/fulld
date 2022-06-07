import './utils';
import { gcd, lcm, pow } from './utils';


export class cryptoSurvey {

    constructor(expertsNumber) {
        this.expertsNumber = expertsNumber;
    }

    SetKey(n,y){
        this.n = n;
        this.y = y;
    }

    GenerateKey(){
        let bigInteger = require('jsbn').BigInteger;
        let p = this.randInt(100)
    }

    randInt(keysize){
        let bigInteger = require('jsbn').BigInteger;
        let isPrime = false;
        let rand = new bigInteger('0');
        while(isPrime){
            let min = new bigInteger('2').pow(keysize-1);
            let max = new bigInteger('2').pow(keysize);
            let sub = max.subtract(min);
            let rand_s = new bigInteger(Math.random().toString());
            rand = sub.multiply(rand_s);
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

    Encrypt(message, pub_key, pub_exp){
        let bigInteger = require('jsbn').BigInteger;
        let random = new bigInteger('9'); // add rabinMiller
        let n = new bigInteger(pub_key.toString());
        let n_2 = n.pow(2);
        let y = new bigInteger(pub_exp.toString());
        return (n.modPowInt(message,n_2) * random.modPowInt(y,n_2)) % n_2; 
    }

    Decrypt(message,a,x,n){
        let bigInteger = require('jsbn').BigInteger;
    }

    EncodeAnswer(answer){
        let n = this.expertsNumber;
        let k = Math.ceil(Math.log2(n));
        let encode_answer = Math.pow(2,(k * (answer - 1)));
        return encode_answer;
    }
}

export default Crypto;

