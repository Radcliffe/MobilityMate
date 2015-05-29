import webapp2
from models import Location, ancestor
from google.appengine.ext import ndb
from google.appengine.api import users

amenities = ['Bathroom', 'Entrance', 'Curb cut', 'Elevator',
             'Public transport', 'Hotel', 'Recreation', 'Parking']

def save_location(latitude, longitude, color, notes):
    location = Location(parent=ancestor(),
                        coordinates=ndb.GeoPt(latitude, longitude),
                        amenity=amenities[color],
                        color=color,
                        notes=notes)
    location.put()
    print "location saved"


class LocationHandler(webapp2.RequestHandler):
    def post(self):
        user = users.get_current_user()
        if not user:
            self.redirect(users.create_login_url(self.request.uri))
        if user:
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
