import webapp2
from models import Location
from google.appengine.ext import ndb


def save_location(latitude, longitude, amenity):
    location = Location(parent=ndb.Key("Locations", "locations"),
                        coordinates=ndb.GeoPt(latitude, longitude),
                        amenity=amenity)
    location.put()
    print "location saved"


class LocationHandler(webapp2.RequestHandler):
    def post(self):
            latitude = float(self.request.get('latitude'))
            longitude = float(self.request.get('longitude'))
            amenity = self.request.get('amenity')
            save_location(latitude, longitude, amenity)
            self.redirect('/')


app = webapp2.WSGIApplication([
    ('/add', LocationHandler),
], debug=True)