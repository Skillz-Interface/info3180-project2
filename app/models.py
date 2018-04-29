from . import db,bcrypt
import datetime

class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))
    username = db.Column(db.String(80))
    password = db.Column(db.String(255))
    email = db.Column(db.String(100))
    biography = db.Column(db.String(140))
    location = db.Column(db.String(100))
    profile_photo = db.Column(db.String(255))
    joined_on = db.Column(db.DateTime)

    def __init__(self, fName, lName, username, password, email, biography, location, profile_photo,joined_on):
        self.first_name = fName
        self.last_name = lName
        self.username = username
        self.password = bcrypt.generate_password_hash(password) 
        self.email = email
        self.biography = biography
        self.location = location
        self.profile_photo = profile_photo
        self.joined_on = joined_on

       
    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)
class Posts(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer)
    photo = db.Column(db.String(255))
    caption = db.Column(db.String(600))
    created_on = db.Column(db.DateTime)
    def __init__(self, user_id, photo,caption,created_on):
        self.user_id = user_id
        self.photo = photo
        self.caption = caption
        self.created_on = created_on
        
class Likes(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer)
    post_id = db.Column(db.Integer)
    def __init__(self, user_id, post_id):
        self.user_id = user_id
        self.post_id = post_id
      
class Follows(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer)
    follower_id = db.Column(db.Integer)
    def __init__(self,user_id,follower_id):
        self.user_id = user_id
        self.follower_id = follower_id