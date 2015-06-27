import webapp2
import jinja2
import os
from google.appengine.ext import ndb
from models import Location, ancestor
import json

class ListHandler(webapp2.RequestHandler):
    def get(self):
        query = Location.query(ancestor=ancestor())
        locations = []
        for loc in query.fetch():
            if loc.coordinates.lat and loc.coordinates.lon:
                dic = {'id': loc.key.id(),
                       'latitude': loc.coordinates.lat,
                       'longitude': loc.coordinates.lon,
                       'amenity': loc.amenity,
                       'color': loc.color}
                locations.append(dic)
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(locations))


app = webapp2.WSGIApplication([
    ('/list', ListHandler),
], debug=True)
