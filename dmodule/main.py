from datetime import datetime
import pprint
from survey.survey_counter import Survey_counter
from survey.DATA import data
from survey.survey import Survey
from survey.question import Question
from survey.option import Option
from survey.survey_encryptor import Survey_encryptor

pp = pprint.PrettyPrinter(indent=1)
pp.pprint(data)

survey = Survey.load(**data)
print(survey.get_questions())

pp.pprint(survey.get())

answers = survey.get_answers()
print(answers)

encryptor = Survey_encryptor(survey)
message = 2
message2 = 151
start = datetime.now()
keys = encryptor.generate_key()

encr2 = encryptor.message_encrypt(message,(keys['public_key'],keys['public_exponent']))
decr = encryptor.message_dectypt(encr2,(keys['private_key'],keys['private_exponent']),keys['public_exponent'])
time = datetime.now() - start
print(f'{time=}')
print(f'{decr=}')

result = Survey_counter(survey)
survey.add_answer(survey.get_question_on_order(0),'2')
survey.add_answer(survey.get_question_on_order(0),'1')
result.result()



