from survey.survey import Survey
import math
from survey.utils import imod, modinv, rabinMiller, speed_pow

class Survey_encryptor:

    def __init__(self,survey:Survey):
        self.survey = survey

    def generate_key(self):
        miller = rabinMiller()
        p:int = miller.generateLargePrime(15) # случайное простое число
        q:int = miller.generateLargePrime(15) # случайное простое число
        print(f'{math.gcd(p * q,(p - 1) * (q - 1))}')
        if math.gcd(p * q,(p - 1) * (q - 1)) != 1:
            return 'error'

        n = p * q
        n_2 = n * n
        alf = math.lcm(p-1, q-1)
        y = 3 # случайное число из диапазона от 0 до n^2
        l = self.L(pow(y,alf,n_2),n)
        x = modinv(l,n) % n

        return dict(
            public_key=y,
            public_exponent=n,
            private_key=alf,
            private_exponent=x
        )



    def survey_ecnrypt(self,key:tuple):
        public_key = key[0]
        public_exponent = key[1]

        questions = self.survey.get_questions()


    def message_encrypt(self,message,key:tuple):
        pubkey= key[0]
        exponent = key[1]
        number =  message 
        random = 9 # случайное число из диапазона от 1 до 9
        n_2 = exponent ** 2
        c = pow(pubkey,number,n_2) * pow(random,exponent,n_2) % n_2
        return c



    def decrypt(self,key:tuple):
        pass

    def dectypt_message(self,message,key:tuple,pub_key):
        privkey = key[0]
        priv_exponent = key[1]
        n_2 = pub_key ** 2
        c = (self.L(pow(message,privkey,n_2),pub_key) * priv_exponent) % pub_key
        return c

    def L(self,u,n):
        return (u - 1) // n


