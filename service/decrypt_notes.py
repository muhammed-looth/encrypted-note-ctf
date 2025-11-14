import os, json
from Crypto.PublicKey import RSA
from Crypto.Cipher import AES, PKCS1_OAEP

NOTES_DIR = '../notes'
KEYS_DIR = '../keys'

# Load RSA private key
with open(os.path.join(KEYS_DIR, 'rsa_private.pem'), 'rb') as f:
    private_key = RSA.import_key(f.read())

# Loop through all JSON notes
for filename in sorted(os.listdir(NOTES_DIR)):
    if not filename.endswith('.json'):
        continue
    
    path = os.path.join(NOTES_DIR, filename)
    with open(path, 'r') as f:
        data = json.load(f)
    
    # Decode all hex fields
    rsa_enc_key = bytes.fromhex(data['rsa_enc_key'])
    aes_nonce = bytes.fromhex(data['aes_nonce'])
    aes_tag = bytes.fromhex(data['aes_tag'])
    aes_ciphertext = bytes.fromhex(data['aes_ciphertext'])
    
    # Decrypt AES key using RSA private key
    cipher_rsa = PKCS1_OAEP.new(private_key)
    aes_key = cipher_rsa.decrypt(rsa_enc_key)
    
    # Decrypt the note using AES
    cipher_aes = AES.new(aes_key, AES.MODE_GCM, nonce=aes_nonce)
    note_text = cipher_aes.decrypt_and_verify(aes_ciphertext, aes_tag).decode()
    
    print(f"{filename}: {note_text}")
