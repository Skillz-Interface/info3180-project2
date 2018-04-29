from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_wtf.csrf import CSRFProtect

UPLOAD_FOLDER = './app/static/uploads'
TOKEN_SECRET = 'AnonymousTou'

app = Flask(__name__)
app.config['SECRET_KEY'] = "change this to be a more random key"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://aizknwhytalaeg:c38d34261334567a0407f6d6402b01dff99c0bda6ac01495514f0577d2a2b037@ec2-23-23-142-5.compute-1.amazonaws.com:5432/dd4jcmvh77bd7f'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)
csrf = CSRFProtect(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'



app.config.from_object(__name__)
file_folder = app.config['UPLOAD_FOLDER']
token_key = app.config['TOKEN_SECRET']
from app import views