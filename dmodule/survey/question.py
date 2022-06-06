from option import Option
from answer import Answer

class Type:
    quantitative = 'quantitative' # количественный
    qualitative = 'qualitative' # качественный

class Question:

    def __init__(self,title=None,order=None,options=None,type=None):
        self.title = title
        self.order = order
        self.type = type
        self.options: list = options
        self.answers: list = None

    def is_correct(self):
        if self.title is None: return False
        if self.order is None: return False

        return True

    def __getitem__(self,key):
        return getattr(self,key)

    @property
    def get_type(self):
        return self.type

    def load(**question):
        title = question.get('title',None)
        order = question.get('order',None)
        options = question.get('options',None)
        type = question.get('type',None)
        if not options is None:
            options = [Option.load(**option) for option in options]

        if type == Type.qualitative:
            return Qualitative_question(title,order,options)
        return Quantitative_question(1,0,title,order,options)

    def add_option(self,text,order=None):
        if self.options is None:
            self.options = []
        if order is None:
            order = len(self.options)
        option = Option(text,order)
        self.options.append(option)

    def load_option(self,**option):
        if self.options is None:
            self.options = []
        text = option.get('text',None)
        order = option.get('order',len(self.options) - 1)
        o = Option(text,order)
        if not o.is_correct():
            return 'error'
        
        self.options.append(o)
        return 'uspex'

    def load_options(self,options:list):
        if options is None: return
        for option in options:
            self.loadoption(**option)

        return 'uspex'

    def __str__(self):
        if self.options is None: 
            return f'title:{self.title}\norder:{self.order}'

        options = ''.join([str(option) for option in self.options])
        return f'title:{self.title}\norder:{self.order}\noptions:{options}'

    def __dict__(self):
        if self.options is None: 
            return dict(title=self.title,order=self.order)

        return dict(
            title=self.title,
            order=self.order,
            options=self.options
        )

    def get(self):
        if self.options is None: 
            return dict(title=self.title,order=self.order)

        options = [option.get() for option in self.options]  

        return dict(
            title=self.title,
            order=self.order,
            options=options
        )

    def add_answer(self,answer:Answer):
        if self.answers is None:
            self.answers = []

        self.answers.append(answer)

    def get_answers(self):
        answers = [answer for answer in self.answers] if self.answers is not None else None
        return answers

class Quantitative_question(Question): # количественный 
    
    def __init__(self,factor,range,title=None,order=None,options=None):
        super().__init__(title,order,options=None,type=Type.quantitative)
        self.factor = factor
        self.range = range

    def encode_answer(self,experts_number,answer):
        answer = Answer(self.order,answer)
        self.add_answer(answer)

import math
class Qualitative_question(Question): # качественный
    
    def __init__(self,title=None,order=None,options=None):
        super().__init__(title,order,options,Type.qualitative)

    def encode_answer(self,experts_number,answer):
        encoded_answer = self.test_encode(experts_number,answer)
        answer = Answer(self.order,encoded_answer)
        self.add_answer(answer)

    
    def test_encode(self,experts_number,answer):
        n = experts_number
        k = math.ceil(math.log2(n))
        encode_answer = 2 ** (k * (answer - 1))
        return encode_answer
        
