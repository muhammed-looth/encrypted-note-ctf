from flask import Flask, jsonify, abort
import os
import time
import json
import threading

app = Flask(__name__)
NOTES_DIR = '../notes'

lock = threading.Lock()

@app.route('/note/<int:note_id>')
def get_note(note_id):
    filename = os.path.join(NOTES_DIR, f'note_{note_id}.json')
    # Vulnerable pattern: check file then sleep + read file
    if not os.path.exists(filename):
        abort(404)
    # Sleep simulates race condition window
    time.sleep(0.05)  # 50 ms window for race
    
    # Now read file
    with open(filename, 'r') as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0')
