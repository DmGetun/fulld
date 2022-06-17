from multiprocessing import Pool

from functools import partial
from survey import Survey
import math
from utils import modinv, rabinMiller, L

class Survey_encryptor:

    def __init__(self,survey:Survey):
        self.survey = survey

    def generate_key(keysize:int =1024):
        '''
        generate a 
        '''
        miller = rabinMiller()
        p:int = miller.generateLargePrime(keysize//2) # случайное простое число
        q:int = miller.generateLargePrime(keysize//2) # случайное простое число
        if math.gcd(p * q,(p - 1) * (q - 1)) != 1:
            return 'error'

        n: int = p * q
        n_2: int = n * n
        alf: int = math.lcm(p-1, q-1)
        y: int = miller.generateLargePrime(len(bin(n)) - 5)
        l: int = L(pow(y,alf,n_2),n)
        x: int = modinv(l,n) % n

        return dict(
            public_key=y,
            public_exponent=n,
            private_key=alf,
            private_exponent=x
        )

    def encrypt(survey:Survey,key:tuple):
        if survey._encrypted == True:
            return 'Survey is already encrypted'
        all_answers: list = survey.get_answers()
        for answers in all_answers:
            if answers is None:
                continue
            func = partial(Survey_encryptor.message_encrypt,key)
            with Pool() as p:
                results = p.map_async(func,[answer.value for answer in answers])
                results = results.get()
            for i, answer in enumerate(answers):
                answer.value = results[i]

        survey._encrypted = True
            
    @staticmethod
    def message_encrypt(key:tuple,message):
        pubkey= key[0]
        exponent = key[1]
        number = message
        random = rabinMiller().generateLargePrime(len(bin(exponent)) - 5)
        n_2 = exponent ** 2
        c = pow(pubkey,number,n_2) * pow(random,exponent,n_2) % n_2
        return c


    def decrypt(survey,key:tuple,pub_key):
        results = survey.get_result()
        private_key = key[0]
        private_exponent = key[1]
        func = partial(Survey_encryptor.message_decrypt,private_key,private_exponent,pub_key)
        with Pool() as p:
            result = p.map_async(func,results)
            result = result.get()
        for i, resultat in enumerate(results):
            resultat.set_value(result[i])

        return survey

    def message_decrypt(key1,key2,pub_key,message):
        if message.result is None: return
        privkey = key1
        priv_exponent = key2
        n_2 = pub_key ** 2
        c = (L(pow(message.result,privkey,n_2),pub_key) * priv_exponent) % pub_key
        return c


