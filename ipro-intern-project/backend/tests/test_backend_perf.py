#!/usr/bin/python
import unittest
import requests 
import threading
import time

BASE_URL_LOCAL = "http://localhost:8000"
BASE_URL_REMOTE = "http://wingman.justinjschmitz.com:8000"

CUR_URL = BASE_URL_REMOTE


def test_post_get(token, results, i):
    url = CUR_URL + "/posts/get"
    querystring = {"count":"10","start_id":"-1","group_link":"","nonce":"16567"}

    payload = ""
    headers = {
        "Connection": "keep-alive",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "DNT": "1",
        "sec-ch-ua-mobile": "?0",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36",
        "Accept": "*/*",
        "Origin": "http://localhost:3000",
        "Sec-Fetch-Site": "same-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "http://localhost:3000/",
        "Accept-Language": "en-US,en;q=0.9",
        "Cookie": "userType=Driver; fname=admin; token=" + token
    }

    response = requests.request("GET", url, data=payload, headers=headers, params=querystring)
    results[i] = len(response.content)


def test_groups_get(token, results, i):
    url = CUR_URL + "/group/list"

    querystring = {"browse":"true","token":token}

    payload = ""
    headers = {
        "Connection": "keep-alive",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "DNT": "1",
        "sec-ch-ua-mobile": "?0",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36",
        "Accept": "*/*",
        "Origin": "http://localhost:3000",
        "Sec-Fetch-Site": "same-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "http://localhost:3000/",
        "Accept-Language": "en-US,en;q=0.9"
    }

    response = requests.request("GET", url, data=payload, headers=headers, params=querystring)
    results[i] = len(response.content)

def test_applications_get(token, results, i):
    url = CUR_URL + "/applications/get"

    querystring = {"token":token}

    payload = ""
    headers = {
        "Connection": "keep-alive",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "DNT": "1",
        "sec-ch-ua-mobile": "?0",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36",
        "Accept": "*/*",
        "Origin": "http://localhost:3000",
        "Sec-Fetch-Site": "same-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "http://localhost:3000/",
        "Accept-Language": "en-US,en;q=0.9"
    }

    response = requests.request("GET", url, data=payload, headers=headers, params=querystring)
    results[i] = len(response.content)

class TestStringMethods(unittest.TestCase):
    def setUp(self):
        url = CUR_URL + "/users/login"

        querystring = {"":""}

        payload = {
            "email": "admin",
            "password": "admin"
        }
        headers = {"Content-Type": "application/json"}

        response = requests.request("POST", url, json=payload, headers=headers, params=querystring)
        self.token = response.json()["token"]["val"]

    def test_posts_get(self):
        threads = []
        NUM_THREADS = 100
        TIME_DELAY = 0.01
        total_bytes = 0
        start = time.time()

        results = [0] * NUM_THREADS * 5

        print(self.token)
        cur_thread = -1
        for x in range(NUM_THREADS):
            threads.append(x := threading.Thread(target=test_post_get, args=(self.token, results, (cur_thread := cur_thread + 1))))
            x.start()
            threads.append(x := threading.Thread(target=test_groups_get, args=(self.token, results, (cur_thread := cur_thread + 1))))
            x.start()
            threads.append(x := threading.Thread(target=test_applications_get, args=(self.token, results, (cur_thread := cur_thread + 1))))
            x.start()

            time.sleep(TIME_DELAY)
        
        for thread in threads:
            ret = thread.join()

        end = time.time()
        total_bytes = sum(results)
        total_time = end - start
        print(f"Total time: {total_time}")
        print(f"Total bytes: {total_bytes}")
        print(f"Total bytes/second: {total_bytes / (total_time)}")
        print(f"Total requests/second: {len(threads) / (total_time)}")
    

        

if __name__ == '__main__':
    unittest.main()