import sys
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
from scipy.sparse import hstack
import difflib
import json

if __name__ == "__main__":
    book = sys.argv[1]

    dataset=pd.read_csv("./goodreads_data.csv")

    dataset.fillna('',inplace=True)
    combined_features=dataset['Author']+dataset['Genres']+dataset['Description']
    dataset['combined_features']=combined_features

    vect=TfidfVectorizer()
    feature_vectors=vect.fit_transform(combined_features)

    scaler=MinMaxScaler()

    cosine_sim = cosine_similarity(feature_vectors)
    # print(cosine_sim)

    close_match=difflib.get_close_matches(book,dataset['Book'])
    # print(close_match)

    index=dataset['Unnamed: 0'][dataset['Book']==close_match[0]]
    books=[]

    for i,v in enumerate(cosine_sim[index][0]):
        books.append((i,v))
    
    books=np.array(books)

    recommended_books = books[books[:,1].argsort()]

    book_ids=[]
    for i in range(9999,-1,-1):
        book_ids.append(recommended_books[i,0])
    book_ids = np.array(book_ids)

    book_recommendations=[]
    for i in range(0,30):
        book_recommendations.append(list(dataset['Book'].values[dataset['Unnamed: 0'] == book_ids[i]]))

    print(json.dumps(book_recommendations))





