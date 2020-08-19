from openpyxl import load_workbook

PORTFOLIO = "CPC_Portfolio_Determination-Fitzhugh_Julius.xlsx"
workbook = load_workbook(filename=PORTFOLIO)

sheets = workbook.sheetnames
print(sheets)

active_sheet = workbook["Symbol Sorted"]
print(active_sheet, active_sheet.title)

value = active_sheet["B2"].value
print(value)
