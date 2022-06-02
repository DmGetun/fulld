
class Option:

    def __init__(self,text=None,order=None):
        self.text = text
        self.order = order

    def is_correct(self):
        if self.text is None: return False
        if self.order is None: return False

        return True

    def load(**option):
        text = option.get('text',None)
        order = option.get('order',None)
        
        return Option(text,order)

    def __str__(self):
        return f'text:{self.text}\norder:{self.order}'

    def get(self):
        return dict(
            text=self.text,
            order=self.order
        )
    