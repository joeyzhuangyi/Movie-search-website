import os
import time
import sqlite3
import sys

class Read(object):
    def __init__(self, read_method, read_position):
        self.__read_method = read_method
        self.__read_position = read_position
        #self.is_empty = 1 #apparently read_db object reuqires this attribute
    @property
    def read_position(self):
        return self.__read_position
    @read_position.setter
    def read_position(self, position):
        self.__read_position = position

class Read_db(Read):
    def __init__(self, read_position):
        Read.__init__(self, 'db', read_position)
    # db open callee
    def open(self):
        try:
            conn = sqlite3.connect(self.read_position)
            cur = conn.cursor()
        except:
            print("Error:", sys.exc_info()[0])
        return (conn, cur)
    # db close callee
    def close(self, conn):
        # close
        conn.close()

class Read_db_user(Read_db):
    def __init__(self, read_position):
        Read_db.__init__(self, read_position)
    # check username
    def checkU(self, username):
        db_handle = self.open()
        conn = db_handle[0]
        cur = db_handle[1]
        arr = cur.execute("select * from user where USERNAME='"+username+"'")
        if arr.fetchall() == []:
            print("True for username\n")
            self.close(conn)
            return True
        else:
            print("False for username\n")
            self.close(conn)
            return False

    # check email
    def checkE(self, email):
        db_handle = self.open()
        conn = db_handle[0]
        cur = db_handle[1]
        arr = cur.execute("select * from user where EMAIL='"+email+"'")
        if arr.fetchall() == []:
            print("True for email\n")
            self.close(conn)
            return True
        else:
            print("False for email\n")
            self.close(conn)
            return False

    # check login validity
    def checkAccount(self, username,pass_w):
        db_handle = self.open()
        conn = db_handle[0]
        cur = db_handle[1]
        cursor = cur.execute("SELECT USERNAME,PASSWORD,EMAIL from user")
        for row in cursor:
            # print(row[0])
            if row[0] == username and row[1] == pass_w:
                
                self.close(conn)
                return True
        self.close(conn)
        return False

    # get email
    def getEmailByUsername(self, username):
        db_handle = self.open()
        conn = db_handle[0]
        cur = db_handle[1]
        cursor = cur.execute("SELECT USERNAME,PASSWORD,EMAIL from user where USERNAME='"+username+"'")
        for row in cursor:
            if row[0] == username:
                email = row[2]
                self.close(conn)
                return email
        self.close(conn)
        return False

