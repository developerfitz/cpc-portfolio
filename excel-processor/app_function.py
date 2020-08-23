from openpyxl import Workbook, load_workbook
from openpyxl.utils import get_column_letter, get_column_interval
from openpyxl.styles import Alignment, Border, Font
import requests
import boto3

import json
import os
from classes import Symbol, Examiner


s3 = boto3.client('s3')
BUCKET = os.environ['BUCKET']
PRE = os.environ['PRE']
POST = os.environ['POST']
# PORTFOLIO = "cpc-examiner-portfolio.xlsx"
# key_to_object = f'{PRE}/{PORTFOLIO}'
# key_after_processing = f'{POST}/processed-{PORTFOLIO}'


def excel_processor(event, context):
    # TODO: need some error handling in here
    # download excel sheet to work on
    # TODO: something is up with the event or event['body']
    # ??: event['body'] not dict is str?
    # ??: event['body'] == [object Object] so its the way it's sent??
    print(event)
    body = json.loads(event['body'])
    # body = event['body']
    print(body)
    filename = body['filename']
    print(filename)
    # filename = 'cpc-examiner-portfolio.xlsx'
    key_to_object = f'{PRE}/{filename}'
    s3.download_file(BUCKET, key_to_object, f'/tmp/{filename}')
    # ??: need a new role to log files in cloudwatch?
    # ??: write file 
    wb = load_workbook(filename=f'/tmp/{filename}', read_only=True)

    # TODO: take in the name of the sheet that is in the file
    sheet = wb["Symbols Sorted"]
    examiner = Examiner(first_name="dark", last_name='examiner')
    portfolio_list = []
    # portfolio_data = sheet["B1:H673"]

    # first row labels of ws
    SYMBOL = 0
    C_STAR = 3
    TALLY = 4
    QUALIFIED = 6
    ROWS_END = 673

    for row in sheet.iter_rows(
        min_row=2,
        max_row=ROWS_END,
        min_col=2,
        max_col=8,
        values_only=True):
        if row[SYMBOL]:
            portfolio_symbol = Symbol(
                symbol=row[SYMBOL],
                c_star=row[C_STAR],
                tally=row[TALLY],
                qualified=row[QUALIFIED]
                )
            # adding symbol only to a list
            portfolio_list.append(portfolio_symbol.symbol)

            # adding symbol object to examiner object as list
            examiner.portfolio.append(portfolio_symbol)

            # adding symbol object to examiner object as dict
            row_symbol = row[SYMBOL]
            examiner.symbols[row_symbol] = portfolio_symbol

    # provide a list of symbols only on examiner for easy processing
    examiner.symbols_list_only = portfolio_list
    # print(examiner.symbols_list_only)        


    # # TODO: possibly turn this into a stream, so the limit does not matter
    PATENTVIEW = 'https://www.patentsview.org/api/cpc_subsections/query'
    payload = {
      "q": {"cpc_subgroup_id": examiner.symbols_list_only[0:200]},
      "f": ["cpc_subgroup_id", "cpc_subgroup_title"],
      "s": [{"cpc_subgroup_id": "asc"}],
      "o": {"matched_subentities_only": 'true'}
    }

    req = requests.post(PATENTVIEW, data=json.dumps(payload))
    if req.status_code != 200:
        print(req.headers['x-status-reason'])
        print(req.raise_for_status())
        # return(req.raise_for_status())   

    for subsection in req.json()['cpc_subsections']:
        for subgroup in subsection['cpc_subgroups']:
            subgroup_id = subgroup['cpc_subgroup_id']
            subgroup_title = subgroup['cpc_subgroup_title']
            examiner.symbols[subgroup_id].title = subgroup_title


    # make new workbook and send to user
    new_wb = Workbook()
    ws = new_wb.active
    ws.title = 'Processed Portfolio'
    column_labels = ['Symbol', 'Title', 'Tally', 'C*', 'Qualified']
    ws.append(column_labels)

    for symbol in examiner.portfolio:
        row_data = [symbol.symbol,
                    symbol.title,
                    symbol.tally,
                    symbol.c_star,
                    symbol.qualified
                    ]
        ws.append(row_data)

    symbol_cells = ws['A']
    title_cells = ws['B']
    c_star_cells = ws['C']
    tally_cells = ws['D']
    qualified_cells = ws['E']
    styles = {
      "align": Alignment(vertical='center', wrap_text=True),
      "align-center": Alignment(horizontal='center', vertical='center', wrap_text=True),
      "font": Font(size=16)
    }

    for cell in symbol_cells:
        cell.alignment = styles['align']
        cell.font = styles['font']
    for cell in title_cells:
        cell.alignment = styles['align']
        cell.font = styles['font']
    for cell in c_star_cells:
        cell.alignment = styles['align-center']
        cell.font = styles['font']
    for cell in tally_cells:
        cell.alignment = styles['align-center']
        cell.font = styles['font']
    for cell in qualified_cells:
        cell.alignment = styles['align-center']
        cell.font = styles['font']

    # save and upload processed excel wb
    processed_filename = f'processed-{filename}'
    key_after_processing = f'{POST}/{processed_filename}'
    tmp_file_location = f'/tmp/{processed_filename}'

    new_wb.save(tmp_file_location)

    s3.upload_file(
        tmp_file_location,
        BUCKET,
        key_after_processing
        )

    s3_params = {
        'Bucket': BUCKET,
        'Key': key_after_processing,
    }

    url = s3.generate_presigned_url(
        'get_object',
        Params=s3_params,
        HttpMethod='GET',
        ExpiresIn=60
    )

    payload = {
        'message': 'Hope this helps you organize your portfolio',
        'bucket': BUCKET,
        'filename': filename,
        # 'symbols': examiner.symbols_list_only,
        'presignedUrl': url,
    }
    print(payload)

    return {
        'headers': {
            'Access-Control-Allow-Origin': 'http://localhost:8888',
        },
        'statusCode': 200,
        'body': json.dumps(payload),
    }
