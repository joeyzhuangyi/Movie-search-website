from flask import Flask, jsonify, request
from search_engine import Search_engine
from subprocess import Popen, PIPE
import subprocess
import shlex
from flask_cors import CORS
from initialize import db_reader_u, db_writer_u, db_reader_m, db_writer_m, db_writer_w, db_reader_w
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token
from flask_bcrypt import Bcrypt
app = Flask(__name__)
import requests
CORS(app)
engine = Search_engine()
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

app.config['JWT_SECRET_KEY'] = 'secret'
@app.route('/')
def home():
    return "hello world"

# search a movie by title
# GET /search/term=<string: title>
@app.route('/search/term=<string:title>')
def search_by_title(title):
    new_title = title[0:len(title)]
    title = new_title
    return jsonify(engine.search_by_title(title))


# get the Details result about a movie
# GET /result_id=<string:id>
@app.route("/result_id=<string:id>", methods=["GET","POST"])
def basic_movie_info(id):

    new_id = id[0:len(id)-0]
    id = new_id


    if db_reader_m.checkID(id):
        info = engine.get_movie(id)
        cas = ""
        if (info is not None):
            title = info['title'].replace(' ', '_')
            # print(title)

            n = 0
            for cast in info['casts']:
                n += 1
                cas += cast
                if (n != info['casts'].__len__()):
                    cas += '|'
                
            db_writer_m.insert_movie(id,info['title'], info['poster_link'], info['synopsis'], info['date'], cas, info['director'], info['AgeRestriction'], info['runtime'], info['ratings']['imdb'], info['ratings']['mt'],info['ratings']['rt'],"N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A", "N/A","N/A") 
            return jsonify(info)
    else:
        info1 = db_reader_m.get_info(id)
        # print("here")
        # print(info)
        casts = info1[5].split("|")

        data = {'director': info1[6], 'poster_link': info1[2], 'synopsis': info1[3], 'runtime': info1[8], 'title': info1[1], 'date': info1[4], 'casts': casts, 'AgeRestriction': info1[7], 'ratings': {'rt': info1[11], 'mt': info1[10], 'imdb': info1[9]}}

    return jsonify(data)

# get the platforms of a movie by title and date
# date formate: yr-mon-day in numeric
@app.route("/platforms/title=<string:title>&date=<string:date>")
def getPlatforms(title, date):
    return "all"
    pass


# get the Itunes platforms of a movie by title and date
# date formate: yr-mon-day in numeric
@app.route("/platforms/itunes/title=<string:title>&date=<string:date>&id=<string:id>")
def getItunes(title, date, id):
    # print(title[1:len(title)-1])
    info = db_reader_m.check_price(id, "Itunes")

    if (info == None):
        data = engine.get_Itunes(title,date)
        if (db_writer_m.update_price(id, "$"+str(data['price']), str(data['link']), "Itunes")):
            print("update itunes price successful")
        else:
            print(data)

        return jsonify(data)
    else:
        # print("++++++++++++++++++itunes+++++++++++++++++=")
        return jsonify({"name": "itunes", "price": info[1], "link": info[2]})

    



# get the google platforms of a movie by title and date
# date formate: yr-mon-day in numeric
@app.route("/platforms/google_play/title=<string:title>&date=<string:year>&id=<string:id>")
def getGoogle(title, year, id):
    # print(title[1:len(title)-1])
    info = db_reader_m.check_price(id, "Google")
    # print(title+"asdfadsf")
    year = year[0:4]
    # print(year)
    
    if (info == None):
        pass
    else:
        return jsonify({"name": "google", "price": info[1], "link": info[2]})

     # running the shell scrip to web scrap the google price
    p = Popen(['./webscraping/google_price.sh', title, year],
              stdin=PIPE, stdout=PIPE, stderr=PIPE)
    output, err = p.communicate(
        b"input data that is passed to subprocess' stdin")
    rc = p.returncode

    # split the output line by line
    info_list = output.splitlines()
    # print(info_list)
    # get the price
    price = info_list[0].decode('ascii')

    # print(price)
    # check if the price is in correct format
    if not price.startswith("$"):
        return jsonify({"name": "Google",
                        "price": "N/A", "link": "N/A"})

    # get the link
    link = info_list[1].decode('ascii')

    # making json object
    data = {"name": "Google",
            "price": price, "link": link}

    # print(data)
    if(db_writer_m.update_price(id,price,link,"Google")):
        print ("update google price successful")
    
    return jsonify(data)

    
