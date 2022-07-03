from survey import SurveyEncryptor

su = SurveyEncryptor()
m = su.generate_key(512)
key = (int(m['public_key'],16),int(m['public_exponent'],16))
a = su.message_encrypt(key,hex(5))
b = su.message_encrypt(key,hex(6))
c = su.message_encrypt(key,hex(7))
modulus = int(m['public_exponent'],16)
p = m['p']
q = m['q']
r = pow(a,b,modulus**2)
r = pow(r,c,modulus**2)
print(r)
r = pow(r,(p-1)//4,modulus**2)
r = pow(r,(p-1)//4,modulus**2)

