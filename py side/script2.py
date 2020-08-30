# Import all the necessary files!
import os
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras import Model
from flask import Flask, request
import cv2
import json
import sqlite3
from sqlite3 import Error
import numpy as np
from flask_cors import CORS
from tensorflow.python.keras.backend import set_session
import base64
from datetime import datetime

graph = tf.get_default_graph()

app = Flask(__name__)
CORS(app)
sess = tf.Session()
set_session(sess)

model = tf.keras.models.load_model('facenet_keras.h5')
#model.summary()

def img_to_encoding(path, model):
  img1 = cv2.imread(path, 1)
  img = img1[...,::-1]
  dim = (160, 160)
  # resize image
  if(img.shape != (160, 160, 3)):
    img = cv2.resize(img, dim, interpolation = cv2.INTER_AREA)
  x_train = np.array([img])
  print(x_train)
  embedding = model.predict(x_train)
  #print("embedding",embedding)
  return embedding

@app.route('/login/<username>', methods=['POST'])
def validate(email):
    statement = 'Select Password from UserStats where UserId = \'{}\''.format(email)
    print(statement)
    with sqlite3.connect('pharmacy.db') as db:
        cursor = db.cursor()
        cursor.execute(statement)
        data = cursor.fetchall()
        print(data)
    return jsonify(password=s)

database = {}

def verify(image_path, identity, database, model):
    encoding = img_to_encoding(image_path, model)
    dist = np.linalg.norm(encoding-database[identity])
    print(dist)
    if dist<5:
        print("It's " + str(identity) + ", welcome in!")
        match = True
    else:
        print("It's not " + str(identity) + ", please go away")
        match = False
    return dist, match

@app.route('/register', methods=['POST'])
def register():
    try:
        username = request.get_json()['username']
        email = request.get_json()['email']
        password = request.get_json()['password']
        prescriptions = request.get_json()['prescriptions']
        img_data = request.get_json()['image64']
        userData = [email, username, password, prescriptions]
        # print user Data
        # print("Array:", userData)

        with open('images/'+username+'.jpg', "wb") as fh:
            fh.write(base64.b64decode(img_data[22:]))
        path = 'images/'+username+'.jpg'

        global sess
        global graph
        with graph.as_default():
            set_session(sess)
            database[username] = img_to_encoding(path, model) 

        con = None
        try:
            con = sqlite3.connect('/home/sanjit/pharmacy.db')
            cur = con.cursor()
            print("Successfully Connected to SQLite")

            # cur.execute("INSERT INTO UserStats VALUES(\"{}\",\"{}\",\"{}\",\"{}\")".format(str(email),str(username),str(password),str(prescriptions)), UserStats)
            cur.execute('insert into UserStats values(?,?,?,?)', userData)
            con.commit()
            print("Record inserted successfully into UserStats table ", cur.rowcount)

            cur = con.cursor()
            cur.execute("SELECT * FROM UserStats")
            rows = cur.fetchall()
            for row in rows:
                print(row)

            cur.close()
            con.close()
        except Error as e:
            print(e)
   
        return json.dumps({"status": 200})
    except:
        return json.dumps({"status": 500})

def who_is_it(image_path, database, model):
    print(image_path)
    encoding = img_to_encoding(image_path, model)
    min_dist = 1000
    # Loop over the database dictionary's names and encodings.
    for (name, db_enc) in database.items():
        dist = np.linalg.norm(encoding-db_enc)
        print(dist)
        if dist<min_dist:
            min_dist = dist
            identity = name
    if min_dist > 5:
        print("Not in the database.")
    else:
        print ("it's " + str(identity) + ", the distance is " + str(min_dist))
    return min_dist, identity

@app.route('/verify', methods=['POST'])
def change():
    img_data = request.get_json()['image64']
    img_name = str(int(datetime.timestamp(datetime.now())))
    with open('images/'+img_name+'.jpg', "wb") as fh:
        fh.write(base64.b64decode(img_data[22:]))
    path = 'images/'+img_name+'.jpg'
    global sess
    global graph
    with graph.as_default():
        set_session(sess)
        min_dist, identity = who_is_it(path, database, model)
    os.remove(path)
    if min_dist > 5:
        return json.dumps({"identity": 0})
    return json.dumps({"identity": str(identity)})

if __name__ == "__main__":
    app.run(debug=True)