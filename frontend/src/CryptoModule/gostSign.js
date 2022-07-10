import GostDigest from "gost-crypto/lib/gostDigest";
import {Buffer} from 'buffer';

const { gostCrypto, gostEngine } = require('gost-crypto');
const arrayBufferToHex = require('array-buffer-to-hex')
let randomBytes = require("randombytes");
let bigInt = require('big-integer')


export class Point {

    constructor(x,y) {
        this.x = x
        this.y = y
    }

    X() {
        return this.x
    }

    Y() {
        return this.y
    }
}

export class BlindGost34102012{

    constructor(param) {
        this.Q = new Point(bigInt(param['Q'][0],16),bigInt(param['Q'][1],16))
        this.G = new Point(bigInt(param['x'],16),bigInt(param['y'],16))
        this.C = new Point(bigInt(param['C'][0],16),bigInt(param['C'][1],16))
        this.q = bigInt(param['q'],16)
        this.p = bigInt(param['p'],16)
        this.a = bigInt(param['a'],16)
        this.b = bigInt(param['b'],16)
    }

    modinvert(x,q){
        x = bigInt(x)
        return x.modPow(bigInt["-1"],q)
    }

    pos(v) {
        if (v < 0) return bigInt(v).add(this.p)

        return bigInt(v)
    }

    add(p1x,p1y,p2x,p2y){
        let t = bigInt(0)
        let tx = bigInt(0)
        let ty = bigInt(0)
        if (p1x === p2x && p1y === p2y){
            t = ((bigInt(3).multiply(p1x).multiply(p1x).add(this.a)).multiply(this.modinvert(bigInt(2).multiply(p1y), this.p))).mod(this.p)
        }
        else {
            tx = this.pos(bigInt(p2x).minus(p1x)).mod(this.p)
            ty = this.pos(bigInt(p2y).minus(p1y)).mod(this.p)
            t = (ty.multiply(this.modinvert(tx, this.p))).mod(this.p)
        }
        tx = this.pos(t.multiply(t).minus(p1x).minus(p2x)).mod(this.p)
        ty = this.pos(t.multiply(p1x.minus(tx)).minus(p1y)).mod(this.p)
        return new Point(bigInt(tx), bigInt(ty))
    }

    exp(x,y,degree){
        let point = new Point(x,y)
        let t_point = new Point(x,y)

        degree -= 1
        while (degree !== 0) {
            if ((degree & 1) === 1){
                t_point = this.add(t_point.x,t_point.y,point.x,point.y)
            }
            degree = degree >> 1
            point = this.add(point.x,point.y,point.x,point.y)
        }
        return t_point
    }

    GenerateC(private_key) {
        /*
        only for a signer-side use
        */
        if (this.isString(private_key)) private_key = bigInt(private_key,16)
        else private_key = bigInt(private_key)

        let G = this.G
        return this.exp(G.x,G.y,private_key)
    }

    PublicKey(private_key) {

        if (this.isString(private_key)) private_key = bigInt(private_key,16)
        else private_key = bigInt(private_key)

        let G = this.G
        return this.exp(G.x,G.y,private_key)
    }

    CalculateS(k,private_key,r) {
        if (this.isString(private_key)) private_key = bigInt(private_key,16)
        else private_key = bigInt(private_key)

        if (this.isString(k)) k = bigInt(k,16)
        else k = bigInt(k)

        if (this.isString(r)) r = bigInt(r,16)
        else r = bigInt(r)

        return k.add(private_key.multiply(r)).mod(this.q)
    }

    SignMessage(message,mu=null,epsilon=null) {
        let size = this.q.bitLength()
        mu = mu || this.GenerateRandom(size)
        epsilon = epsilon || this.GenerateRandom(size)
        this.mu = mu 
        this.epsilon = epsilon
        message = new TextEncoder().encode(message)
        console.log(message)
        let buffer = Buffer.from(message)
        console.log(buffer)
        let hash = new GostDigest().digest(buffer)
        hash = arrayBufferToHex(hash)
        console.log(hash)

        let C_ = this.CalculateC_()
        let r_ = this.CalculateR_(C_)
        let e = this.CalculateE(hash)
        let r = this.CalculateR(r_,e)
        return [r,r_]
    }

    GenerateRandom(size=256) {
        let length = size / 8
        return bigInt(randomBytes(length).toString('hex'),16).minus(1)
    }

    GenerateTwoRandomNumber(size=256) {
        let length = size / 8
        let mu = bigInt(randomBytes(length).toString('hex'),16).minus(1)
        let epsilon = bigInt(randomBytes(length).toString('hex'),16).minus(1)
        return [mu,epsilon]
    }

    CalculateC_(Q = null,G=null,C=null,epsilon=null,mu=null){
        Q = Q || this.Q
        G = G || this.G
        C = C || this.C
        epsilon = epsilon || this.epsilon
        mu = mu || this.mu
        let g_result = this.exp(G.x,G.y,epsilon)
        let q_result = this.exp(Q.x,Q.y,mu)
        let C_Q = this.add(C.x,C.y,q_result.x,q_result.y)
        let C_ = this.add(C_Q.x,C_Q.y,g_result.x,g_result.y)
        return C_
    }

    CalculateR_(c_point,q=null){
        q = q || this.q
        return c_point.x.mod(q)
    }

    CalculateE(hash) {
        if (this.isString(hash)) hash = bigInt(hash,16)
        this.e = hash.mod(this.q)
        return this.e
    }

    isString(val) {
        return (typeof val === "string" || val instanceof String);
    }

    CalculateR(r_,e,q=null,mu=null) {
        q = q || this.q 
        mu = mu || this.mu
        if (mu >= q) throw new Error('mu must be a lesser than q')

        let e_env = this.modinvert(e,q)
        let r = r_.multiply(e_env).add(mu).mod(q)
        return r
    }

    CalculateS_(e,s,q=null,epsilon=null){
        q = q || this.q 
        epsilon = epsilon || this.epsilon
        return e.multiply(s.add(epsilon)).mod(q)
    }

    GetBlindSign(r_,s,q=null,e=null,epsilon=null) {
        q = q || this.q 
        e = e || this.e
        epsilon = epsilon || this.epsilon
        if (epsilon >= q) throw new Error('epsilon must be a lesser than q')
        let s_ = this.CalculateS_(e,s,q,epsilon)
        return [r_,s_]
    }

    GetHexBlindSign(r_,s_){
        return r_.toString(16) + s_.toString(16)
    }

    VerifySign(sign,hash,Q) {
        let e = hash % this.q
        if (e === 0) e = bigInt(1)
        let length = sign.length
        let r_ = bigInt(sign.substring(0,length),16)
        let s_ = bigInt(sign.substring(length),16)

        let v = this.modinvert(e,this.q)
        let r1 = s_.multiply(v).mod(this.q)
        let r2 = (this.q.minus(r_)).multiply(v).mod(this.q)

        let C_r1 = this.exp(this.G.x,this.G.y,r1)
        let C_r2 = this.exp(this.Q.x,this.Q.y,r2)

        let C = this.add(C_r1.x,C_r1.y,C_r2.x,C_r2.y)

        let R = C.x.mod(this.q)
        return R === r_
    }
}