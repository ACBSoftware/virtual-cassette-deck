from selenium import webdriver
from selenium.webdriver import ChromeOptions
from selenium.webdriver.common.by import By
import base64 
import time
import os
import random

class GoogleImageSearch:
    def __init__(self):
        opt = ChromeOptions()
        #opt.add_argument("--start-maximized")
        opt.add_argument("--headless")
        #opt.add_argument("--no-sandbox")
        #opt.add_experimental_option("useAutomationExtension", False)
        #opt.add_experimental_option("excludeSwitches", ["enable-automation"])
        self.driver = webdriver.Chrome(options=opt)
        # Navigate to Google Images
        self.driver.get('https://images.google.com/')
        self.driver.implicitly_wait(2)  

    def cleanup(self):
        self.driver.quit()

    def fetch_links_by_search(self, search_query):
        # Find the search bar and input the search query
        search_box = self.driver.find_element(By.NAME, "q")
        search_box.send_keys(search_query)
        search_box.submit()
        
        # Wait for search results to load (add any additional wait if required)
        self.driver.implicitly_wait(5)
        r_backoff = random.randint(0, 9)
        self.driver.execute_script("window.scrollTo(0,document.body.scrollHeight-" + str(r_backoff) + ");")
        time.sleep(1)
        
        links=self.driver.find_elements(By.TAG_NAME,"img")
        print('Image Links found:' + str(len(links)))
        counter = 1

        # Extract and print the links
        for link in links:
            counter = counter + 1
            href_alt_value = str(link.get_attribute('alt'))
            src_value = str(link.get_attribute('src'))
            if src_value.startswith("data"):
                if href_alt_value is None:
                    pass
                if len(str(href_alt_value)) > 0:
                    ##print(href_alt_value)
                    if not href_alt_value.startswith("Google"):
                            #data:image/jpeg:base64,/9
                            str_bytes_only = src_value[23:]
                            decodedData = base64.b64decode(str_bytes_only)
                            imgFile = open('C:\\Temp\\coverimages\\' + search_query + '.jpg', 'wb')
                            imgFile.write(decodedData)
                            imgFile.close()
                            break
            if counter > 30:
                break


print("Initiating...")
if any(fname.endswith('.txt') for fname in os.listdir("C:\\Temp\\CoverImages\\Queue")):
    google_image_search = GoogleImageSearch()
    for filename in filter(lambda p: p.endswith("txt"), os.listdir("C:\\Temp\\CoverImages\\Queue")):
        search_query = filename[:-4]
        print(search_query)
        google_image_search.fetch_links_by_search(search_query)
        os.remove(os.path.join("C:\\Temp\\CoverImages\\Queue",filename))
    google_image_search.cleanup()
