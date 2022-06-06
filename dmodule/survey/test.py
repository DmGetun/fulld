from datetime import datetime
import pprint
from random import Random, random
from survey_counter import Survey_counter
from DATA import data
from survey import Survey
from survey_encryptor import Survey_encryptor
from quetions import Quantitative_question
from functools import partial
from multiprocessing.pool import Pool

pp = pprint.PrettyPrinter(indent=1)
survey = Survey.load(data,10000)
pp.pprint(survey.get())

survey.add_answer(1,2)
survey.add_answer(2,1)
survey.add_answer(2,2)
survey.add_answer(3,100)
survey.add_answer(3,200)
survey.add_answer(3,300)


start = datetime.now()
enc_survey = Survey_encryptor(survey)
keys = Survey_encryptor.generate_key()
survey.set_key(keys)
print('start enc')
start = datetime.now()
Survey_encryptor.encrypt(survey,(keys['public_key'],keys['public_exponent']))
print(f'total time to enc:{datetime.now() - start}')

print('end enc')
print('start res')
start = datetime.now()
Survey_counter.result(survey)
print(f'total time to res:{datetime.now() - start}')
print('end res')
print('start dec')
start = datetime.now()
survey = Survey_encryptor.decrypt(survey,(keys['private_key'],keys['private_exponent']),keys['public_exponent'])
print(f'total time to dec:{datetime.now() - start}')
print('end dec')
pp.pprint(survey.interp_result())
print(datetime.now() - start)




