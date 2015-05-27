from google.appengine.ext import ndb


class Location(ndb.Model):
    coordinates = ndb.GeoPtProperty()
    amenity = ndb.StringProperty()
    date =  ndb.DateTimeProperty(auto_now_add=True)