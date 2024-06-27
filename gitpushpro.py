import subprocess
import sys


commit_message = input("Describe the changes (Default message: 'small changes') - ")

if commit_message == '':
    commit_message = 'small changes'

subprocess.run(["git", 'status'])
git_add = subprocess.run(["git", 'add', '.'])
subprocess.run(["git", 'status'])
subprocess.run(['git', 'commit', '-m', f'{commit_message}'])
subprocess.run(['git', 'push', '-u', 'origin', 'master'])
