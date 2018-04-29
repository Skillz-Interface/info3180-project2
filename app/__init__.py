from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_wtf.csrf import CSRFProtect

UPLOAD_FOLDER = './app/static/uploads'
TOKEN_SECRET = 'AnonymousTou'

app = Flask(__name__)
app.config['SECRET_KEY'] = "change this to be a more random key"
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://skillz:skillz@localhost/photogram"
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