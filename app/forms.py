from models import *
from flask_wtf import FlaskForm
from wtforms import *
from wtforms import TextAreaField,FileField
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms.validators import DataRequired, InputRequired



class CreateUserForm(FlaskForm):
    
    fName = StringField('First Name', validators=[InputRequired(message = 'First Name Required')])

    lName = StringField('Last Name', validators =[InputRequired(message='Last Name Required')])
    
    userName = StringField('Username',validators =[InputRequired(message='User Name Required')])

    email = StringField('E-mail', validators= [InputRequired(message = 'Email Required')] )
    bio = StringField('(Optional) Profile Bio', validators=[validators.Length(min=0, max=140)])
    location = StringField('Location', validators=[validators.Length(min=0, max=140)])
        
    password = PasswordField('New Password', validators= [DataRequired(),
        validators.Length(max=70),
        validators.EqualTo('confirm', message='Passwords must match')
    ])

    confirm = PasswordField('Repeat Password',[
        validators.DataRequired(),
        validators.Length(max=70),
        validators.EqualTo('password', message='Passwords must match')])
    imgfile = FileField('Photo',validators=[ FileAllowed(['jpg', 'png'], 'Images only!')])
   
    
  

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[validators.DataRequired()])
    password = PasswordField('Password', validators=[validators.DataRequired()])
    
class UploadForm(FlaskForm):
    caption = TextAreaField('Description',validators=[InputRequired(message='Description Needed')])
    photo = FileField('Photo',validators=[FileRequired('Upload a photo please'), FileAllowed(['jpg', 'png'], 'Images only!')])


