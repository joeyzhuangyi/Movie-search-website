from io_class import *

# initialize public readers and writers
# db reader for user
db_reader_u = Read_db_user("database/USER.db")

# db writer for user
db_writer_u = Write_db_user("database/USER.db")

# db reader for movie
db_reader_m = Read_db_movie("database/MOVIE.db")

# db writer for movie
db_writer_m = Write_db_movie("database/MOVIE.db")

# db writer for movie
db_writer_w = Write_db_watchlist("database/USER.db")

# db reader for movie
db_reader_w = Read_db_watchlist("database/USER.db")