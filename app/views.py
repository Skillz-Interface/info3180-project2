from app import app, db, login_manager,token_key
from flask import render_template,g, request, redirect, url_for, flash, jsonify,session
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.utils import secure_filename
from forms import *
from models import *
from functools import wraps
import jwt
import random, os, datetime, urlparse
import datetime
from flask_bcrypt import Bcrypt


###
# Routing for your application.
###
def serialize(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None)
    if not auth:
      return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
    elif len(parts) == 1:
      return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
    elif len(parts) > 2:
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

    token = parts[1]
    try:
         payload = jwt.decode(token, token_key)
         get_user = UserProfile.query.filter_by(id=payload['user_id']).first()

    except jwt.ExpiredSignature:
        return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
    except jwt.DecodeError:
        return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

    g.current_user = user = get_user
    return f(*args, **kwargs)

  return decorated

@app.route('/')
def home():
    form = CreateUserForm()
    """Render website's home page."""
    return render_template('home.html', form = form)


@app.route('/about/')
def about():
    """Render the website's about page."""
    return render_template('about.html')


    
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

def jsonerrors(errors):

    """Return json errors"""
    errors_list = []
    for error in errors:
        errors_list.append(dict({'error':error}))
    return jsonify({'Errors':errors_list}) 
def randomDefaultProfilePic():
    return "default/default-" + str(random.randint(1, 7)) + ".jpg"


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to tell the browser not to cache the rendered page.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404
    
        
@login_manager.user_loader
def load_user(id):
    return UserProfile.query.get(int(id))
    
###----------------------------------- START OF SPECIFIED API ROUTES ---------------------------------------------###

#Accepts user information and saves it to the database
#Registering User
@app.route('/api/users/register', methods=["POST"])
def register():
    """Accepts user information and saves it to the database."""
    form = CreateUserForm()
    
    if request.method == "POST" and form.validate_on_submit():
                file_folder = app.config['UPLOAD_FOLDER']
                file = request.files['imgfile']
                filename = secure_filename(file.filename)
                file.save(os.path.join(file_folder, filename))
                f = request.form['fName']
                l = request.form['lName']
                u = request.form['userName']
                e = request.form['email']
                b = request.form['bio']
                loc = request.form['location']
                passw = request.form['password']
                cpass = request.form['confirm']
                joined = datetime.datetime.now()
            
                NewProfile = UserProfile(fName=f, lName=l, username=u,password = passw,email= e,biography = b,location = loc, profile_photo=filename,joined_on = joined)
                                        

                db.session.add(NewProfile)
                db.session.commit()

                flash('Profile created and successfully saved', 'success')
                login_user(NewProfile)
                msg = { "message": "Registration Successful!" }
                return jsonify(msg=msg)
    error_collection = form_errors(form)
    error = [{'errors': error_collection}]
    return  jsonify(errors=error)
    
                
        
    
#Accepts login credentials as username and password 
#Log in user
@app.route('/api/auth/login', methods=["POST"])
def login():
    """Accepts login credentials as email and password"""
    # If the user is already logged in then it will just return them to the 
    # home page 
    # Login credentials: username: skillz password: 1234,
    #                             keke             1234,
    #                             nishi            12345
    

    
    form = LoginForm()
    if request.method == "POST" and form.validate_on_submit():
        
            # Get the username and password values from the form.
            uname = request.form['username']
            password = request.form['password']
            session['username'] = uname
            
            user = UserProfile.query.filter_by(username=uname).first()
            session['user_id'] = user.id
            payload = {'user_id': user.id}
            token = jwt.encode(payload, token_key)
            if user is not None: 
                # Compares Bcrypt hash to see if password is correct
                if (bcrypt.check_password_hash(user.password, password)):
                    login_user(user)
                    msg = "Login Successful"
                    return jsonify ({"data" :{'token': token,'userid':user.id},"message":"Login Sucessful"})
            else:
                msg = {"message":"Username or Password is incorrect."}
                return jsonify(msg=msg, errors = form_errors(myform))
  
