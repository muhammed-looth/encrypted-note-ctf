import os, json
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from Crypto.Random import get_random_bytes
from base64 import b64encode

KEYS_DIR = '../keys'
NOTES_DIR = '../notes'

os.makedirs(NOTES_DIR, exist_ok=True)

# Load RSA public key
with open(os.path.join(KEYS_DIR, 'rsa_public.pem'), 'rb') as f:
    rsa_key = RSA.import_key(f.read())
rsa_cipher = PKCS1_OAEP.new(rsa_key)

plaintext_notes = [
    "This is a secret note 1.",
    "Another secret message 2.",
    "ctf{ finally_you_found_flag }"
]

for idx, note_text in enumerate(plaintext_notes, 1):
    # Generate random AES key
    aes_key = get_random_bytes(16)
    cipher_aes = AES.new(aes_key, AES.MODE_EAX)
    ciphertext, tag = cipher_aes.encrypt_and_digest(note_text.encode())

    # RSA encrypt AES key
    rsa_enc_key = rsa_cipher.encrypt(aes_key)

    note_data = {
        'id': idx,
        'rsa_enc_key': b64encode(rsa_enc_key).decode(),
        'aes_ciphertext': b64encode(ciphertext).decode(),
        'nonce': b64encode(cipher_aes.nonce).decode(),
        'tag': b64encode(tag).decode()
    }

    with open(os.path.join(NOTES_DIR, f'note_{idx}.json'), 'w') as f:
        json.dump(note_data, f)
