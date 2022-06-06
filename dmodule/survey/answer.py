

class Answer:

    def __init__(self,question,answer,type=None):
        self.question = question
        self.answer = answer
        self.type=type

    def get(self):
        return dict(
            answer = self.answer
        )
    
    @property
    def value(self):
        return self.answer

    @value.setter
    def value(self,value):
        self.answer = value

    

    