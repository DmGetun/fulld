from typing import Any
import json
from multiprocessing import Pool
from functools import partial, reduce
import math
import random
from pygost.utils import bytes2long
from pygost.utils import hexdec
from pygost.utils import long2bytes
from pygost.utils import modinvert
from pygost.gost3410 import prv_unmarshal

class BlingGost34102012():

    def __init__(self):
        self.p=bytes2long(hexdec("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD97"))
        self.q=bytes2long(hexdec("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF6C611070995AD10045841B09B761B893"))
        self.a=bytes2long(hexdec("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD94"))
        self.b=bytes2long(hexdec("00000000000000000000000000000000000000000000000000000000000000a6"))
        self.x=bytes2long(hexdec("0000000000000000000000000000000000000000000000000000000000000001"))
        self.y=bytes2long(hexdec("8D91E471E0989CDA27DF505A453F2B7635294F2DDF23E3B122ACC99C9E9F1E14"))

    def pos(self, v):
        """
        Make positive number
        """
        if v < 0:
            return v + self.p
        return v

    def contains(self, point):
        """Is point on the curve?

        :type point: (long, long)
        """
        x, y = point
        r1 = y * y % self.p
        r2 = ((x * x + self.a) * x + self.b) % self.p
        return r1 == self.pos(r2)

    def modinvert(self,x,p):
        return pow(x,-1,p)

    def _add(self, p1x, p1y, p2x, p2y):
        if p1x == p2x and p1y == p2y:
            # double
            t = ((3 * p1x * p1x + self.a) * self.modinvert(2 * p1y, self.p)) % self.p
        else:
            tx = self.pos(p2x - p1x) % self.p
            ty = self.pos(p2y - p1y) % self.p
            t = (ty * self.modinvert(tx, self.p)) % self.p
        tx = self.pos(t * t - p1x - p2x) % self.p
        ty = self.pos(t * (p1x - tx) - p1y) % self.p
        return tx, ty

    def get_certificate(self,Q,C):
        Q = [hex(Q[0])[2:],hex(Q[1])[2:]]
        C = [hex(C[0])[2:],hex(C[1])[2:]]
        return dict(
            p=hex(self.p)[2:],
            q=hex(self.q)[2:],
            a=hex(self.a)[2:],
            b=hex(self.b)[2:],
            x=hex(self.x)[2:],
            y=hex(self.y)[2:],
            Q=Q,
            C=C
        )

    def exp(self, degree, x=None, y=None):
        x = x or self.x
        y = y or self.y
        tx = x
        ty = y
        if degree == 0:
            raise ValueError("Bad degree value")
        degree -= 1
        while degree != 0:
            if degree & 1 == 1:
                tx, ty = self._add(tx, ty, x, y)
            degree = degree >> 1
            x, y = self._add(x, y, x, y)
        return tx, ty

    
    def generate_C(self,k):
        '''
        step 1. Send a user C point
        '''
        k = prv_unmarshal(k)
        return self.exp(k)

    def public_key(self,prv):
        '''
        return a Q point
        '''
        prv = prv_unmarshal(prv)
        return self.exp(prv)

    def calculate_s(self,k,prv,r):
        k = prv_unmarshal(k)
        prv = prv_unmarshal(prv)
        s = (k + prv * r) % self.q
        return s

    def check_sign(self,sign,hash,Q):
        print(f'{sign=}')
        e = hash % self.q
        s_2 = int(sign[len(sign)//2:],16)
        rs = int(sign[:len(sign)//2],16)
        print(f'{rs=} {s_2=}')
        C_r1 = self.exp((s_2 * self.modinvert(e,self.q)),self.x,self.y)
        C_r2 = self.exp((self.q - rs) * self.modinvert(e,self.q),Q[0],Q[1])

        C_r = self._add(C_r1[0],C_r1[1],C_r2[0],C_r2[1])

        print(C_r[0])
        print(C_r[1])
        print(rs)
        print(s_2)
        print(C_r[0] == rs)


    @property
    def G(self):
        return (self.x,self.y)

    


class SurveyEncryptor():

    def __init__(self,questions_field:str ='questions',options_field:str='options',
                answers_field:str='answers',experts_number:int=999,encrypted:bool=True,
                qualitatives_field:str='qualitative',quantitative_field:str='quantitative',
                result_field:str='result'):
        self._questions_field = questions_field
        self._options_field = options_field
        self._answers_field = answers_field
        self._experts_number = experts_number
        self.qualitatives_field = qualitatives_field
        self.quantitatives_field = quantitative_field
        self._results_field = result_field
        self._encrypted = encrypted


    def load_json(self,json_string:str,experts_number:int=999):
        """
        upload a survey from the JSON format
        """
        survey = json.loads(json_string)
        self.load(survey,experts_number)

    def load(self,survey: dict[str,Any],experts_number=999):
        """
        upload a survey
        """
        self.survey = survey

    def encrypt(self,key:tuple):
        if self._encrypted == True:
            return 'Survey is already encrypted'
        all_answers: list = self.get_answers()
        for answers in all_answers:
            if answers is None:
                continue
            
            func = partial(self.message_encrypt,key)
            with Pool() as p:
                results = p.map_async(func,[answer.value for answer in answers])
                results = results.get()
            for i, answer in enumerate(answers):
                answer.value = results[i]

    def message_encrypt(self,key:tuple,message:str):
        message = int(message,16)
        pubkey= key[0]
        exponent = key[1]
        number = message
        random = rabinMiller().generateLargePrime(len(bin(exponent)) - 5)
        n_2 = exponent ** 2
        c = pow(pubkey,number,n_2) * pow(random,exponent,n_2) % n_2
        return c
 

    def decrypt(self,key:tuple,pub_key:str):
        results = self.get_results()
        private_key = key[0]
        private_exponent = key[1]
        func = partial(self.message_decrypt,private_key,private_exponent,pub_key)
        with Pool() as p:
            result = p.map_async(func,results)
            result = result.get()
        for i, resultat in enumerate(results):
            resultat.set_value(result[i])

    def get_results(self):
        questions = self[self._questions_field]
        return [question[self._results_field] for question in questions]

    def message_decrypt(self,key:tuple,pub_key:str,message:str):
        message = int(message,16)
        privkey = int(key[0],16)
        priv_exponent = int(key[1],16)
        n_2 = int(pub_key,16) ** 2
        c = (L(pow(message.result,privkey,n_2),pub_key) * priv_exponent) % pub_key
        return c

    def results(self,keys):
        all_answers = self.get_answers()
        with Pool() as p:
            func = partial(self._result,keys['public_exponent'])
            results = p.map_async(func,all_answers)
            for question,result in zip(all_answers,results.get()):
                self.add_result(question,result)

    def _result(self,pub_key,answers):
        return self.summator(answers,pub_key)

    def add_result(question,result):
        question['result'] = result

    @classmethod
    def get_sum(cls,answers,n):
        n = int(n,16)
        res = reduce(lambda a,b: (a * b) % (n * n),[int(answer,16) for answer in answers]) % (n * n)
        return res

    def summator(answers,n):
        n = int(n,16)
        res = reduce(lambda a,b: (a * b) % (n * n),[answer.value for answer in answers]) % (n * n)
        #res = math.prod([answer.value for answer in answers]) % (n * n)
        return res

    def interp_results(self):
        pass

    def generate_key(self,keysize=1024):
        '''
        generate a dict of keys:
        (public_key,public_exponent,private_key,private_exponent)
        '''
        miller = rabinMiller()
        p:int = miller.generateLargePrime(keysize/2) # случайное простое число
        q:int = miller.generateLargePrime(keysize/2) # случайное простое число
        print(len(bin(p * q).replace('0b','')))
        if math.gcd(p * q,(p - 1) * (q - 1)) != 1:
            return 'error'

        n: int = p * q
        n_2: int = n * n
        alf: int = math.lcm(p-1, q-1)
        y: int = miller.generateLargePrime(len(bin(n)) - 5)
        l: int = L(pow(y,alf,n_2),n)
        x: int = modinv(l,n) % n

        return dict(
            public_key=hex(y)[2:],
            public_exponent=hex(n)[2:],
            private_key=hex(alf)[2:],
            private_exponent=hex(x)[2:]
        )

    def encrypt_answers(self,answers:list,key:tuple):
        return [self.message_encrypt(key,answer) for answer in answers]
    
    def decrypt_results(self,results:list,key:tuple,pub_key):
        return [self.message_decrypt(key,pub_key,result) for result in results]
    
    def get_answers(self):
        questions = self.survey[self._questions_field]
        return [{id: question[self._answers_field]} for id,question in enumerate(questions)]


class rabinMiller:
    def rabinMiller(self,num):
        s = num - 1
        t = 0
   
        while s % 2 == 0:
            s = s // 2
            t += 1
        for trials in range(5):
            a = random.randrange(2, num - 1)
            v = pow(a, s, num)
            if v != 1:
                i = 0
                while v != (num - 1):
                    if i == t - 1:
                        return False
                    else:
                        i = i + 1
                        v = (v ** 2) % num
            return True

    def isPrime(self,num):
    
        if (num < 2):
            return False
        lowPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 
   67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 
   157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 
   251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313,317, 331, 337, 347, 349, 
   353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 
   457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 
   571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 
   673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 
   797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 
   911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997]
	
        if num in lowPrimes:
            return True
        for prime in lowPrimes:
            if (num % prime == 0):
                return False
        return self.rabinMiller(num)

    def generateLargePrime(self,keysize = 1024):
        while True:
            num = random.randrange(2**(keysize-1), 2**(keysize))
            if self.isPrime(num):
                return num

def modinv(a, m):
    y = pow(a,-1,m)
    return y

def L(u,n):
    return (u - 1) // n