class Read_db_movie(Read_db):
    def __init__(self, read_position):
        Read_db.__init__(self, read_position)

    # checkID
    def checkID(self, m_ID):
        db_handle = self.open()
        conn = db_handle[0]
        cur = db_handle[1]
        arr = cur.execute("select * from movie where ID='"+m_ID+"'")
        if arr.fetchall() == []:
            # does not have the movie
            self.close(conn)
            return True
        else:
            # already have the movie
            self.close(conn)
            return False

    # check if the price is updated
    def check_price(self, m_ID, platform):
        db_handle = self.open()
        conn = db_handle[0]
        cur = db_handle[1]
        if (platform == "Youtobe"):
            arr = cur.execute("select ID, PRICE_Y, YP_LINK from movie where ID='"+m_ID+"'")
        elif (platform == "Itunes"):
            arr = cur.execute("select ID, PRICE_I, IP_LINK from movie where ID='"+m_ID+"'")
        elif (platform == "Google"):
            arr = cur.execute("select ID, PRICE_G, GP_LINK from movie where ID='"+m_ID+"'")
        else:
            return None
        for row in arr:
            if row[0] == m_ID and row[1] != "N/A":
                info = row
                self.close(conn)
                return info
        self.close(conn)
        return None

    # check if the trailer link is updated
    def check_trailer(self, m_id):
        db_handle = self.open()
        conn = db_handle[0]
        cur = db_handle[1]
        arr = cur.execute("select ID, TRAILER_LINK, TRAILER_PIC from movie where ID='"+m_id+"'")
        for row in arr:
            if row[0] == m_id and row[1] != "N/A":
                info = row
                self.close(conn)
                return info
        self.close(conn)
        return None

    # check if the review is updated
    def check_review(self, m_id, r_type):
        db_handle = self.open()
        conn = db_handle[0]
        cur = db_handle[1]
        if (r_type == "RT"):
            arr = cur.execute("select ID, RT_REVIEW from movie where ID='"+m_id+"'")
        elif (r_type == ""):
            arr = cur.execute("select ID, REVIEW, REVIEW_AUT from movie where ID='"+m_id+"'")

        for row in arr:
            if row[0] == m_id and row[1] != "N/A":
                info = row
                self.close(conn)
                return info
        self.close(conn)
        return None
    # get information of the movie
    def get_info(self, m_ID):
        db_handle = self.open()
        conn = db_handle[0]
        cur = db_handle[1]
        cursor = cur.execute("SELECT ID, TITLE, POSTERLINK, SUMMARY, DATE, CASTS, BY, RATED, RUNTIME, RATING_IMDB, RATING_MT, RATING_RT, PRICE_Y, PRICE_G, PRICE_I,YP_LINK, GP_LINK, IP_LINK, RT_REVIEW from movie where ID='"+m_ID+"'")
        for row in cursor:
            if row[0] == m_ID:
                info = row
                self.close(conn)
                return info
        self.close(conn)
        return False

    # get title by id
    def get_title_by_id(self, m_id):
        db_handle = self.open()
        conn = db_handle[0]
        cur = db_handle[1]
        cursor = cur.execute("SELECT TITLE from movie where ID='"+m_id+"'")
        result = cursor.fetchall()
        self.close(conn)
        return result

class Read_db_watchlist(Read_db):
    def __init__(self, read_position):
        Read_db.__init__(self, read_position)

    # check !
    def checkDuplicate(self, u_name, m_id):
        db_handle = self.open()
        conn = db_handle[0]
        cur = db_handle[1]
        arr = cur.execute("select * from watchlist where USERNAME='"+u_name+"' AND MOVIEID='"+m_id+"' ")
        if arr.fetchall() == []:
            # does not have it
            self.close(conn)
            return True
        else:
            # already have it
            self.close(conn)
            return False

    # get list
    def get_watchlist(self, u_name):
        db_handle = self.open()
        conn = db_handle[0]
        cur = db_handle[1]
        cur.execute("select MOVIEID from watchlist where USERNAME='"+u_name+"'")
        a_list = cur.fetchall()
        # print(a_list.__len__())
        # print(a_list[0])
        # print(a_list[1])
        # if arr.fetchall() == []:
        #     # does not have it
        #     self.close(conn)
        #     return None
        # else:
        #     # already have it
        #     # w_list = []
        #     # print(arr)
        #     # for row in arr:
        #     #     print("hello")
        #     #     if row[0] == u_name:
        #     #         w_list.append(row[1])
        #     w_list = cur.fetchall()
        
        

        self.close(conn)
        return a_list
        
    # get users that have similar likes on the movie
    def get_similar_likes_u(self, u_name, m_id):
        db_handle = self.open()
        conn = db_handle[0]
        cur = db_handle[1]
        cur.execute("select USERNAME from watchlist where USERNAME!='"+u_name+"' AND MOVIEID='"+m_id+"'")
        namelist = cur.fetchall()
        self.close(conn)

        return namelist

class Write(object):
    def __init__(self, write_method, write_position):
        self.__write_method = write_method
        self.__write_position = write_position
    @property
    def write_position(self):
        return self.__write_position
    @write_position.setter
    def write_position(self,position):
        self.__write_position = position

