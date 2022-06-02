from audioop import mul
from survey import Survey
import math

class Survey_counter():

    def __init__(self,survey:Survey):
        self.survey = survey


    def result(self):
        survey:Survey = self.survey
        questions = survey.get_answers()
        for question in questions:
            if question.get('answers',None) is None:
                continue
            result = self.summator(question['answers'])
            survey.add_result(question,result)

    def summator(self,answers):
        res = math.prod([answer.value for answer in answers])
        return res