from survey import Survey
import math
from utils import modinv, rabinMiller, L

class Survey_encryptor:

    def __init__(self,survey:Survey):
        self.survey = survey

    def generate_key():
        miller = rabinMiller()
        p:int = miller.generateLargePrime(56) # случайное простое число
        q:int = miller.generateLargePrime(56) # случайное простое число
        print(f'{math.gcd(p * q,(p - 1) * (q - 1))}')
        if math.gcd(p * q,(p - 1) * (q - 1)) != 1:
            return 'error'

        n = p * q
        n_2 = n * n
        alf = math.lcm(p-1, q-1)
        y = miller.generateLargePrime(len(bin(n)) - 3)
        l = L(pow(y,alf,n_2),n)
        x = modinv(l,n) % n

        return dict(
            public_key=y,
            public_exponent=n,
            private_key=alf,
            private_exponent=x
        )



    def encrypt(self,key:tuple):
        enc_survey = self.survey
        questions = enc_survey.get_answers()
        for question in questions:
            if question['answers'] is None:
                continue
            for answer in question['answers']:
                enc = self.message_encrypt(answer.value,key)
                answer.set_value(enc)
        
        return enc_survey
            

    def message_encrypt(self,message,key:tuple):
        pubkey= key[0]
        exponent = key[1]
        number = message 
        random = rabinMiller().generateLargePrime(len(bin(exponent)) - 3)
        n_2 = exponent ** 2
        c = pow(pubkey,number,n_2) * pow(random,exponent,n_2) % n_2
        return c

    def decrypt(self,key:tuple,pub_key):
        survey = self.survey
        results = survey.get_result()
        for result in results:
            value = self.message_dectypt(result.get_value(),key,pub_key)
            result.set_value(value)

        return survey

    def message_dectypt(self,message,key:tuple,pub_key):
        privkey = key[0]
        priv_exponent = key[1]
        n_2 = pub_key ** 2
        c = L(pow(message,privkey,n_2),pub_key) * priv_exponent % pub_key
        return c


