from google.appengine.ext import ndb

def ancestor():
    return ndb.Key("Locations", "locations")

class Location(ndb.Model):
    coordinates = ndb.GeoPtProperty()
    amenity = ndb.StringProperty()
    color = ndb.IntegerProperty()
    # user = ndb.UserProperty()
    date = ndb.DateTimeProperty(auto_now_add=True)
    notes = ndb.StringProperty()