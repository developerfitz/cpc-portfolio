def default_dict():
    return {}


def default_list():
    return []


def default_none():
    return None


def get_symbol_title():
    pass


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'xlxs'}
