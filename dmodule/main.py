import math
import pprint
from survey.DATA import data
from survey.survey import Survey
from survey.question import Question
from survey.option import Option
from survey.survey_encryptor import Survey_encryptor

pp = pprint.PrettyPrinter(indent=1)
pp.pprint(data)

survey = Survey('Первый')

survey.add_question('Первый вопрос')
survey.add_question('Второй вопрос')
survey.add_question('Третий вопрос')
pp.pprint(survey.get())
print('-' * 50)
survey = Survey('Второй')
question = Question('первый вопрос')
survey.load_question(**question.get())
question = Question('Второй вопрос')
question.add_option('Первый ответ')
survey.load_question(**question.get())

question = survey.get_question_on_order(0)
survey.add_answer(question,123)

pp.pprint(survey.get())

answers = survey.get_answers()
print(answers)

encryptor = Survey_encryptor(survey)
message = 8
message2 = 10
keys = encryptor.generate_key()
encr = encryptor.message_encrypt(message,(keys['public_key'],keys['public_exponent']))
encr2 = encryptor.message_encrypt(message2,(keys['public_key'],keys['public_exponent']))
print(encr)
encr = encr*encr2
print(encr)
decr = encryptor.dectypt_message(encr,(keys['private_key'],keys['private_exponent']),keys['public_exponent'])
print(decr)
