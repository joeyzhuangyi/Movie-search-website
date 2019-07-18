from flask import Flask,redirect, render_template, request, url_for
from flask_login import current_user, login_required

app = Flask(__name__)
# index page
@app.route("/",methods=["GET","POST"])
def index():

	return render_template('index.html')