# get the google platforms of a movie by title and date
# date formate: yr-mon-day in numeric
@app.route("/trailor/title=<string:title>&date=<string:date>&id=<string:id>")
def getTrailor(title, date, id):

    info = db_reader_m.check_trailer(id)

    if (info == None):
        pass
    else:
        return jsonify({"link": info[1], "pic": info[2]})

    title = title.replace(" ", "_")

    p = Popen(['./webscraping/youtobe_trailer.sh', title, date],
              stdin=PIPE, stdout=PIPE, stderr=PIPE)
    output, err = p.communicate(
        b"input data that is passed to subprocess' stdin")
    rc = p.returncode

    # remove newline
    info_list = output.splitlines()

    videoCode = info_list[0].decode('ascii')

    videoPic = info_list[1].decode('ascii')

    # FOR TESTING
    # print(videoCode)

    # print(videoPic)

    # making json object
    data = {"link": "https://www.youtube.com/watch?v=" +
            videoCode, "pic": videoPic}

    if (db_writer_m.update_trailer(id, "https://www.youtube.com/watch?v=" +
            videoCode,videoPic)):
        print("trailer updated")
    # print(json_data)

    return jsonify(data)

# get the youtobe price
# format: movie_title year
@app.route("/platforms/youtube/title=<string:title>&date=<string:year>&id=<string:id>")
def getYoutobePrice(title, year, id):
    info = db_reader_m.check_price(id, "Youtobe")

    if (info == None):
        pass
    else:
        data = {"name": "youtube", "price": info[1], "link": info[2]}
        return jsonify(data)
    
    # running the shell scrip to web scrap the youtobe price
    p = Popen(['./webscraping/youtobe_price.sh', title, year],
              stdin=PIPE, stdout=PIPE, stderr=PIPE)
    output, err = p.communicate(
        b"input data that is passed to subprocess' stdin")
    rc = p.returncode

    # split the output line by line
    info_list = output.splitlines()

    # get the price
    price = info_list[0].decode('ascii')

    # check if the price is in correct format
    if not price.startswith("$"):
        return jsonify({"name": "youtube",
                        "price": "N/A", "link": "N/A"})

    # get the link
    link = info_list[1].decode('ascii')

    # making json object
    data = {"name": "youtube",
            "price": price, "link": link}


    if(db_writer_m.update_price(id,price,link,"Youtube")):
        print ("update youtobe price successful")
    
    return jsonify(data)

# get the review from rotten tomatoes
# format: movie_title
@app.route("/review/title=<string:title>&date=<string:year>&id=<string:id>")
def getRtReview(title,year,id):
    info = db_reader_m.check_review(id,"RT")
    # print(title)
    year = year[0:4]
    # print(year)
    # print(info)
    if (info == None):
        pass
    else:
        data = {"movie_title": title, "review": info[1]}
        return jsonify(data)
    
    #title = title.replace(': ',':_')
    title = title.replace(' ', '_')
    # running the shell scrip to web scrap the rt review
    p = Popen(['./webscraping/rt_review.sh', title, year],
              stdin=PIPE, stdout=PIPE, stderr=PIPE)
    output, err = p.communicate(
        b"input data that is passed to subprocess' stdin")
    rc = p.returncode

    # print(output)
    # get the link
    review = output.decode('ascii')
    # print(review)

    # print the review (for testing)
    # print(review)

    # making json object
    if review == "":
        review = "N/A"
    data = {"movie_title": title, "review": review}

    print(review)
    if(db_writer_m.update_review(id, review, "RT")):
        print("update RT review successful")
    # print(data)
    # json_data = json.dumps(data)

    # for testing
    #print (json_data)

    return jsonify(data)

@app.route("/users/signup", methods=["GET","POST"])
def register() :


    # username = "Joey"
    # email = "j"
    # password = "j"
    result = {}
    if request.method == "POST":
        username = request.get_json()['username']
        email = request.get_json()['email']
        password = request.get_json()['password']
        if db_writer_u.register(username, password, email):
            #
            result["username"] = username
            result["email"] = email
            result["password"] = password
            result["result"] = "success"
            # print("in the if\n")
            #result={"result": "regestration success" }
            return jsonify(result)
                    
        else:
            # duplicate
            # print("in the else\n")
            result={"result": "fail"}
    else:
        result={"result": "fail"}
    #     print("failed\n")

    return jsonify(result)

