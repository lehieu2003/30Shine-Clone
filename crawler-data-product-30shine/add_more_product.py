import requests
import json
import pandas as pd
import time
import os
from datetime import datetime

class Shine30CategoryCrawler:
    def __init__(self, category_slug="sp-thuc-pham-chuc-nang"):
        self.base_url = "https://api-shop.30shine.com/api/v1/web/product-categories"
        self.headers = {
            "accept": "application/json",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
            "origin": "https://shop.30shine.com",
            "referer": "https://shop.30shine.com/",
        }
        self.category_slug = category_slug
        self.output_dir = "output"
        
        # Generate timestamp for filenames
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.json_output = os.path.join(self.output_dir, f"30shine_products_{self.category_slug}_{timestamp}.json")
        self.csv_output = os.path.join(self.output_dir, f"product_data_{self.category_slug}_{timestamp}.csv")
        
        # Create output directory if it doesn't exist
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def fetch_products(self, page=1, brands="", sort="-createdAt", subcategory="", rate=0):
        """Fetch products from the API with pagination"""
        url = f"{self.base_url}/{self.category_slug}/products"
        params = {
            "brands": brands,
            "sort": sort,
            "subCategory": subcategory,
            "rate": rate,
            "page": page
        }
        
        try:
            print(f"Fetching data from: {url} with params: {params}")
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()  # Raise an exception for HTTP errors
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from page {page}: {e}")
            return None
    
    def extract_product_data(self, product):
        """Extract relevant data from a product"""
        # Handle the case where subCategory might be None
        subcategory_name = ""
        subcategory_slug = ""
        if product.get("subCategory") is not None:
            subcategory_name = product["subCategory"].get("name", "")
            subcategory_slug = product["subCategory"].get("slug", "")
            
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
            "subcategory": subcategory_name,
            "subcategory_slug": subcategory_slug,
            "brand": product.get("brand", {}).get("name", ""),
            "brand_slug": product.get("brand", {}).get("slug", ""),
            "image_url": product.get("featuredImage", {}).get("url", ""),
            "tags": ", ".join([tag.get("name", "") for tag in product.get("tags", [])]),
        }
    
    def crawl_all_products(self, max_pages=10):
        """Crawl all products with pagination"""
        all_products = []
        page = 1
        
        while page <= max_pages:
            print(f"Fetching page {page}...")
            response_data = self.fetch_products(page=page)
            
            if not response_data:
                print(f"No response data found for page {page}")
                break
            
            # Check if we have the right data structure
            # The API returns products in "datas" instead of "data" field
            if "data" in response_data and "datas" in response_data["data"]:
                products = response_data["data"]["datas"]
            elif "data" in response_data:
                products = response_data["data"]
            else:
                print(f"Unexpected response structure on page {page}")
                break
            
            if not products:
                print(f"No products found on page {page}")
                break
                
            print(f"Found {len(products)} products on page {page}")
            for product in products:
                product_data = self.extract_product_data(product)
                all_products.append(product_data)
            
            # Check if there are more pages by comparing with total pages or total items
            if "data" in response_data and "total" in response_data["data"]:
                total_items = response_data["data"]["total"]
                page_size = response_data["data"].get("pageSize", 20)
                if page * page_size >= total_items:
                    print(f"Reached the last page ({page}). Total items: {total_items}")
                    break
            elif "meta" in response_data and page >= response_data["meta"].get("totalPages", 0):
                print(f"Reached the last page ({page})")
                break
                
            page += 1
            time.sleep(1)  # Be nice to the server
        
        return all_products
    
    def save_to_files(self, products):
        """Save products by appending to existing JSON and CSV files"""
        if not products:
            print("No products to save")
            return
            
        # Handle CSV file - append to existing or create new
        if os.path.exists(self.csv_output):
            # Read existing CSV data
            existing_df = pd.read_csv(self.csv_output)
            # Create dataframe from new products
            new_df = pd.DataFrame(products)
            # Combine existing and new data
            combined_df = pd.concat([existing_df, new_df], ignore_index=True)
            # Remove duplicates based on id
            combined_df = combined_df.drop_duplicates(subset=['id'])
            # Save combined data
            combined_df.to_csv(self.csv_output, index=False, encoding="utf-8")
            print(f"Added {len(products)} products to existing CSV. Total: {len(combined_df)} products")
        else:
            # Create new CSV if it doesn't exist
            pd.DataFrame(products).to_csv(self.csv_output, index=False, encoding="utf-8")
            print(f"Created new CSV with {len(products)} products")
        
        # Handle JSON file - append to existing or create new
        if os.path.exists(self.json_output):
            # Read existing JSON data
            with open(self.json_output, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
            
            # Create a dictionary to quickly lookup existing products by id
            existing_ids = {item["id"]: True for item in existing_data}
            
            # Only add products that don't already exist in the file
            new_products = [p for p in products if p["id"] not in existing_ids]
            
            # Combine existing and new data
            combined_data = existing_data + new_products
            
            # Save the combined data
            with open(self.json_output, "w", encoding="utf-8") as f:
                json.dump(combined_data, f, ensure_ascii=False, indent=2)
            print(f"Added {len(new_products)} products to existing JSON. Total: {len(combined_data)} products")
        else:
            # Create new JSON if it doesn't exist
            with open(self.json_output, "w", encoding="utf-8") as f:
                json.dump(products, f, ensure_ascii=False, indent=2)
            print(f"Created new JSON with {len(products)} products")
    
    def run(self):
        """Main method to run the crawler"""
        print("Starting 30shine category product crawler...")
        print(f"Target category: {self.category_slug}")
        products = self.crawl_all_products()
        print(f"Found {len(products)} products total")
        self.save_to_files(products)
        print("Crawling completed!")

if __name__ == "__main__":
    crawler = Shine30CategoryCrawler()
    crawler.run()
