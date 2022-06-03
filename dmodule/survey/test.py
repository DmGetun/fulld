from datetime import datetime
import pprint
from survey_counter import Survey_counter
from DATA import data
from survey import Survey
from survey_encryptor import Survey_encryptor

pp = pprint.PrettyPrinter(indent=1)
pp.pprint(data)

survey = Survey.load(**data)
encryptor = Survey_encryptor(survey)
for _ in range(700):
    survey.add_answer(survey.get_question_on_order(0),2)

for _ in range(200):
    survey.add_answer(survey.get_question_on_order(0),1)

keys = survey.generate_key()
private_keys = (keys['private_key'],keys['private_exponent'])
public_keys = (keys['public_key'],keys['public_exponent'])
survey.encrypt(public_keys)
survey.result()
survey.decrypt(private_keys,keys['public_key'])

print(survey.get())
