from flask import Flask, jsonify, render_template
import feedparser
import re

app = Flask(__name__)

FEED_URL = "https://docs.cloud.google.com/feeds/bigquery-release-notes.xml"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/notes')
def get_notes():
    try:
        # Fetch and parse the feed
        feed = feedparser.parse(FEED_URL)
        
        if feed.bozo:
            # feedparser bozo flag is set if there is a parsing error, but it might still have entries
            if not feed.entries:
                return jsonify({"error": "Failed to parse feed data"}), 500
        
        notes = []
        for entry in feed.entries:
            # Extract content
            content = ""
            if 'content' in entry and entry.content:
                content = entry.content[0].value
            elif 'summary' in entry:
                content = entry.summary
            
            # Format date nicely
            updated = entry.get('updated', entry.get('published', ''))
            
            # Clean up link
            link = entry.get('link', 'https://cloud.google.com/bigquery/docs/release-notes')
            
            # Build clean note object
            notes.append({
                "id": entry.get('id', link),
                "title": entry.get('title', 'BigQuery Update'),
                "updated": updated,
                "content": content,
                "link": link
            })
            
        return jsonify({
            "title": feed.feed.get('title', 'BigQuery Release Notes'),
            "updated": feed.feed.get('updated', ''),
            "notes": notes
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
