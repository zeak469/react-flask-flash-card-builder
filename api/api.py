import time
import csv_to_json
from flask import Flask

app = Flask(__name__)

@app.route('/getjson')
def get_current_time():
    return csv_to_json.get_result("Example.csv")