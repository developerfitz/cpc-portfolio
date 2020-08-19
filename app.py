# from tempfile import NamedTemporaryFile
import json

from openpyxl import load_workbook
import requests
from classes import Symbol, Examiner

PORTFOLIO = "CPC_Portfolio_Determination-Fitzhugh_Julius.xlsx"
# workbook (wb)
wb = load_workbook(filename=PORTFOLIO, read_only=True)
# used for streams
# with NamedTemporaryFile() as tmp:
#   wb.save(tmp.name)
#   tmp.seek(0)
#   stream = tmp.read()

# TODO: take in the name of the sheet that is in the file
sheet = wb["Symbol Sorted"]

portfolio_data = sheet["B1:H673"]
# print(portfolio_data)

examiner = Examiner(first_name="julius", last_name='fitzhugh')
examiner_portfolio = []
# TODO: implement a parcer that takes in the row 1 that
# should be the the name of the columns
# (Symbol,	Manually added,	Added by,	C* designation,	tally total,	Increase tally,	Qualified)
SYMBOL = 0
C_STAR = 3
TALLY = 4

for row in sheet.iter_rows(min_row=2, max_row=673, min_col=2, max_col=7, values_only=True):
    if row[SYMBOL]:
      portfolio_symbol = Symbol(symbol=row[SYMBOL], title=None,
        c_star=row[C_STAR], tallies=str(row[TALLY]))
      examiner_portfolio.append(portfolio_symbol.symbol)
      examiner.portfolio.append(portfolio_symbol)
      row_symbol = row[SYMBOL]
      examiner.symbols[row_symbol] = portfolio_symbol
      examiner.symbols_list_only = examiner_portfolio
    # cpc_symbol = row[0]
    # }
    #   "symbol": row[0], #TODO: format to be readable
    #   "title": None,
    #   "c_star": row[3],
    #   "tallies": str(row[4])
    # }
    # examiner_portfolio[cpc_symbol] = portfolio_symbol
# print(json.dumps(examiner_portfolio))

# symbols_list = []
# for list_symbol in examiner.portfolio[0:5]:
#     print(list_symbol)
#     symbols_list.append(list_symbol)

# print('dictnary list')
# for dict_symbol in symbols_list:
#     print(examiner.symbols[dict_symbol.symbol])

# # print(dict(examiner.portfolio))
# for symbol in examiner.portfolio:
#     print(symbol)


# example 1
# https://www.patentsview.org/api/cpc_subsections/query?q={"cpc_subgroup_id":"B32B1/06"}&f=["cpc_subgroup_id","cpc_subgroup_title"]&s=[{"cpc_subgroup_id":"asc"}]&o={"matched_subentities_only":true}

# example 2
# https://www.patentsview.org/api/cpc_subsections/query?q={"_and":[{"examiner_last_name":"fitzhugh","examiner_first_name":"julius"}]}&f=["cpc_subgroup_id","cpc_subgroup_title"]&s=[{"cpc_subgroup_id":"asc"}]&o={"matched_subentities_only":true}

# https://www.patentsview.org/api/cpc_subsections/query?
# q={"cpc_subgroup_id":"B32B1/06"}
# q={"_and":[{"examiner_last_name":"fitzhugh","examiner_first_name":"julius"}
# f=["cpc_subgroup_id","cpc_subgroup_title"]
# s=[{"cpc_subgroup_id":"asc"}]
# o={"matched_subentities_only":true}

PATENTVIEW = 'https://www.patentsview.org/api/cpc_subsections/query'
# QUERY_SYBMOL = "B32B1/06"
batch_query = ["B32B1/06", "A01G31/06", "A22C13/0013"]
payload = {
  "q": {"cpc_subgroup_id": examiner.symbols_list_only[0:200]},
  "f": ["cpc_subgroup_id", "cpc_subgroup_title"],
  "s": [{"cpc_subgroup_id": "asc"}],
  "o": {"matched_subentities_only": 'true'}
}

# req = requests.get(PATENTVIEW, params=params)
# print(req.status_code)
# print(req.json()['cpc_subsections'][0]['cpc_subgroups'][0]['cpc_subgroup_id'])
# print(req.json()['cpc_subsections'][0]['cpc_subgroups'][0]['cpc_subgroup_title'])
req = requests.post(PATENTVIEW, data=json.dumps(payload))
if req.status_code != 200:
    print(req.headers['x-status-reason'])
    print(req.raise_for_status())    
    # print(req.http_error_msg)    
# print(req.json())
for subsection in req.json()['cpc_subsections']:
    for subgroup in subsection['cpc_subgroups']:
        print(subgroup['cpc_subgroup_id'])
        print(subgroup['cpc_subgroup_title'])
# print(req.json()['cpc_subsections'][0]['cpc_subgroups'][0]['cpc_subgroup_id'])
# print(req.json()['cpc_subsections'][0]['cpc_subgroups'][0]['cpc_subgroup_title'])

# TODO: check status codes
# 200 ok
# 400 not valid query
# 500 internal error