from math import log2
import math
from typing import Any
from question import Question, Type
from answer import Answer
from result import Result
# from survey_encryptor import Survey_encryptor
# from survey_counter import Survey_counter

class Survey:

    def __init__(self,title,questions=None,experts_number=999,encrypted=False):
        self.title = title
        self._questions: list = questions
        self._results = None
        self.experts_number = experts_number
        self._encrypted = encrypted

    @property
    def answer_field(self):
        return self._answer_field

    @answer_field.setter
    def answer_field(self,field_name):
        self._answer_field = field_name

    def __iter__(self):
        return iter(self.title,self.experts_number)

    def set_key(self,keys):
        self.keys = keys

    @staticmethod
    def load(survey: dict[str,Any],experts_number=999):
        """
        upload a survey from the JSON format
        """
        title = survey.get('title',None)
        questions = survey.get('questions',None)
        if title is None or questions is None:
            return 'error'

        questions = [Question.load(**question) for question in questions]
        return Survey(title,questions=questions,experts_number=experts_number)


    def add_result(self,question,result):
        if self._results is None:
            self._results = []

        self._results.append(Result(question,result))

    def add_option(self,question_order,text,order=None):
        self.get_question_on_order(question_order).add_option(text,order)

    def get_result(self):
        return self._results

    def interp_result(self):
        d = {}
        n = self.experts_number
        k = math.ceil(log2(n))
        for index,result in enumerate(self._results):
            if result.result is None:
                continue
            r = result.result
            variant = 1
            c = dict()
            while r > 0:
                answer = r & int('1'* k,2)
                r = r >> k
                c[variant] = answer
                variant += 1
            d[f'question_{index}'] = c.copy()
        return d

    def load_question(self,**question):
        title = question.get('title',None)
        if self._questions is None:
            self._questions = []

        order = question.get('order',None)
        if order is None:
            order = len(self._questions)
        options = question.get('options',None)

        question = Question(title,order)
        if not question.is_correct():
            return 'error'

        question.load_options(options)
        self._questions.append(question)
        return 'uspex'


    def add_question(self,title,order=None,options=None):
        if self._questions is None:
            self._questions = []

        if order is None:
            order = len(self._questions)
        question = Question(title,order,options)
        if not question.is_correct():
            return 'error'

        question.load_options(options)
        self._questions.append(question)
        return 'uspex'

    def load_questions(self,questions:list):
        if len(questions) == 0:
            print('error')
        
        for question in questions:
            title = question.get('title',None)
            order = question.get('order',None)
            options = questions.get('options',None)
            q = Question(title,order,options)
            if q.is_correct():
                self._questions.append(q)
        
        return 'uspex'

    def get(self):
        if self._questions is None: return dict(title=self.title)

        questions = [question.get() for question in self._questions]
        return dict(
            title=self.title,
            questions=questions
        )

    def get_question_on_order(self,order) -> Question:
        self.__sort()
        return self._questions[order - 1]
        
    def __sort(self):
        self._questions.sort(key=lambda x: x.get()['order'])

    def add_answer(self,question_order,answer,type=None):
        question = self.get_question_on_order(question_order)
        question.encode_answer(self.experts_number,answer)
        #question.add_answer()


    def get_questions(self):
        questions = [question.get() for question in self._questions]
        return questions

    def get_answers(self):
        answers = [question.get_answers() for question in self._questions if question.get_answers() is not None]
        return answers

    # def generate_key(self):
    #     return Survey_encryptor.generate_key()

    # def encrypt(self,keys):
    #     Survey_encryptor.encrypt(self,keys)

    # def result(self):
    #     Survey_counter.result(self)

    # def decrypt(self,keys,pub_key):
    #     Survey_encryptor.decrypt(self,keys,pub_key) 



    