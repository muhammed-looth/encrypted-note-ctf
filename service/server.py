from flask import Flask, jsonify, abort
import os
import time
import json
import threading

app = Flask(__name__)
NOTES_DIR = '../notes'

# This is a mock global variable that could leak data in race
average_response_time = 0

@app.route('/note/<int:note_id>')
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

if __name__ == '__main__':
    app.run(host='0.0.0.0')
