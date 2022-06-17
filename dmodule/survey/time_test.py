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
import timeit
from question import Type
import time



pp = pprint.PrettyPrinter(indent=1)
survey = Survey.load(data,999)
enc_survey = Survey_encryptor(survey)
keys = Survey_encryptor.generate_key(1024)

time_ = timeit.timeit('Survey_encryptor.generate_key(1024)','from survey_encryptor import Survey_encryptor',number=1)
print(f'time to generate key with len 2048: {time_:.2f} seconds')
time_ = timeit.timeit('Survey_encryptor.generate_key(2048)','from survey_encryptor import Survey_encryptor',number=1)
print(f'time to generate key with len 4096: {time_:.2f} seconds')

for i in range(700):
    survey.add_answer(1,1,Type.qualitative)
for i in range(200):
    survey.add_answer(1,2,Type.qualitative)
for i in range(99):
    survey.add_answer(1,3,Type.qualitative)

survey.set_key(keys)

start = time.time()
Survey_encryptor.encrypt(survey,(keys['public_key'],keys['public_exponent']))
time_ = time.time() - start
print(f'time to encrypt survey with 999 experts: {time_:.5f} seconds')

start = time.time()
Survey_counter.result(survey)
time_ = time.time() - start
print(f'time to answers sum survey with 999 experts: {time_:.5f} seconds')

start = time.time()
Survey_encryptor.decrypt(survey,(keys['private_key'],keys['private_exponent']),keys['public_exponent'])
time_ = time.time() - start
print(f'time to decrypt survey with 999 experts: {time_:.5f} seconds')

print(survey.interp_result())



