from functools import partial
import math
from survey import Survey
from multiprocessing.pool import Pool
from functools import reduce

class Survey_counter():

    def __init__(self,survey:Survey):
        self.survey = survey


    def result(survey):
        survey:Survey = survey
        all_answers = survey.get_answers()
        with Pool() as p:
            func = partial(Survey_counter._result,survey.keys['public_exponent'])
            results = p.map_async(func,all_answers)
            for question,result in zip(all_answers,results.get()):
                survey.add_result(question,result)
            
        return survey._results

    def _result(n,answers):
            result = Survey_counter.summator(answers,n)
            result = Survey_counter.result_parser(result)
            return result

    def result_parser(result):
        return result

    def summator(answers,n):
        res = reduce(lambda a,b: (a * b) % (n * n),[answer.value for answer in answers]) % (n * n)
        #res = math.prod([answer.value for answer in answers]) % (n * n)
        return res