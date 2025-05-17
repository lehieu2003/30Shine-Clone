import requests
import json
import pandas as pd
import time
import os
from datetime import datetime

class Shine30Crawler:
    def __init__(self):
        self.base_url = "https://api-shop.30shine.com/api/v1/web/product-groups"
        self.headers = {
            "accept": "application/json",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
            "origin": "https://shop.30shine.com",
            "referer": "https://shop.30shine.com/",
        }
        self.product_group_id = "60ff8e57aa72d8001cfe8ef7"  # From the API URL
        self.output_dir = "output"
        
        # Create output directory if it doesn't exist
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def fetch_products(self, page=1, brands="", sort="-createdAt", start_price=0, end_price=0, rate=0):
        """Fetch products from the API with pagination"""
        url = f"{self.base_url}/{self.product_group_id}/products"
        params = {
            "brands": brands,
            "sort": sort,
            "startPrice": start_price,
            "endPrice": end_price,
            "rate": rate,
            "page": page
        }
        
        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()  # Raise an exception for HTTP errors
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from page {page}: {e}")
            return None
    
    def extract_product_data(self, product):
        """Extract relevant data from a product"""
        return {
            "id": product.get("id", ""),
            "name": product.get("name", ""),
            "slug": product.get("slug", ""),
            "price": product.get("price", 0),
            "listed_price": product.get("listedPrice", 0),
            "discount_percent": product.get("discountPercent", 0),
            "is_discount": product.get("isDiscount", False),
            "is_out_of_stock": product.get("isOutOfStock", False),
            "rating_score": product.get("ratingScore", 0),
            "total_sold": product.get("totalSoldOut", 0),
            "category": product.get("category", {}).get("name", ""),
            "category_slug": product.get("category", {}).get("slug", ""),
            "subcategory": product.get("subCategory", {}).get("name", ""),
            "subcategory_slug": product.get("subCategory", {}).get("slug", ""),
            "brand": product.get("brand", {}).get("name", ""),
            "brand_slug": product.get("brand", {}).get("slug", ""),
            "image_url": product.get("featuredImage", {}).get("url", ""),
            "tags": ", ".join([tag.get("name", "") for tag in product.get("tags", [])]),
        }
    
    def crawl_all_products(self, max_pages=1):
        """Crawl all products with pagination"""
        all_products = []
        page = 1
        
        while page <= max_pages:
            print(f"Fetching page {page}...")
            response_data = self.fetch_products(page=page)
            
            if not response_data or "data" not in response_data or not response_data["data"]:
                break
            
            products = response_data["data"]
            if not products:
                break
                
            for product in products:
                product_data = self.extract_product_data(product)
                all_products.append(product_data)
            
            page += 1
            time.sleep(1)  # Be nice to the server
        
        return all_products
    
    def save_to_csv(self, products):
        """Save products to CSV file"""
        if not products:
            print("No products to save")
            return
            
        df = pd.DataFrame(products)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.output_dir}/30shine_products_{timestamp}.csv"
        df.to_csv(filename, index=False, encoding="utf-8")
        print(f"Saved {len(products)} products to {filename}")
        
        # Save JSON as well for complete data
        json_filename = f"{self.output_dir}/30shine_products_{timestamp}.json"
        with open(json_filename, "w", encoding="utf-8") as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        print(f"Saved JSON data to {json_filename}")
    
    def run(self):
        """Main method to run the crawler"""
        print("Starting 30shine product crawler...")
        products = self.crawl_all_products()
        print(f"Found {len(products)} products")
        self.save_to_csv(products)
        print("Crawling completed!")

if __name__ == "__main__":
    crawler = Shine30Crawler()
    crawler.run()
