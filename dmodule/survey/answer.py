

from multiprocessing.connection import answer_challenge

class Answer:

    def __init__(self,question,answer,type=None):
        self.question = question
        self.answer = answer
        self.type=type

    def get(self):
        return dict(
            answer = self.answer
        )

    

    