class Write_db(Write):
    def __init__(self, write_position):
        Write.__init__(self, 'db', write_position)
    # db open callee
    def open(self):
        try:
            conn = sqlite3.connect(self.write_position)
            cur = conn.cursor()
        except:
            print("Error:", sys.exc_info()[0])
        return (conn, cur)
    # db close callee
    def close(self, conn):
        # always do the saving
        conn.commit()
        # close
        conn.close()

class Write_db_user(Write_db):
    def __init__(self, write_position):
        Write_db.__init__(self, write_position)

    # register a new account into the database
    def register(self, user_n, pass_w, e_mail):
        reader = Read_db_user("database/USER.db")
        if reader.checkU(user_n) and reader.checkE(e_mail):
            db_handle = self.open()
            conn = db_handle[0]
            cur = db_handle[1]
            cur.execute("INSERT INTO user(USERNAME,PASSWORD,EMAIL) VALUES(?,?,?)",(user_n,pass_w,e_mail))
            self.close(conn)
            return True
        else:
            return False

    def change_name(self, old_n, new_n):
        if old_n == new_n:
            return 103
        reader = Read_db_user("database/USER.db")
        if reader.checkU(old_n) :
            # no such user
            return 101
        else :
            if reader.checkU(new_n):
                db_handle = self.open()
                conn = db_handle[0]
                cur = db_handle[1]
                # print(old_n)
                # print(new_n)
                cur.execute("UPDATE user SET USERNAME='"+new_n+"' WHERE USERNAME='"+old_n+"'")
                self.close(conn)
                return 103
            else :
                # name already exist

                return 102

    def change_email(self, old_e, new_e):
        if old_e == new_e:
            return 103
        reader = Read_db_user("database/USER.db")
        if reader.checkE(old_e) :
            # no such email
            return 101
        else :
            if reader.checkE(new_e):
                db_handle = self.open()
                conn = db_handle[0]
                cur = db_handle[1]
                # print(old_e)
                # print(new_e)
                cur.execute("UPDATE user SET EMAIL='"+new_e+"' WHERE EMAIL='"+old_e+"'")
                self.close(conn)
                return 103
            else :
                # email already exist

                return 102

    def change_password(self, old_p, new_p, old_n):
        if old_p == new_p:
            return 103
        reader = Read_db_user("database/USER.db")
        if reader.checkU(old_n) :
            # no such user
            return 101
        else :
            if reader.checkAccount(old_n, old_p):
                db_handle = self.open()
                conn = db_handle[0]
                cur = db_handle[1]
                # print(old_n)
                # print(new_n)
                cur.execute("UPDATE user SET PASSWORD='"+new_p+"' WHERE USERNAME='"+old_n+"' AND PASSWORD='"+old_p+"'")
                self.close(conn)
                return 103
            else:
                # wrong old password, not allowed to change the password
                return 102

    def change_profile(self, old_n, old_e, new_n, new_e, old_p, new_p):
        if self.change_email(old_e, new_e)==103 and self.change_name(old_n, new_n)==103 and self.change_password(old_p, new_p, old_n):
            return True
        else:
            return False

