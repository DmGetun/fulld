

class Result:
    def __init__(self,question,result):
        self.question = question
        self.result = result

    def get_value(self):
        return self.result

    def set_value(self,result):
        self.result = result