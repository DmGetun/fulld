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
        self._options: list = options
        self._answers: list = None

    def is_correct(self):
        if self.title is None: return False
        if self.order is None: return False

        return True

    @property
    def get_type(self):
        return self.type

    def load(**question):
        title = question.get('title',None)
        order = question.get('order',None)
        options = question.get('options',None)
        if not options is None:
            options = [Option.load(**option) for option in options]

        return Question(title,order,options)

    def add_option(self,text,order=None):
        if self._options is None:
            self._options = []
        if order is None:
            order = len(self._options)
        option = Option(text,order)
        self._options.append(option)

    def load_option(self,**option):
        if self._options is None:
            self._options = []
        text = option.get('text',None)
        order = option.get('order',len(self._options) - 1)
        o = Option(text,order)
        if not o.is_correct():
            return 'error'
        
        self._options.append(o)
        return 'uspex'

    def load_options(self,options:list):
        if options is None: return
        for option in options:
            self.load_option(**option)

        return 'uspex'

    def __str__(self):
        if self._options is None: 
            return f'title:{self.title}\norder:{self.order}'

        options = ''.join([str(option) for option in self._options])
        return f'title:{self.title}\norder:{self.order}\noptions:{options}'

    def __dict__(self):
        if self._options is None: 
            return dict(title=self.title,order=self.order)

        return dict(
            title=self.title,
            order=self.order,
            options=self._options
        )

    def get(self):
        if self._options is None: 
            return dict(title=self.title,order=self.order)

        options = [option.get() for option in self._options]  

        return dict(
            title=self.title,
            order=self.order,
            options=options
        )

    def add_answer(self,answer:Answer):
        if self._answers is None:
            self._answers = []

        self._answers.append(answer)

    def get_answers(self):
        answers = [answer for answer in self._answers] if self._answers is not None else None

        return dict(
            order=self.order,
            answers=answers
        )
        
