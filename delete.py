import webapp2
from google.appengine.ext import ndb
from models import Location, ancestor

class DeleteHandler(webapp2.RequestHandler):
    def get(self, id):
        location = Location.get_by_id(int(id), parent=ancestor())
        if location:
            location.key.delete()
            self.response.write('Location deleted')
        else:
            self.response.write('Location not found.')
        
        
app = webapp2.WSGIApplication([
    (r'/delete/(\d+)', DeleteHandler),
], debug=True)
