# from tempfile import NamedTemporaryFile
import json

from openpyxl import load_workbook
from classes import Symbol

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

examiner_portfolio = []
# TODO: implement a parcer that takes in the row 1 that
# should be the the name of the columns
# (Symbol,	Manually added,	Added by,	C* designation,	tally total,	Increase tally,	Qualified)
SYMBOL = 0
C_STAR = 3
TALLY = 4

for row in sheet.iter_rows(min_row=2, max_row=673, min_col=2, max_col=7, values_only=True):
    portfolio_symbol = Symbol(symbol=row[SYMBOL], title=None,
      c_star=row[C_STAR], tallies=str(row[TALLY]))
    examiner_portfolio.append(portfolio_symbol)
    # cpc_symbol = row[0]
    # }
    #   "symbol": row[0], #TODO: format to be readable
    #   "title": None,
    #   "c_star": row[3],
    #   "tallies": str(row[4])
    # }
    # examiner_portfolio[cpc_symbol] = portfolio_symbol
# print(json.dumps(examiner_portfolio))
print(examiner_portfolio[0:5])
