from random import random, randint
import json

def random_points(N=50, lat=44.874, lng=-91.927, dx=0.01, dy=0.01):
    locations = []
    for i in xrange(N):
        location = dict(
            lat = lat + dx * (2 * random() - 1),
            lng = lng + dy * (2 * random() - 1),
            color = randint(0, 7))
        locations.append(location)
    return locations
    
if __name__ == '__main__':
    print json.dumps(random_points(120), indent=4)  
