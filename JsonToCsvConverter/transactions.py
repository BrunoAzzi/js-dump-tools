#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import json
import codecs
from os import path

def process(input_file, output_file):
    output_file.write(u';'.join(['oid', 'uid', 'pid', 'sku', 'price', 'timestamp', 'quantity']) + '\n')
    for line in input_file:
        transaction = json.loads(line)
        if not 'items' in transaction:
            continue
        for product in transaction['items']:
            fields = []
            fields.append(transaction['id'])
            fields.append(transaction['userId'])
            fields.append(product['product']['id'])
            fields.append(product['product']['sku'])
            fields.append(product['product']['price'])
            fields.append(transaction['date'])
            fields.append(product['quantity'])
            output_file.write(u';'.join([unicode(f) for f in fields]) + '\n')

def main():
    input_filename = sys.argv[1]
    output_dir = path.dirname(input_filename)
    if output_dir != '':
         output_dir += '/'
    base_filename = path.basename(input_filename).split('.')[:-1]
    output_filename = output_dir + ''.join(base_filename) + '.csv'

    output_file = codecs.open(output_filename, 'w', encoding='utf8')
    input_file = codecs.open(input_filename, 'r', encoding='utf8')

    try:
        process(input_file, output_file)
    finally:
        input_file.close()
        output_file.close()

if __name__ == '__main__':
    main()
