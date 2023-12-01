from flask import Flask,request,jsonify
from flask_mongoengine import MongoEngine
from mongoengine import ReferenceField
from datetime import datetime


app = Flask(__name__)
app.config['MONGODB_SETTINGS'] = {
    'db': ' assistantBot',
    'host': 'mongodb+srv://assistantBot:AssistantBot2023@cluster0.8ysq7n5.mongodb.net/?retryWrites=true&w=majority',
}
print("connected to db")
db = MongoEngine(app)
class User(db.Document):
    user_id = db.StringField(primarykey = True)
    user_name = db.StringField(required = True)
    logo =db.FileField()  #file field for storing images
    timestamp = db.DateTimeField(default=datetime.utcnow)

class Assistant_Gaian(db.Document):
    assistant_name = db.StringField(required = True,primarykey = True)
    assistant_id = db.StringField(required = True,primarykey= True)
    created_timestamp = db.DateTimeField(default=datetime.utcnow)
    updation_timestamp = db.DateTimeField(default=datetime.utcnow)
    logo  =db.FileField() 

class Assistant_User(db.Document):
    user_id=db.StringField()
    assistant_user_id = db.StringField()
    assistant_user_name=db.StringField()
    timestamp = db.DateTimeField(default=datetime.utcnow)
    updated_timestamp=db.DateTimeField(default=datetime.utcnow)
    logo = db.StringField()

    
class Thread(db.Document):
    user_id =db.StringField()
    assistant_id =db.StringField()
    thread_id =db.StringField(required=True)
    timestamp = db.DateTimeField(default=datetime.utcnow)
    title =db.StringField()

@app.route("/createUser",methods=["POST"])
def create():
    try:
        data = request.get_json()
        user = User(
            user_id=data['user_id'],
            user_name = data['user_name']
        )
        user.save()
        return jsonify({"message":"user details stored successfully"})
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/createAssistant",methods=["POST"])
def createAssistantGaian():
    data = request.get_json()
 
    assistant = Assistant_Gaian(
       
        assistant_name=data['assistant_name'],
        assistant_id = data['assistant_id']
    )
    assistant.save()
    return jsonify({"message":"Assistant details stored successfully"})

# create user assistant for particular  userid
@app.route("/userAssistant",methods=["POST"])
def createUserAssistant():
    try:
        data = request.get_json()
        user_assistant = Assistant_User(
            user_id = data["user_id"],
            assistant_user_name=data['assistant_user_name'],
            assistant_user_id = data['assistant_user_id']
        )
        user_assistant.save()
    except Exception as e:
        return jsonify({"error": str(e)}) 
    return jsonify({"message":"User Assistant details stored successfully"})
@app.route('/createthreads', methods=['POST'])
def create_threads():
    print("-----------")
    data = request.get_json()
    user_id = request.args.get('user_id')
    assistant_id = request.args.get('assistant_id')

    # Create Thread document with references to User and Assistant_Gaian
    thread_data = Thread(
        user_id=user_id,  
        assistant_id=assistant_id,  
        thread_id=data['thread_id'],
        title=data['title']
    )

    # Save the Thread document
    thread_data.save()
    return jsonify({"message": "Thread created successfully"}), 201


#get all assistants from assistant gaian
@app.route("/getAssistant",methods=["GET"])
def getAssistantGaian():
    gaianAssistant = Assistant_Gaian.objects().all()
    gaian_assistants_data = [
            {
                'assistant_name': assistant.assistant_name,
                'assistant_id': assistant.assistant_id,
            }
            for assistant in gaianAssistant
        ]
    print(gaian_assistants_data)
    return jsonify({"gaian_assistant":gaian_assistants_data})

#get user assistant by using user_id
@app.route("/getuserAssistant",methods=["GET"])
def assistants():
    try:
        # Retrieve user_id and assistant_id from request parameters
        user_id = request.args.get('user_id')
        if not user_id :
            return jsonify({"error": "user_id are required parameters."}),         
        assistant_user_objects = Assistant_User.objects(user_id=user_id)
        assistant_user_data = [
            {
                'assistant_name': assistant.assistant_user_name,
                'assistant_id': assistant.assistant_user_id,
            }
            for assistant in assistant_user_objects
        ]

        return jsonify({"assistant_objects": assistant_user_data})

    except Exception as e:
        return jsonify({"error": str(e)})

    
@app.route("/allThreads", methods=["GET"])
def getAllThreads():
    user_id = request.args.get('user_id')
    assistant_id = request.args.get('assistant_id')
    # print(assistantId)
    if not user_id or not assistant_id:
        return jsonify({"error": "user_id and assistant_id are required parameters."}), 400

    threads = Thread.objects(user_id=user_id,assistant_id=assistant_id).all()
    print(threads)
    return jsonify({"messages": threads})


if __name__ =="__main__":
    app.run(port=8000)
