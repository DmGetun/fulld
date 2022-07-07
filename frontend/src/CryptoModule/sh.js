import bigInt from 'big-integer'
import randomBytes from 'randombytes'
import '/utils'

class ECP {

    constructor(){

    }

    GenerateKey(keysize=1024) {
        let p = this.randInt(keysize)
        let q = this.randInt(160)
        while (true) {
            if ((p - 1) % q == 0) break
            q = this.randInt(160)
        }
        let g = this.randInt()
        let w = randomBytes(q.toString(16).length - 10) // секретный
        let y = g.modPow(q.minus(w),p)
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
}