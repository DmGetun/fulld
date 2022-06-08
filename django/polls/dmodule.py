from typing import Any
import json
from multiprocessing import Pool
from functools import partial
import math
import random

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

    def message_encrypt(key:tuple,message:str):
        message = int(message,16)
        pubkey= key[0]
        exponent = key[1]
        number = message
        random = rabinMiller().generateLargePrime(len(bin(exponent)) - 5)
        n_2 = exponent ** 2
        c = pow(pubkey,number,n_2) * pow(random,exponent,n_2) % n_2
        return c
 

    def decrypt(self,key:tuple,pub_key:str):
        results = self.get_result()
        private_key = key[0]
        private_exponent = key[1]
        func = partial(self.message_decrypt,private_key,private_exponent,pub_key)
        with Pool() as p:
            result = p.map_async(func,results)
            result = result.get()
        for i, resultat in enumerate(results):
            resultat.set_value(result[i])

    def message_decrypt(self,key:tuple,pub_key:str,message:str):
        message = int(message,16)
        privkey = int(key[0],16)
        priv_exponent = int(key[1],16)
        n_2 = int(pub_key,16) ** 2
        c = (L(pow(message.result,privkey,n_2),pub_key) * priv_exponent) % pub_key
        return c

    def results(self):
        pass

    def summator(self):
        pass

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

    @staticmethod
    def encrypt_answers(self,answers:list,key:tuple):
        pass

    @staticmethod
    def decrypt_results(self,results:list,key:tuple):
        pass
    
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