@app.route("/users/login", methods=["GET","POST"])
def login() :
    # username = "Joey"
    # email = "j"
    # password = "j"
    result = {}
    if request.method == "POST":
        username = request.get_json()['username']
        password = request.get_json()['password']
        if db_reader_u.checkAccount(username, password):
            #
            # result["username"] = username
            # result["password"] = password
            # result["result"] = "success"
            # print("in the if\n")
            email = db_reader_u.getEmailByUsername(username)
            access_token = create_access_token(identity = {'username':username, 'email':email})
            result = jsonify({"token": access_token, "result":"success"})
            #result={"result": "regestration success" }
                    
        else:
            # duplicate
            # print("in the else\n")
            result= jsonify({"error": "Invalid username and password","result":"failed"})
    else:
        result= jsonify({"error": "Invalid username and password","result":"failed"})
    #     print("failed\n")

    return result

@app.route("/profile",methods=["GET","POST"])
def ChangeProfile():
    if request.method == "POST":
        old_n = request.get_json()['oldUsername']
        new_n = request.get_json()['newUsername']
        old_e = request.get_json()['oldEmail']
        new_e = request.get_json()['newEmail']
        # email = request.get_json()['email']
        # old_p = request.get_json()['oldPassword']
        # new_p = request.get_json()['newPassword']
        old_p = ""
        new_p = ""
        if db_writer_u.change_profile(old_n, old_e, new_n, new_e, old_p, new_p):
            print("Change name/email done\n")
            access_token = create_access_token(identity = {'username':new_n, 'email':new_e})
            result = jsonify({"token": access_token, "result":"success"})
        else:
            print("Change name/email failed\n")
            result= jsonify({"error": "Invalid username/email","result":"failed"})


    return result

@app.route("/<string:username>/watchlist",methods=["GET","POST"])
def addtowatchlist(username):
    if request.method == "POST":
        m_id = request.get_json()["movieId"]
        db_writer_w.add_to_watchlist(username, m_id)
        
    elif request.method == "GET":
        w_list = db_reader_w.get_watchlist(username)

        # print(w_list)

        jw_list = []
        i = 0
        for m in w_list:
            
            m_id = ''.join(map(str, m))
            # print(m_id)
            tup= db_reader_m.get_title_by_id(m_id)
            title = ''.join(tup[0])
            # print(title)
            jw_list.append({'title': title, 'link': "http://localhost:3000/moviedetails/"+m_id, 'id': m_id})
            i += 1


        # print (jw_list)
        return jsonify(jw_list)

@app.route("/<string:username>/deletefromwatchlist",methods=["GET","POST"])
def delete_from_watchlist(username):
    if request.method == "POST":
        
        m_id = request.get_json()["movieID"]
        db_writer_w.delete_from_watchlist(username, m_id)
        print(m_id)

@app.route("/moviedbreview/<string:id>",methods=["GET","POST"])

def get_review(id):
    info = db_reader_m.check_review(id, "")

    if (info == None): 
        pass
    else:
        data = {"author": info[2], "content": info[1]}
        return jsonify(data)

    response = requests.get("https://api.themoviedb.org/3/movie/"+id+"/reviews?api_key=6d9e14ac2ad18af84209ee5f055615d0&language=en-US&page=1")
    result_dictionary = response.json()

    if(len(result_dictionary['results'])==0):
        return jsonify({"author":"-1","content":"-1"})
    
    cont = result_dictionary['results'][0]['content'].replace("_"," ")
    aut = result_dictionary['results'][0]['author']
    if (len(cont)>500):
        cont = cont[0:500]+"..."

    if(db_writer_m.update_review(id, cont, aut)):
        print("update review successful")

    return jsonify({"author": aut,"content":cont})


#recommandation for the movie
@app.route("/recommend/<string:username>", methods=["GET","POST"])
def recommend(username):
    if request.method == "GET":
        curr_list = db_reader_w.get_watchlist(username)
        data = set({})
        result = []
        # print(set(curr_list))
        for m_id in curr_list:
            # print(m_id)
            namelist = db_reader_w.get_similar_likes_u(username, ''.join(m_id))
            for name in namelist:
                # print(''.join(name))
                o_m_list = db_reader_w.get_watchlist(''.join(name))
                # print(set(o_m_list))
                recommend_list = set(o_m_list).difference(set(curr_list))
                # print(recommend_list)
                data = data.union(recommend_list)
                # print(data)

        # # data = data[1:]
        # print("--------")
        # print(data)
        # #print(set(data))
        # print("--------")
        i = 0
        for d in data:
            #for e in d:
                # print(''.join(e[0]))
                m_id = ''.join(d)
                tup = db_reader_m.get_title_by_id(m_id)
                # print(tup)
                title = ''.join(tup[0])
                result.append({'title': title, 'link': "http://localhost:3000/moviedetails/"+m_id, 'id': m_id})
                i += 1
                if (i == 5): break

        return jsonify(result)
    
app.run(port=4897, debug=True, threaded=True)
