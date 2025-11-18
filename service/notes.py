import os
import json
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes
from base64 import b64encode
import random
import string

KEYS_DIR = '../keys'
NOTES_DIR = '../notes'

os.makedirs(NOTES_DIR, exist_ok=True)

# Load RSA public key
with open(os.path.join(KEYS_DIR, 'rsa_public.pem'), 'rb') as f:
    rsa_key = RSA.import_key(f.read())
rsa_cipher = PKCS1_OAEP.new(rsa_key)

def random_text(length=30):
    return ''.join(random.choices(string.ascii_letters + string.digits + " ", k=length))

start_index = 24
num_new_notes = 76  # number of new random notes to create

for idx in range(start_index, start_index + num_new_notes):
    plaintext = random_text(random.randint(20, 50))  # random length text

    # Generate random AES key
    aes_key = get_random_bytes(16)
    cipher_aes = AES.new(aes_key, AES.MODE_EAX)
    ciphertext, tag = cipher_aes.encrypt_and_digest(plaintext.encode())

    # RSA encrypt AES key
    rsa_enc_key = rsa_cipher.encrypt(aes_key)

    note_data = {
        'id': idx,
        'rsa_enc_key': b64encode(rsa_enc_key).decode(),
        'aes_ciphertext': b64encode(ciphertext).decode(),
        'nonce': b64encode(cipher_aes.nonce).decode(),
        'tag': b64encode(tag).decode()
    }

    note_filename = os.path.join(NOTES_DIR, f'note_{idx}.json')
    with open(note_filename, 'w') as f:
        json.dump(note_data, f)

    print(f'Created {note_filename} with random note')
