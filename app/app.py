

from flask import Flask, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route('/')
def get_data():
    import pandas as pd

    df = pd.read_excel('area_risco_2022-10.xlsx')

    response = {'data':{
                'columns':[],
                'columns_type':[],
                'rows':[]
                }}

    def get_type(v):
        if v.name in ['int64','float64']:
            return 'number'
        elif v.name in ['object']:
            return 'string'
        elif v.name in ['bool']:
            return 'boolean'
            print('ola')
        elif v.name in ['datetime64[ns]']:
            return 'datetime'

    types = list(map(get_type, df.dtypes.to_list()))
    df['data_venda'] = df['data_venda'].dt.strftime("%Y-%m-%d %H:%M:%S:%f")
    response['data']['columns'].extend(df.columns.to_list())
    response['data']['columns_type'].extend(types)
    response['data']['rows'].extend(df[:10].values.tolist())
    print('\n\n',response,'\n\n')

    return jsonify(response)

if __name__ == '__main__':
    app.run( host='0.0.0.0')
