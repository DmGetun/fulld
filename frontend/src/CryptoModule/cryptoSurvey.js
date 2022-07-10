import './utils';
import { gcd, lcm, pow, L, modinv} from './utils';

let bigInt = require("big-integer");
let crypto = require("randombytes");
const {Base64} = require('js-base64');

function ObjToBase64(obj) {
    let objJson = JSON.stringify(obj)
    return Buffer.from(objJson).toString('base64')
}

function ObjFromBase64(base64) {
    let objJson = Base64.decode(base64)
    return JSON.parse(objJson)
}

export class cryptoSurvey {


    constructor(expertsNumber) {
        this.expertsNumber = expertsNumber;
    }

    PailierPublicKeyCertificate(modulus,exponent) {
        let cert = {
            'Private key algo': 'Pailier',
            'Private Format': 'PKCS#8',
            'Modulus:': `${modulus}`,
            'Exponent': `${exponent}` 
        }
        let certificate = `
        -----BEGIN PAILIER PUBLIC KEY-----
        ${ObjToBase64(cert)}
        -----END PAILIER PUBLIC KEY-----`
        this.Certificate = certificate
    }

    PailierPrivateKeyCertificate(modulus,pubExp,privExp,primeP,primeQ) {
        let cert = {
            'Private key algo': 'Pailier',
            'Private Format': 'PKCS#8',
            'Modulus:': `${modulus}`,
            'Public Exponent': `${pubExp}`,
            'Private Exponent': `${privExp}`,
            'Prime P': `${primeP}`,
            'Prime Q': `${primeQ}` 
        }
        let certificate = `
        -----BEGIN PAILIER SECRET KEY-----
        ${ObjToBase64(cert)}
        -----END PAILIER SECRET KEY-----`
        this.Certificate = certificate
    }

    ParsePrivateCertificate(certificate) {
        cert = certificate.split('\n')[1]
        cert = ObjFromBase64(cert)
        return {
            'private_exponent':cert['Private Exponent'],
            'private_modulus':cert['Modulus'],
            'public_exponent': cert['Public Exponent'],
            'prime_p':cert['Prime P'],
            'prime_q': cert['Prime Q'],
        }
    }

    ParsePublicCertificate(certificate){
        cert = certificate.split('\n')[1]
        cert = ObjFromBase64(cert)
        return {
            'public_modulus': cert['Modulus'],
            'public_exponent': cert['Exponent']
        }
    }

    SetPrivateKey(certificate) {
        this.keys = this.ParsePrivateCertificate(certificate)
    }

    SetPublicKey(certificate){
        this.keys = this.ParsePublicCertificate(certificate)
    }

    GetPublicKey(certificate) {
        let keys = this.ParsePrivateCertificate(certificate)
        let p = keys['prime_p']
        let q = keys['prime_q']
        let y = keys['Public Exponent']
        let n = keys['Public Modulus']
        let n_2 = n.pow(2)
        let alf = bigInt.lcm(p.minus(1),q.minus(1))
        let u = y.modPow(alf,n_2)
        let l = L(u,n)
        let s = l.modInv(n)
        let x = s.divmod(n).remainder
        return this.PailierPublicKeyCertificate()
    }

    GenerateKey(keysize=1024){
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
        console.log(privateCertificate(x.toString(16),alf.toString(16)))
        return {'public_exponent':y.toString(16), 'public_modulus':n.toString(16), 
        'private_exponent':alf.toString(16),'private_modulus':x.toString(16)}
    }

    randInt(keysize){
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
        message = this.EncodeAnswer(message)
        var bigInt = require("big-integer");
        let pub_key = bigInt(this.keys.public_exponent,16);
        let pub_exp = bigInt(this.keys.public_modulus,16);
        //let random = this.randInt(pub_exp.bitLength() - 3)
        let random = this.randInt(28)
        let n_2 = pub_exp.pow(2);
        let result = pub_key.modPow(message,n_2).multiply(random.modPow(pub_exp,n_2)).divmod(n_2).remainder;
        return result.toString(16)
    }

    EncryptQuantitative(message,factor){
        let value = +factor['title']
        message = message * value
        var bigInt = require("big-integer");
        let pub_key = bigInt(this.keys.public_exponent,16);
        let pub_exp = bigInt(this.keys.public_modulus,16);
        //let random = this.randInt(pub_exp.bitLength() - 3)
        let random = this.randInt(28)
        let n_2 = pub_exp.pow(2);
        let result = pub_key.modPow(message,n_2).multiply(random.modPow(pub_exp,n_2)).divmod(n_2).remainder;
        return result.toString(16)
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
        let a = bigInt(this.keys.private_exponent,16);
        let x = bigInt(this.keys.private_modulus,16);
        let n = bigInt(this.keys.public_modulus,16);
        let n_2 = n.pow(2);
        let r = L(message.modPow(a,n_2),n).multiply(x).divmod(n).remainder;
        return r
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
            let r = result & ~(-Math.pow(2,k));
            result >>= k
            decoded[index++] = r
        }
        return decoded
    }

    AgregateResult(surveys) {
        let survey = surveys[0]
        for (let i = 0; i < survey.questions.length; i++) {
            let question = surveys[i].questions
            let results = surveys.map(survey => bigInt(survey.questions[i]['answer'],16))
            if (question[i].type === 'qualitative') {
                let decrypted_results = this.AgregateQualitative(results)
                survey.questions[i]['result'] = decrypted_results
            }
            if (question[i].type === 'quantitative') {
                let decrypted_results = this.AgregateQuantitative(results,question[i].options[0]['title'])
                survey.questions[i]['result'] = decrypted_results
            }
        }
        return survey
    }

    AgregateQuantitative(answers,factor) {
        let sum = this.ArrayAddition(answers)
        factor = +factor
        let encrypted_result = this.Decrypt(sum)
        return encrypted_result / factor / answers.length
    }

    AgregateQualitative(answers) {
        let sum = this.ArrayAddition(answers)
        let decrypted_result = this.Decrypt(sum)
        return this.DecodeResult(decrypted_result)
    }

    ArrayAddition(values) {
        let module = bigInt(this.keys.public_modulus,16).pow(2)
        return values.reduce((a,b) => a.multiply(b).mod(module))
    }

    Multiplication(a,b,m) {
        return bigInt(a).modPow(b,m)
    }

    Addition(a,b,m) {
        return a * b % m
    }

    GetStep(){
        return Math.ceil(Math.log2(this.expertsNumber));
    }
}

export default Crypto;

