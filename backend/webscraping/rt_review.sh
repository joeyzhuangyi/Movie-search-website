#!/bin/sh
export LC_ALL=C
if test $# != 2
then
    echo "Usage: $0 <Movie-Title> <Movie-Year>"
    exit 1
fi
movie_year=$2
movie_title=`echo "$1" |
            sed "s/:_/: /" |
            sed "s/_/ /g"`

base_url="https://www.rottentomatoes.com/search/?search=$movie_title"

movie_url=`wget -q -O- "$base_url" |
egrep -o -i "\"name\":\"$movie_title\",\"year\":$movie_year,\"url\":\"/m/.*\"" |
cut -d',' -f3 |
cut -d':' -f2 |
sed "s/\"//g"`
#echo "$movie_url"

wget -q -O- "https://www.rottentomatoes.com/$movie_url/reviews/?type=top_critics" |
sed "s|/div|/div class|g" |
sed "s|<div class=\"the_review\"> </div class>||g" |
egrep -o "<div class=\"the_review\">.{2,}</div class>" |
cut -d'<' -f2 |
sed s/.*\>//g 

# wget -q -O- "$base_url" |
# sed "s|/div|/div class|g" |
# sed "s|<div class=\"the_review\"> </div class>||g" |
# egrep -o "<div class=\"the_review\">.{2,}</div class>" |
# cut -d'<' -f2 |
# sed s/.*\>//g 
#egrep "<a class=\"unstyled articleLink\" href=\"/m/rush_hour\">Rush Hour</a>"
# <a class="unstyled articleLink" href="/m/rush_hour">Rush Hour</a>

# |
#egrep -o "<div class=\"the_review\">.*\.</div>" #|
# cut -d'<' -f2 |
# sed s/.*\>//g