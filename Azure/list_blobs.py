#!/usr/bin/python2
# -*- coding:utf-8 -*-

import multiprocessing
import os
import time

from azure.storage.blob import BlockBlobService


CONFIG = {
    'account_name': 'your_accout_name',
    'account_key': 'your_account_key',
    'container_name': 'your_container_name'
}
NUM_PER_ITERATION = 1000


def list_blobs(folder):
    block_blob_service = BlockBlobService(account_name=CONFIG['account_name'], account_key=CONFIG['account_key'])
    fp = open(folder + '.txt', 'a+')

    counter = 0
    print "{} - {} - COUNT {}".format(folder, time.asctime(time.localtime()), counter)
    blob_list = list()
    generator = block_blob_service.list_blobs(container_name=CONFIG['container_name'], prefix=folder,
                                              num_results=NUM_PER_ITERATION)
    for blob in generator:
        blob_list.append(blob.name)
    fp.write('\n'.join(blob_list) + '\n')
    next_marker = generator.next_marker
    counter += len(blob_list)
    print "{} - {} - COUNT {}".format(folder, time.asctime(time.localtime()), counter)
    while next_marker:
        blob_list = list()
        generator = block_blob_service.list_blobs(container_name=CONFIG['container_name'], prefix=folder,
                                                  num_results=NUM_PER_ITERATION, marker=next_marker)
        for blob in generator:
            blob_list.append(blob.name)
        fp.write('\n'.join(blob_list) + '\n')
        next_marker = generator.next_marker
        counter += len(blob_list)
        print "{} - {} - COUNT {}".format(folder, time.asctime(time.localtime()), counter)
    fp.close()


if __name__ == '__main__':
    print time.asctime(time.localtime()) + " PID: {}".format(os.getpid())
    folders = list()
    for i in range(1, 101):
        folders.append('{}{:0>3}'.format('beijing', i))

    pool = multiprocessing.Pool()
    for i in xrange(len(folders)):
        folder = folders[i]
        print "{} - {} - START...".format(folder, time.asctime(time.localtime()))
        pool.apply_async(list_blobs, args=(folder,))
    pool.close()
    pool.join()
    print time.asctime(time.localtime()) + " Done."
