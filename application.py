from flask import Flask, g, url_for, redirect, request, abort, render_template, send_file
import flask
from flask_cors import CORS
from functools import wraps
import werkzeug
from werkzeug.utils import secure_filename

import os
import logging

from utils import allowed_file

# constants
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'xlsx'}

# app setup
app = Flask(__name__,static_folder='./public', static_url_path='/static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.logger.setLevel(logging.INFO) 
CORS(app)

@app.route('/test', methods=['GET', 'POST'])
def testing():
    if request.method == 'POST':
        # app.logger.info(request)
        # app.logger.info(request.url)
        app.logger.info(request.method)
        app.logger.info(request.origin)
        # app.logger.info(request.form)
        if 'file' in request.files:
            app.logger.info('File is found!!!') 
            f = request.files['file']
            app.logger.info(dir(f))
            f.save('./uploads/' + secure_filename(f.filename))
        # app.logger.info(dir(request.files))
        app.logger.info(request.headers)
        app.logger.info(request.mimetype)
    # app.logger.info(request.mimetype_params)
    # f = request.files['']
    # TODO: send the file to be process
    # send xslx to the script to be processed
    # process the xslx
    # save work into new filew
    # redirect to original page with the new file
    # download file
    return redirect('http://localhost:8888')

@app.route('/', methods=['GET', 'POST'])
def index():
    # return render_template('index.html')
    return send_file('./public/index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No File Part')
            return redirect(request.url)
        
        file = request.files['file']
        if file.filename == '':
            flash('No Selected File')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            # TODO: makes sure this is secure
            filename = file.filename
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('uploaded_file',
                                    filename=filename))