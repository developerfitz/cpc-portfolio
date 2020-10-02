from dataclasses import dataclass, field
from utils import default_dict, default_list, default_none

@dataclass
class Examiner:
    '''Examiner object to manipulate the CPC portfolio data'''
    last_name: str = None
    first_name: str = None
    symbols: dict = field(default_factory=default_dict)
    portfolio: list = field(default_factory=default_list)
    symbols_list_only: list = field(default_factory=default_list)


@dataclass
class Symbol:
    '''CPC symbol object defining the properties of a CPC symbol'''
    symbol: str = None
    symbol_section: str = None
    symbol_class: str = None
    symbol_subclass: str = None
    # contains the maingroup and subgroup
    symbol_group: dict = field(default_factory=default_dict)
    c_star: str = None
    tally: str = 0
    title: str = field(default_factory=default_none)
    qualified: str = None

# class Symbol:
#     '''CPC symbol object defining the properties of a CPC symbol'''
#     def __init__(self, symbol='', c_star='', tally=0, qualified='',
#                 title=None, symbol_group={}):
#         self.symbol = symbol
#         self.title = title
#         self.c_star = c_star
#         self.tally = tally
#         self.qualified = qualified
#         self.symbol_group = symbol_group

    def __repr__(self):
        return f"Symbol <symbol='{self.symbol}', tally={self.tally}, c_star='{self.c_star}', title='{self.title}', qualified='{self.qualified}', symbol_group={self.symbol_group}>"

    def __symbol_with_space():
        ''' B32B1/06 becomes B32B 1/06 for better readability'''
        pass

    def __parse_section():
        '''B32B1/06 where the first B is the section'''
        pass

    def __parse_class():
        '''B32B1/06 where 32 is the class'''
        pass

    def __parse_sublass():
        '''B32B1/06 where the second B is the subclass'''
        pass

    def __parse_group():
        '''B32B1/06 where 1/00 is the main group and 1/06 is the subgroup'''
        pass

@dataclass
class Response():
    '''ODT for the repsonse coming back.'''
    raw_response: dict
    parsed_resonse: dict
    count: int
    total: int

    def __repr__(self):
      pass  
