
class Option:

    def __init__(self,text,order=None):
        self.text = text
        self.order = order

    def is_correct(self):
        if self.text is None: return False
        if self.order is None: return False

        return True    

    def __str__(self):
        return f'text:{self.text}\norder:{self.order}'

    def get(self):
        return dict(
            text=self.text,
            order=self.order
        )
    