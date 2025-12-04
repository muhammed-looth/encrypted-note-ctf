from datetime import datetime
from flask import Flask, jsonify, abort, render_template, url_for, request, redirect, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import os
import time
import time
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

app = Flask(
    __name__,
    static_folder=os.path.join(BASE_DIR, 'static'),
    template_folder=os.path.join(BASE_DIR, 'templates')
)


app.config['SECRET_KEY'] = 'supersecretkey'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(250), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


VALID_USERNAME = "charlie"
VALID_PASSWORD = "password@321"  # make it strong

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        # Hardcoded login check
        if username == VALID_USERNAME and password == VALID_PASSWORD:
            # Check if user exists in DB
            user = User.query.filter_by(username=username).first()

            # If not, create it (optional)
            if not user:
                user = User(username=username, password=generate_password_hash(password))
                db.session.add(user)
                db.session.commit()

            # Login the user
            login_user(user)

            return redirect("/matrix")

        flash("ACCESS DENIED — INVALID CREDENTIALS")
        return redirect("/")

    return render_template("login.html")


@app.route('/matrix')
@login_required
def matrix():
    return render_template('matrix.html')






NOTES_DIR = './notes'

# This is a mock global variable that could leak data in race
average_response_time = 0

@app.route('/notes/<int:note_id>')
def get_note(note_id):
    filename = os.path.join(NOTES_DIR, f'note_{note_id}.json')
    if not os.path.exists(filename):
        abort(404)

    start_time = time.time()

    # Simulate race window
    time.sleep(0.05)  # 50 ms window

    # During the sleep, suppose attacker replaces the file or alters it
    with open(filename, 'r') as f:
        data = json.load(f)

    # Simulate leak: intentionally expose part of RSA encrypted key or plaintext
    # e.g., send only part of the data based on response time
    elapsed = time.time() - start_time
    leak_factor = int(elapsed * 100) % 2  # Random partial leak based on timing


        # -----------------------------
    # 🔥 SPECIAL BEHAVIOR FOR NOTE ID 61
    # -----------------------------
    if note_id == 61:
        # Add meaningless padding to artificially increase the response size
        data["padding"] = "X" * 500  # Increase size by 500 bytes (adjust as needed)

        # Optionally leak a larger preview to make it stand out
        if leak_factor:
            return jsonify({
                "note_id": note_id,
                "leak_preview": data.get("rsa_enc_key", "")[:50],  # leak more
                "padding": data["padding"],
                "msg": "partial leak"
            })

        return jsonify(data)

    if leak_factor:
        # Leak part of RSA encrypted key (simulate partial leak)
        partial_response = {
            'note_id': note_id,
            'partial_rsa_enc_key': data.get('rsa_enc_key', '')[:10],  # first 10 chars
            'leak': 'partial rsa key leak'
        }
        return jsonify(partial_response)
    else:
        # Return full data normally
        return jsonify(data)








# @app.route('/')
# def loginPage():
#     return render_template('login.html') 

# @app.route('/chat-app')
# def chatPage():
#     return render_template('chat-app.html')

@app.route('/bcc4d4f0381c74919db335641dc13b085bf1d0fd')
def mazePage():
    return render_template('maze.html')

@app.route('/glitch')
def glitchPage():
    return render_template('glitch.html')

@app.route('/d969e7e0b0571370cd6763192bc24ac56c255472')
def phantomPage():
    return render_template('phantom.html')

@app.route('/cipherlab')
def cipherLabPage():
    return render_template('cipherlab.html')

@app.route('/mirror')
def mirrorPage():
    return render_template('mirror.html')

@app.route('/9424ac79de34c97c74261622b533d185ca13968a')
def noisePage():
    return render_template('noise.html')

@app.route('/neon')
def neonPage():
    return render_template('neon.html')

@app.route('/ed9d3d832af899035363a69fd53cd3be8f71501c')
def shadowPage():
    return render_template('shadow.html')

@app.route('/ddcb4be46283a08885a8347abe4142e6630f62e8')
def puzzlePage():
    return render_template('puzzle.html')

@app.route('/357de8f622ff2aaeb5073eabcb4b770be81cb56a')
def labyrinthPage():
    return render_template('labyrinth.html')

@app.route('/leaked_chat')
def leaked_chat():
    return render_template('leaked_chat.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/error')
def error():
    return render_template('error.html')

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')






class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(250), nullable=False)
    recipient = db.Column(db.String(250), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