class Write_db_movie(Write_db):
    def __init__(self, write_position):
        Write_db.__init__(self, write_position)

    # store a movie
    def insert_movie(self,m_ID, m_title, m_poster_link, m_summary, m_date, m_casts, m_by, m_rated, m_runtime, m_rting_imdb, m_rting_mt, m_rting_rt, m_price_y, m_price_G, m_price_I,YP_LINK, GP_LINK, IP_LINK, trailer_link, trailer_pic, rt_review, review, review_aut):
        reader = Read_db_movie("database/MOVIE.db")
        if reader.checkID(m_ID):
            db_handle = self.open()
            conn = db_handle[0]
            cur = db_handle[1]
            cur.execute("INSERT INTO movie(ID, TITLE, POSTERLINK, SUMMARY, DATE, CASTS, BY, RATED, RUNTIME, RATING_IMDB, RATING_MT, RATING_RT, PRICE_Y, PRICE_G, PRICE_I, YP_LINK, GP_LINK, IP_LINK, TRAILER_LINK, TRAILER_PIC, RT_REVIEW, REVIEW, REVIEW_AUT) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",(m_ID, m_title, m_poster_link, m_summary, m_date, m_casts, m_by, m_rated, m_runtime, m_rting_imdb, m_rting_mt, m_rting_rt, m_price_y, m_price_G, m_price_I,YP_LINK, GP_LINK, IP_LINK,trailer_link, trailer_pic, rt_review, review, review_aut))
            self.close(conn)
            return True
        else:
            return False

    # update price
    def update_price(self, m_ID, n_price, n_price_link, platform):
        if platform == "Youtube":
            db_handle = self.open()
            conn = db_handle[0]
            cur = db_handle[1]
            cur.execute("UPDATE movie SET PRICE_Y='"+n_price+"',YP_LINK='"+n_price_link+"' WHERE ID='"+m_ID+"'")
            self.close(conn)
        elif platform == "Itunes":
            db_handle = self.open()
            conn = db_handle[0]
            cur = db_handle[1]
            cur.execute("UPDATE movie SET PRICE_I='"+n_price+"',IP_LINK='"+n_price_link+"' WHERE ID='"+m_ID+"'")
            self.close(conn)
        elif platform == "Google":
            db_handle = self.open()
            conn = db_handle[0]
            cur = db_handle[1]
            cur.execute("UPDATE movie SET PRICE_G='"+n_price+"',GP_LINK='"+n_price_link+"'  WHERE ID='"+m_ID+"'")
            self.close(conn)
        else:
            return False


        return True

    def update_trailer(self, m_id, link, pic):
        reader = Read_db_movie("database/MOVIE.db")
        if (reader.checkID(m_id)):
            print("does not have the movie for updating trailer")
        else:
            db_handle = self.open()
            conn = db_handle[0]
            cur = db_handle[1]
            cur.execute("UPDATE movie SET TRAILER_LINK='"+link+"', TRAILER_PIC='"+pic+"'  WHERE ID='"+m_id+"'")
            self.close(conn)
            print("trailor updating success")
            return True

        return False

    def update_review(self, m_id, review, review_aut):
        reader = Read_db_movie("database/MOVIE.db")
        if (reader.checkID(m_id)):
            print("does not have the movie for updating review")
        else:
            db_handle = self.open()
            conn = db_handle[0]
            cur = db_handle[1]
            if (review_aut == "RT"):
                cur.execute("UPDATE movie SET RT_REVIEW=? WHERE ID='"+m_id+"'", (review,))
            else:
                cur.execute("UPDATE movie SET REVIEW=?, REVIEW_AUT=? WHERE ID='"+m_id+"'", (review, review_aut))
                
            self.close(conn)
            
            print("review updating success")
            return True

        return False

class Write_db_watchlist(Write_db):
    def __init__(self, write_position):
        Write_db.__init__(self, write_position)

    # add to watchlist
    def add_to_watchlist(self, user_n, m_id):
        reader = Read_db_watchlist("database/USER.db")
        if (reader.checkDuplicate(user_n, m_id)):
            db_handle = self.open()
            conn = db_handle[0]
            cur = db_handle[1]
            cur.execute("INSERT INTO watchlist(USERNAME,MOVIEID) VALUES(?,?)",(user_n,m_id))
            self.close(conn)
            return True
        else:
            print("fuck u, you cant add it twice, go buy vip")
            return False

    # delete from watchlist
    def delete_from_watchlist(self, user_n, m_id):
        db_handle = self.open()
        conn = db_handle[0]
        cur = db_handle[1]
        cur.execute("DELETE FROM watchlist WHERE USERNAME='"+user_n+"' AND MOVIEID='"+m_id+"'")
        self.close(conn)
        
