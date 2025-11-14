def check_flag(decrypted_note):
    expected_flag = "ctf{ finally_you_found_flag }"
    return decrypted_note.strip() == expected_flag

if __name__ == '__main__':
    import sys
    if len(sys.argv) != 2:
        print("Usage: python check_flag.py '<decrypted_note>'")
        exit(1)
    note = sys.argv[1]
    if check_flag(note):
        print("Correct flag! Validation successful.")
    else:
        print("Incorrect flag. Try again.")
