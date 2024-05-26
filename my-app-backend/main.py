from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import List
import os
import time
import base64
import sqlite3

class SQLiteUtil:
   
    def run_sqlite_select(self, dbpath, query):
        con = sqlite3.connect(dbpath)
        cur = con.cursor()
        cur.execute(query)
        results = cur.fetchall()
        con.close()
        return results

    def get_output_results_from_db(self, dbpath, file_id, search_string):
        
        #Query to get everything that matches and its parents
        sql_search_query = "With RECURSIVE ancestor(id, parentId, name, attribs, timestamp, level) as ("
        sql_search_query = sql_search_query + "select id, parentId, name, attribs, timestamp, 0 from files "
        sql_search_query = sql_search_query + " where name like '%" + search_string + "%' Union "
        sql_search_query = sql_search_query + """select f.id, f.parentId, f.name, f.attribs, f.timestamp, a.level + 1
                            from files f join ancestor a on a.parentId = f.id) 
                        select distinct id, parentId, name, attribs, timestamp from ancestor"""
        results_part1 = self.run_sqlite_select(dbpath, sql_search_query)
        output_results = []
        for r in results_part1:
            x = SearchResult(fid=file_id, id=r[0], parent_id=r[1], name=r[2])
            if r[3] > 30: 
                x.is_file = True
            if not x.name.endswith(".jpg") and not x.name.endswith(".db"):
                output_results.append(x)
        return output_results
    
    def get_output_results_from_db_folderid(self, dbpath, file_id, folder_id):
        print(folder_id)
        #Recurse down query..
        sql_search_query = "WITH RECURSIVE gen_folders AS (SELECT id, parentId,name,attribs,timestamp,0 AS gen_number "
        sql_search_query =sql_search_query +" FROM files WHERE id=" + folder_id
        sql_search_query = sql_search_query + """ UNION ALL SELECT child.id, child.parentId, child.name, child.attribs,child.timestamp,gen_number+1 AS gen_number
                FROM files child JOIN gen_folders g ON g.id = child.parentId)
                SELECT g.id, g.parentId, g.name, g.attribs, timestamp FROM gen_folders g"""
        results_part1 = self.run_sqlite_select(dbpath, sql_search_query)
        output_results = []
        for r in results_part1:
            x = SearchResult(fid=file_id, id=r[0], parent_id=r[1], name=r[2])
            if r[3] > 30: 
                x.is_file = True
            if not x.name.endswith(".jpg") and not x.name.endswith(".db") and not x.name.endswith(".JPG"):
                output_results.append(x)
        return output_results


    def get_root_path_from_db(self, dbpath):
        return_val = ""
        sql_query="select * from config where key='rootPath'"
        results_db = self.run_sqlite_select(dbpath, sql_query)
        if (len(results_db)>0):
            return_val = results_db[0][1]
        return return_val

    def get_music_dbs(self):
        base_path = "C:\\Users\\Batman\\AppData\\Roaming\\foobar2000-v2\\library-v2.0\\"
        #TODO Get above from config
        subfolders = [ f.path for f in os.scandir(base_path) if f.is_dir() ]
        results=[]
        file_id = 0
        for f in subfolders:
            x = MusicFolder(fid=file_id, dbpath=f +"\\content.sqlite") 
            results.append(x)
            file_id = file_id + 1
        return results

    def search_for_music(self, search_string):
        dbs_to_search = self.get_music_dbs()
        output_results =[]
        try:
            for db in dbs_to_search:
                db_path = db.dbpath
                output_results = output_results + self.get_output_results_from_db(db_path,db.fid,search_string)
                db.rootpath = self.get_root_path_from_db(db_path)
        except:
            print('Error searching')
            pass

        return_val = MetaResult(folders=dbs_to_search, results=output_results)
        return return_val
    
    def music_in_folder(self, db_id, folder_id):
        dbs_to_search = self.get_music_dbs()
        output_results =[]
        try:
            for db in dbs_to_search:
                if (db_id == str(db.fid)):
                    db_path = db.dbpath
                    output_results = output_results + self.get_output_results_from_db_folderid(db_path,db.fid,folder_id)
                    db.rootpath = self.get_root_path_from_db(db_path)
                    break
        except:
            print('Error searching')
            pass

        return_val = output_results
        return return_val

class SearchResult(BaseModel):
    fid: int = 0
    id: int
    parent_id: int 
    name: str
    is_file: bool = False

class MusicFolder(BaseModel):
    fid: int
    dbpath: str
    rootpath: str=""

class MetaResult(BaseModel):
    folders: List[MusicFolder]
    results: List[SearchResult]

app = FastAPI()

origins=["http://localhost:4200","localhost:4200"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.post("/launchbt")
def launch_bt():
    os.system('start explorer shell:appsfolder\\55746MarkSmirnov.BluetoothAudioReveicer_xwrbx6997tsfc!App')
    ret_val = {"launch_executed": True }
    return ret_val

@app.get("/coverart/{search_string}")
def find_return(search_string):
    print(search_string) #TODO Title artist
    str_file = 'C:\\Temp\\coverimages\\' + search_string + '.jpg'
    if os.path.exists(str_file):
        return FileResponse(str_file)
    else:
        str_queue_file = 'C:\\Temp\\coverimages\\queue\\' + search_string + '.txt'
        if not os.path.exists(str_queue_file):
            f = open(str_queue_file, "a")
            f.write("Not found!")
            f.close()
        raise HTTPException(status_code=404, detail="Item not found")

@app.get("/search/{search_string}")
def find_return(search_string):
    print(search_string) #TODO Title artist
    search_class = SQLiteUtil()
    output_results = search_class.search_for_music(search_string)
    json_compatible_data = jsonable_encoder(output_results)
    return JSONResponse(content=json_compatible_data)

@app.get("/search/folderid/{db_id}/{folder_id}")
def find_return(db_id, folder_id):
    search_class = SQLiteUtil()
    output_results = search_class.music_in_folder(db_id, folder_id)
    json_compatible_data = jsonable_encoder(output_results)
    return JSONResponse(content=json_compatible_data)


@app.post("/launchimagepuller")
def launch_puller():
    #os.system('C:\\Dev\\SongImagePuller\\SongImagePuller.exe')
    os.system('python C:\\Dev\\pythonimgpuller\\pullimage.py')
    ret_val = {"launch_executed": True }
    return ret_val
