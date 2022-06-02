from datetime import datetime
import pprint
from survey_counter import Survey_counter
from DATA import data
from survey import Survey
from survey_encryptor import Survey_encryptor
from datetime import timedelta

pp = pprint.PrettyPrinter(indent=1)
pp.pprint(data)

survey = Survey.load(**data)
encryptor = Survey_encryptor(survey)
keys = Survey_encryptor.generate_key()
message = 10123456789123456789123478576576347657834657836457
start = datetime.now()
enc = encryptor.message_encrypt(message,(keys['public_key'],keys['public_exponent']))
decr = encryptor.message_dectypt(enc,(keys['private_key'],keys['private_exponent']),keys['public_exponent'])
end = timedelta(datetime.now().microsecond,start.microsecond)
print(f'{end=}')
#print(encrypt_survey.get_answers()[0]['answers'][0].value)
#print(encrypt_survey.get_answers()[0]['answers'][1].value)
#result = Survey_counter(encrypt_survey)
#result.result()
