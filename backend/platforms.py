
class Platform:
    def __init__(self,name,price=0,link=None):
        self._name=  name
        self._link = link
        self._price = price
    def getLink(self):
        return self._link
    def getPrice(self):
        return self._price
    def getName(self):
        return self._name
    def setLink(self,l):
        self._link = l
    def setPrice(self,p):
        self._price = p
    def setName(self,n):
        self._name = n
        