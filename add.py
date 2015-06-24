import webapp2
from models import Location, ancestor
from google.appengine.ext import ndb

amenities = ['bathroom', 'curbcut', 'elevator', 'entrance', 'gas',
             'lodging', 'parking', 'transport', 'rentalvehicle']

def save_location(latitude, longitude, color, notes):
    location = Location(parent=ancestor(),
                        coordinates=ndb.GeoPt(latitude, longitude),
                        amenity=amenities[color],
                        color=color,
                        notes=notes)
    location.put()


class LocationHandler(webapp2.RequestHandler):
    def post(self):
        latitude = float(self.request.get('latitude'))
        longitude = float(self.request.get('longitude'))
        color = int(self.request.get('amenity'))
        notes = self.request.get('notes')
        save_location(latitude, longitude, color, notes)
        self.redirect('/')

    def get(self):
        self.redirect('/')


app = webapp2.WSGIApplication([
    ('/add', LocationHandler),
], debug=True)
