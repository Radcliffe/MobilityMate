import webapp2
import jinja2
import os
from google.appengine.api import users

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)


class NewLocation(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if not user:
            self.redirect(users.create_login_url(self.request.uri))
        template = JINJA_ENVIRONMENT.get_template('new.html')
        template_values = {}
        self.response.write(template.render(template_values))

app = webapp2.WSGIApplication([
    ('/new', NewLocation),
], debug=True)

