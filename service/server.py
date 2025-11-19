from flask import Flask, jsonify, abort, render_template
import os
import time
import json
import threading

app = Flask(__name__, template_folder='../templates')
NOTES_DIR = '../notes'

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


@app.route('/')
def homePage():
    return render_template('index.html') 

@app.route('/maze')
def mazePage():
    return render_template('maze.html')

@app.route('/glitch')
def glitchPage():
    return render_template('glitch.html')

@app.route('/phantom')
def phantomPage():
    return render_template('phantom.html')

@app.route('/cipherlab')
def cipherLabPage():
    return render_template('cipherlab.html')

@app.route('/mirror')
def mirrorPage():
    return render_template('mirror.html')

@app.route('/noise')
def noisePage():
    return render_template('noise.html')

@app.route('/neon')
def neonPage():
    return render_template('neon.html')

@app.route('/shadow')
def shadowPage():
    return render_template('shadow.html')

@app.route('/puzzle')
def puzzlePage():
    return render_template('puzzle.html')

@app.route('/labyrinth')
def labyrinthPage():
    return render_template('labyrinth.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0')
