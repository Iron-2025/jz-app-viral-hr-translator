import json
import sqlite3
from flask import Flask, render_template, jsonify, g, request, redirect, url_for

import os

# Get the directory where app.py is located
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, 
           static_folder='static',
           static_url_path='/static',
           template_folder='templates')
DATABASE = os.path.join(basedir, 'data', 'app_data.db')

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('data/schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

# Load data from data.json
try:
    data_file_path = os.path.join(basedir, 'data', 'data.json')
    with open(data_file_path, 'r', encoding='utf-8') as f:
        all_joke_pairs = json.load(f)
except Exception as e:
    print(f"Error loading or parsing data/data.json: {e}")
    all_joke_pairs = []

JOKES_PER_PAGE = 10

@app.route('/')
def home():
    return redirect(url_for('index'))  # This redirects '/' to '/tools/cover-letter-generator'

@app.route('/tools/hr-approved-ways-to-tell-off-dumb-people-at-work')
@app.route('/tools/hr-approved-ways-to-tell-off-dumb-people-at-work/')
def index():
    return render_template('index.html')

@app.route('/get_jokes_page/<int:page_num>')
def get_jokes_page(page_num):
    start_index = (page_num - 1) * JOKES_PER_PAGE
    end_index = start_index + JOKES_PER_PAGE
    jokes_for_page = all_joke_pairs[start_index:end_index]
    
    db = get_db()
    # Add like counts to each joke
    for joke in jokes_for_page:
        cur = db.execute('SELECT like_count FROM likes WHERE post_id = ?', (joke['id'],))
        result = cur.fetchone()
        joke['like_count'] = result['like_count'] if result else 0
        
    return jsonify(jokes_for_page)

@app.route('/like/<int:post_id>', methods=['POST'])
def like_post(post_id):
    db = get_db()
    cur = db.execute('SELECT like_count FROM likes WHERE post_id = ?', (post_id,))
    result = cur.fetchone()

    if result:
        new_count = result['like_count'] + 1
        db.execute('UPDATE likes SET like_count = ? WHERE post_id = ?', (new_count, post_id))
    else:
        new_count = 1
        db.execute('INSERT INTO likes (post_id, like_count) VALUES (?, ?)', (post_id, new_count))
    
    db.commit()
    return jsonify({'like_count': new_count})

if __name__ == '__main__':
    with app.app_context():
        db = get_db()
        # Check if the table exists
        cur = db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='likes'")
        if cur.fetchone() is None:
            print("Creating likes table...")
            # A simplified init, assuming schema.sql is not used for this change
            db.execute("""
                CREATE TABLE likes (
                    post_id INTEGER PRIMARY KEY,
                    like_count INTEGER NOT NULL DEFAULT 0
                );
            """)
            db.commit()
    app.run(debug=True)
