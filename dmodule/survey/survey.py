from functools import singledispatch

from survey.question import Question
from survey.answer import Answer


class Survey:

    def __init__(self,title,questions=None):
        self.title = title
        self._questions: list = questions

    def load(self,**survey):
        title = survey.get('title',None)
        questions = survey.get('questions',None)
        if title is None or questions in None:
            return 'error'

        self.title = title
        self._questions = questions


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

    def get_question_on_order(self,order):
        self.__sort()
        return self._questions[order]
        
    def __sort(self):
        self._questions.sort(key=lambda x: x.get()['order'])

    def add_answer(self,question,answer,type=None):
        order = question.get()['order']
        answer = Answer(order,answer)
        self._questions[order].add_answer(answer)

    def get_questions(self):
        questions = [question.get() for question in self._questions]
        return questions

    def get_answers(self):
        answers = [question.get_answers() for question in self._questions]
        return answers

    

        



    