#Logout a user

@app.route("/api/auth/logout")
@serialize
def logout():
    g.current_user = None
    session.pop('user_id', None)
    session.pop('username', None)
    msg = {"message":"You have been logged out"}
    return jsonify(msg = msg )
    

#Used for adding posts to the users feed
@app.route("/api/users/<user_id>/posts",methods=['POST'])
@serialize
@login_required
def post(user_id):
    form = UploadForm()
    
    if request.method =='POST' and form.validate_on_submit():
        file_folder = app.config['UPLOAD_FOLDER']
        uid = user_id
        capt = request.form['caption']
        file = request.files['photo']
        filename = secure_filename(file.filename)
        file.save(os.path.join(file_folder, filename))
        cur = datetime.datetime.now()
        Post = Posts(user_id = uid, photo = filename, caption = capt,created_on= cur)
        
        db.session.add(Post)
        db.session.commit()
                                
        result = [
            {
            'message': 'Post Upload Successful', 
            'filename': filename, 
            'caption': capt
                
            }
            ]
        return jsonify(result=result)
    error_collection = form_errors(form)
    error = [{'errors': error_collection}]
    return  jsonify(errors=error)
#Returns a user's posts
@app.route("/api/users/<userid>/posts",methods=['GET'])
@serialize
@login_required
def postget(userid):
    Post = []
    user = UserProfile.query.filter_by(id=userid).first()
    tempo = Posts.query.filter_by(user_id=userid).all()
    if  not user:
        return jsonify({'errors': "No user Found"})
    
    for i in tempo:

        Postsinfo= {
            "message": "Post",
            "id": i.id,
            "photo": i.photo,
            "user_id": i.user_id,
            "caption":i.caption,
            "created_on": i.created_on
    
        }
        
        Post.append(Postsinfo)
    return jsonify(Post=Post)


#Create a Follow relationship between the current user and the target user
@app.route("/api/users/<userid>/follow",methods=['POST','GET'])
@serialize
@login_required
def follow(userid):
    if request.method == "POST":
        Follow = []
        if (userid != session['user_id']):
           
            
            Follow = []
            val = True
            count = 0
            #Check for a follow relation
            temp=Follows.query.filter_by(user_id=userid, follower_id=session['user_id']).first()
            if (temp == None):
                val = False
            
                Follower = Follows(user_id=userid,follower_id=session['user_id'])
                db.session.add(Follower)
                db.session.commit()
                
                #Track number of followers
                
                followers = Follows.query.filter_by(user_id = userid).all()
                for i in followers:
                    count=count+1
                for m in followers:
                    Follo = {
                            "message": "You have sucessfully followed one more person",
                            "id": m.id,
                            "user_id": userid,
                            "follower_id":session['user_id'],
                            "Status": val,
                            "count": count
                        }
                Follow.append(Follo)
                return jsonify(Follow=Follow)
            val=True
            Follo = {"message": "Already Following"}
            Follow.append(Follo)
            return jsonify(Follow=Follow)
        else:
            Follo={
                "message": "Cannot follow yourself"
            }
            Follow.append(Follo)
            return jsonify(Follow=Follow)
       
    if request.method == "GET":
        Follow = []
        val = True
        count = 0
        #Track amount followers
        followers = Follows.query.filter_by(user_id = userid).all()
        print(followers)
        if len(followers) == 0:
            count = 0
            temp=Follows.query.filter_by(user_id=userid, follower_id=session['user_id']).first()
            print(temp)
            print(temp)
            if (temp != None):
                val = True
            val = False
           
            Follo = {
                        "message": "GET INFO",
                        "user_id": userid,
                        "follower_id":session['user_id'],
                        "Status": val,
                        "count": count
                    }
            Follow.append(Follo)
        else:
            for i in followers:
                count=count+1
        #Check if a follow relation exists   
                temp=Follows.query.filter_by(user_id=userid, follower_id=session['user_id']).first()
                print(temp)
                
                if (temp != None):
                    val = True
                    for m in followers:
                        Follo = {
                                "message": "GET INFO",
                                "id": m.id,
                                "user_id": userid,
                                "follower_id":session['user_id'],
                                "Status": val,
                                "count": count
                            }
                    Follow.append(Follo)
                val = False
                for m in followers:
                    Follo = {
                            "message": "GET INFO",
                            "id": m.id,
                            "user_id": userid,
                            "follower_id":session['user_id'],
                            "Status": val,
                            "count": count
                        }
                    Follow.append(Follo)
    
        
        return jsonify(Follow=Follow)
    
        
        
