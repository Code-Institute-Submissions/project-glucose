from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

MONGODB_URI = os.getenv('MONGODB_URI')
# MONGODB_HOST = 'localhost'
# MONGODB_PORT = 27017
# DBS_NAME = 'project_glucose'
# DBS_NAME = os.getenv('')
# COLLECTION_NAME = 'data_test2'
DBS_NAME = 'heroku_j94m28rx'
COLLECTION_NAME = 'projects'
FIELDS = {'Timestamp': True, 'BG Reading': True, 'Date': True, 'Time': True, 'Raw-Type': True, '_id': False}

@app.route("/")
def index():
   return render_template("index.html")



@app.route("/glucose/projects")
def donor_projects():
   connection = MongoClient(MONGODB_URI)
   # connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
   collection = connection[DBS_NAME][COLLECTION_NAME]
   projects = collection.find({"Raw-Type": "BGReceived"}, projection=FIELDS, limit=5000)
   json_projects = []
   for project in projects:
      json_projects.append(project)
   json_projects = json.dumps(json_projects)
   connection.close()
   return json_projects


if __name__ == '__main__':
   app.run()
