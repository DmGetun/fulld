from answer import Answer
from question import Question
from question import Type
from math import log2
import math

class Quantitative_question(Question): # количественный 
    
    def __init__(self,factor,range,title=None,order=None,options=None):
        super().__init__(title,order,options,Type.quantitative)
        self.factor = factor
        self.range = range

class Qualitative_question(Question): # качественный
    
    def __init__(self,title=None,order=None,options=None):
        super().__init__(title,order,options,Type.qualitative)

    def encode_answer(self,experts_number,answer):
        encoded_answer = self.test_encode(experts_number,answer)
        answer = Answer(self.order,encoded_answer)
        self.add_answer(answer)

    
    def test_encode(self,experts_number,answer):
        n = experts_number
        k = math.ceil(log2(n))
        encode_answer = 2 ** (k * (answer - 1))
        return encode_answer

