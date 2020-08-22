# from tempfile import NamedTemporaryFile
# # used for streams
# with NamedTemporaryFile() as tmp:
#   wb.save(tmp.name)
#   tmp.seek(0)
#   stream = tmp.read()

# s3_response = s3.get_object(Bucket=BUCKET, Key=PORTFOLIO)
# print(s3_response)

# path = os.getcwd() # /var/task
# ls = os.listdir()

# with open(PORTFOLIO, 'wb') as data:
  # s3.download_fileobj(BUCKET, PORTFOLIO, data)
# wb = s3_reponse['Body'].read()

# # https://www.patentsview.org/api/cpc_subsections/query
# # q={"cpc_subgroup_id":"B32B1/06"}
# # q={"_and":[{"examiner_last_name":"fitzhugh","examiner_first_name":"julius"}
# # f=["cpc_subgroup_id","cpc_subgroup_title"]
# # s=[{"cpc_subgroup_id":"asc"}]
# # o={"matched_subentities_only":true}


# ws.page_setup.fitToWidth
# max_columns = len(column_labels)
# cell_range = ws['A1:E1']
# for i in range(max_columns):
#     cell_range[0][i].value = column_labels[i]
#     print(cell_range[0][i].value)

# upload zip files to lambda
go to the site-packages folder in the venv-folder
run `zip -r9 ${OLDPWD}/<name>.zip .`
`cd ${OLDPWD}`
include the .py files you want to include with
`zip -g <name>.zip  <file1> <file2>`
`aws lambda update-function-code --function-name excel-processor \ --zip-file fileb://processor.zip`
