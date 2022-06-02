from survey.question import Question
from survey.question import Type

class Quantitative_question(Question):
    
    def __init__(self,title=None,order=None,options=None):
        super().__init__(title,order,options,Type.quantitative)

class Qualitative_question(Question):
    
    def __init__(self,title=None,order=None,options=None):
        super().__init__(title,order,options,Type.qualitative)

