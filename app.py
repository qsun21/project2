from flask import Flask
from flask import Response
import json
from sqlalchemy import and_
from sqlalchemy import create_engine, MetaData, Table, Column, ForeignKey
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.automap import automap_base
import os


connection_string = os.environ['DATABASE_URL']
connection_string = connection_string.replace("postgres", "postgresql")

print("HERE******" + connection_string)

engine = create_engine(connection_string)

connection = engine.connect()

Session = sessionmaker(bind=engine)
session = Session()

app = Flask(__name__)

@app.route("/")
def root():
    return "hello Qian"

@app.route('/data')
def hello():
    result = {}
    Base = automap_base()
    Base.prepare(engine, reflect=True)

    beachlab = Base.classes.beachlab
    beachweather = Base.classes.beachweather

    join_results = session.query(beachlab, beachweather).filter(and_(beachlab.station_names == beachweather.station_name, beachlab.dna_sample_timestamps == beachweather.measurement_timestamp)).limit(200).all()

    result['stationNames'] = []
    result['dna_samples_1'] = []
    result['humidityReadings'] = []
    result['Air Temperature'] = []
    result['dna_samples_2'] = []
    result['dna_reading_means'] = []
    result['Latitude'] = []
    result['Longitude']=[]
    result['timestamp'] =[]
    for row in join_results:
        result.get('Air Temperature').append(getattr(row[1], 'Air Temperature'))
        result.get('stationNames').append(row[0].station_names)
        result.get('dna_samples_1').append(row[0].dna_samples_1)
        result.get('humidityReadings').append(row[1].Humidity)
        result.get('dna_samples_2').append(row[0].dna_samples_2)
        result.get('dna_reading_means').append(row[0].dna_reading_means)
        result.get('Latitude').append(row[0].Latitude)
        result.get('Longitude').append(row[0].Longitude)
        result.get('timestamp').append(row[1].measurement_timestamp.isoformat())

    resp = Response(json.dumps(result))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)