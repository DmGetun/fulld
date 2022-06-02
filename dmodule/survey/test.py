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
survey.add_answer(survey.get_question_on_order(0),2)
survey.add_answer(survey.get_question_on_order(0),1)
keys = Survey_encryptor.generate_key()
encrypt_survey = encryptor.encrypt((keys['public_key'],keys['public_exponent']))


value1 = encrypt_survey.get_answers()[0]['answers'][0].value
value2 = encrypt_survey.get_answers()[0]['answers'][1].value
print(value1 * value2)
decr = encryptor.message_dectypt(value1*value2,(keys['private_key'],keys['private_exponent']),keys['public_exponent'])
print(decr)
result = Survey_counter(encrypt_survey)
result.result()
print(result)

decrypt_survey = encryptor.decrypt((keys['private_key'],keys['private_exponent']),keys['public_exponent'])
print()
