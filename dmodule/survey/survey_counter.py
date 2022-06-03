from survey import Survey
import math

class Survey_counter():

    def __init__(self,survey:Survey):
        self.survey = survey


    def result(survey):
        survey:Survey = survey
        questions = survey.get_answers()
        for question in questions:
            if question.get('answers',None) is None:
                continue
            result = Survey_counter.summator(question['answers'])
            result = Survey_counter.result_parser(result)
            survey.add_result(question,result)

    def result_parser(result):
        pass # добавить расшифровку с группировкой по числу ответов

    def summator(self,answers):
        res = math.prod([answer.value for answer in answers])
        return res