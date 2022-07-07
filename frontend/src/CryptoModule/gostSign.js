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


    GenerateRandom(size=256) {
        let length = size / 8
        this.mu = bigInt(randomBytes(length).toString('hex'),16).add(1)
        this.epsilon = bigInt(randomBytes(length).toString('hex'),16).add(1)
        if(this.mu > this.q) console.log('mu')
        if(this.epsilon > this.q) console.log('epsilon')
        return [this.mu,this.epsilon]
    }

    CalculateC_(){
        'receive a Q,G,C'
        let g_result = this.exp(this.G.x,this.G.y,this.epsilon)
        let q_result = this.exp(this.Q.x,this.Q.y,this.mu)
        let C_Q = this.add(this.C.x,this.C.y,q_result.x,q_result.y)
        let C_ = this.add(C_Q.x,C_Q.y,g_result.x,g_result.y)
        return C_
    }

    CalculateR_(c_point){
        return c_point.x.mod(this.q)
    }

    CalculateE(hash) {
        this.e = hash.mod(this.q)
        return this.e
    }

    CalculateR(r_,e) {
        let e_env = this.modinvert(e,this.q)
        let r = r_.multiply(e_env).add(this.mu).mod(this.q)
        return r
    }

    CalculateS_(e,s){
        return e.multiply(s.add(this.epsilon)).mod(this.q)
    }

    GetBlindSign(r_,s) {
        let s_ = this.e.multiply(s.add(this.epsilon)).mod(this.q)
        return r_.toString(16) + s_.toString(16)
    }
}