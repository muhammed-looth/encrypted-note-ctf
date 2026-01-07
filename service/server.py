from datetime import datetime
from flask import Flask, jsonify, abort, render_template, request, redirect, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required
from werkzeug.security import generate_password_hash
import os
import time
import json
import threading
import random

# --------------------------------
# App Setup
# --------------------------------
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

# --------------------------------
# Database
# --------------------------------
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(250), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --------------------------------
# Hardcoded Login (CTF Style)
# --------------------------------
VALID_USERNAME = "charlie"
VALID_PASSWORD = "password@321"

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        if (
            request.form.get("username") == VALID_USERNAME
            and request.form.get("password") == VALID_PASSWORD
        ):
            user = User.query.filter_by(username=VALID_USERNAME).first()
            if not user:
                user = User(
                    username=VALID_USERNAME,
                    password=generate_password_hash(VALID_PASSWORD)
                )
                db.session.add(user)
                db.session.commit()

            login_user(user)
            return redirect("/matrix")

        flash("ACCESS DENIED")
    return render_template("login.html")

@app.route("/matrix")
@login_required
def matrix():
    return render_template("matrix.html")

# --------------------------------
# 🔥 RACE CONDITION SECTION
# --------------------------------

NOTES_DIR = "./notes"

# 🚨 SHARED GLOBAL STATE (INTENTIONALLY UNSAFE)
leak_offset = 0

# 📏 RESPONSE SIZE TARGETS
NORMAL_SIZE = 75
SPECIAL_SIZE = 600

@app.route("/notes/<int:note_id>")
def get_note(note_id):
    global leak_offset

    filename = os.path.join(NOTES_DIR, f"note_{note_id}.json")
    if not os.path.exists(filename):
        abort(404)

    start = time.time()

    # ⏳ Race window
    time.sleep(0.03)

    with open(filename, "r") as f:
        data = json.load(f)

    secret = data.get("rsa_enc_key", "")
    if not secret:
        return jsonify(data)

    # 🚨 UNSAFE GLOBAL UPDATE (RACE)
    leak_offset = (leak_offset + 7) % len(secret)

    # ⏳ Second race window
    time.sleep(0.01)

    leaked_chunk = secret[leak_offset:leak_offset + 8]

    # --------------------------------------------------
    # 🎲 NON-DETERMINISTIC BEHAVIOR (IMPORTANT)
    # --------------------------------------------------
    # 30% chance → FULL NOTE returned
    # 70% chance → PARTIAL LEAK (race condition)
    return_full = random.randint(1, 10) <= 3

    if return_full:
        # FULL NOTE RESPONSE
        response = data
    else:
        # PARTIAL LEAK RESPONSE
        response = {
            "note_id": note_id,
            "leaked": leaked_chunk,
            "offset": leak_offset,
            "msg": "race condition leak"
        }

    # --------------------------------------------------
    # 📏 RESPONSE SIZE SIDE-CHANNEL
    # --------------------------------------------------
    if note_id == 61:
        target_size = SPECIAL_SIZE
        pad_char = "X"
    else:
        target_size = NORMAL_SIZE
        pad_char = "A"

    current_size = len(json.dumps(response))
    if current_size < target_size:
        response["padding"] = pad_char * (target_size - current_size)

    return jsonify(response)

# --------------------------------
# Static / Puzzle Routes (UNCHANGED)
# --------------------------------

@app.route('/bcc4d4f0381c74919db335641dc13b085bf1d0fd')
def mazePage():
    return render_template('maze.html')

@app.route('/7e616b8425b61abdb010fb9117351f0d700585dd')
def glitchPage():
    return render_template('glitch.html')

@app.route('/d969e7e0b0571370cd6763192bc24ac56c255472')
def phantomPage():
    return render_template('phantom.html')

@app.route('/6f0c4d135d45f6ddaa457359ffd4d01f394388c2')
def cipherLabPage():
    return render_template('cipherlab.html')

@app.route('/ffff80d25a2651a57130b409d7bf0e751e29b578')
def mirrorPage():
    return render_template('mirror.html')

@app.route('/9424ac79de34c97c74261622b533d185ca13968a')
def noisePage():
    return render_template('noise.html')

@app.route('/09407639790bbb3778e1c2a9f81c0680186097d1')
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

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/error')
def error():
    return render_template('error.html')

@app.route('/privacy')
def privacy():
    return render_template('privacy.html')

# --------------------------------
# Message Model (UNCHANGED)
# --------------------------------
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(250), nullable=False)
    recipient = db.Column(db.String(250), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# --------------------------------
# Run
# --------------------------------
if __name__ == "__main__":
    app.run(threaded=True, debug=True, host="0.0.0.0")
