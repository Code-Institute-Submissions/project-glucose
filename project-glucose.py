from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'project_glucose'
COLLECTION_NAME = 'data_test'
FIELDS = {'Timestamp': True, 'BG Reading': True, 'Date': True, 'Time': True, 'Raw-Type': True, '_id': False}

@app.route("/")
def index():
   return render_template("index.html")



@app.route("/glucose/projects")
def donor_projects():
   connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
   collection = connection[DBS_NAME][COLLECTION_NAME]
   projects = collection.find(projection=FIELDS, limit=5000)
   json_projects = []
   for project in projects:
       json_projects.append(project)
   json_projects = json.dumps(json_projects)
   connection.close()
   return json_projects


if __name__ == '__main__':
    app.run()