#Return all posts for all users        
@app.route("/api/posts")
@serialize
@login_required
def posts():
    countter = 0
    Pos = Posts.query.all()
    Post=[]
    for i in Pos:
        user= UserProfile.query.filter_by(id = i.user_id).first()
        likes = Likes.query.filter_by(post_id = i.id).all()
        for m in likes:
            countter = countter + 1
        created_on = i.created_on.strftime("%d %b %Y")
        distinct = Likes.query.filter_by(user_id=session['user_id'], post_id= i.id).first()
        if(distinct is None):
            heart = False
        else:
            heart = True
        Poster={
            'postid': i.id,
            'user_id': i.user_id,
            'photo': i.photo,
            'caption': i.caption,
            'created_on': created_on,
            'username': user.username,
            'proPhoto': user.profile_photo,
            "likes":countter,
            "heart":heart
        }
        
        Post.append(Poster)
    return jsonify(data = Post)
        

#Set a like on the current Post by the logged in User        
@app.route("/api/posts/<postid>/like",methods=['POST'])
@serialize
@login_required
def like(postid):
    liked = Likes.query.filter_by(user_id=session['user_id'], post_id=postid).first()
    temp=UserProfile.query.filter_by(username=session['username']).all()
    met = {"mesg":"Already liked this Post"}
    if (liked is None):
        like = Likes(user_id=session['user_id'],post_id=postid)
        db.session.add(like)
        db.session.commit()
        mes = {"message":"You liked a Post"}
        
        return jsonify(message=mes)
    return jsonify (mesg = met)


#Get User Profile
@app.route('/api/users/<user_id>/', methods=["GET"])
@serialize
@login_required
def get_user(user_id):
    count=0
    user = UserProfile.query.filter_by(id=user_id).first()
    Pot = Posts.query.filter_by(user_id= user_id).all()
    for m in Pot:
        count = count + 1

        
    output = []
    
    if (user_id == session['user_id']):
        print("reach")
        join= user.joined_on.strftime("%B %Y");
        info= {"userid": user.id, "username": user.username, "firstname": user.first_name, "lastname": user.last_name, "email": user.email, "location": user.location, "biography": user.biography,"photo": user.profile_photo, "joined_on": join,"auser":True,"poscount":count}
        output.append(info)
        return jsonify(profile = output)
    join= user.joined_on.strftime("%B %Y");
    info= {"userid": user.id, "username": user.username, "firstname": user.first_name, "lastname": user.last_name, "email": user.email, "location": user.location, "biography": user.biography,"photo": user.profile_photo, "joined_on": join, "auser":False,"poscount":count}
    output.append(info)
    return jsonify(profile= output)










def current():
    temp=UserProfile.query.filter_by(username=session['username']).all()
    for t in temp:
           tes = [{
            "Id": t.id,
            "Name": t.fName +" "+ t.lName,
            "location": t.location,
            "Joined": t.joined_on,
            "Biography": t.biography,
            "Photo": t.profile_photo,
            "Post": num,
            "Followers": numf
        }]
    return jsonify(tes=tes)


if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0",port="8080")
    
    
    
    
    
    
