import json
import csv
import requests
import time
import os
from datetime import datetime

def load_products(json_file):
    """Load products from the JSON file."""
    with open(json_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def fetch_product_details(slug):
    """Fetch detailed information for a product using its slug."""
    url = f"https://shop.30shine.com/_next/data/YCAT8CqZsxROurPUx6-Ts/chi-tiet-san-pham/{slug}.json?slug={slug}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://shop.30shine.com/nhom-san-pham/san-pham-moi',
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            return data.get('pageProps', {}).get('product', {})
        else:
            print(f"Failed to fetch details for {slug}, status code: {response.status_code}")
    except Exception as e:
        print(f"Error fetching details for {slug}: {e}")
    
    return None

def enrich_product_data(basic_product, detailed_product):
    """Combine basic product data with detailed information."""
    if not detailed_product:
        return basic_product
    
    enriched_product = basic_product.copy()
    
    # Add detailed information
    if 'images' in detailed_product:
        enriched_product['images'] = detailed_product['images']
    
    if 'shortDescription' in detailed_product:
        enriched_product['short_description'] = detailed_product['shortDescription']
    
    if 'description' in detailed_product:
        enriched_product['description'] = detailed_product['description']
    
    if 'productIngredients' in detailed_product:
        enriched_product['ingredients'] = detailed_product['productIngredients']
    
    if 'productManual' in detailed_product:
        enriched_product['manual'] = detailed_product['productManual']
    
    if 'variants' in detailed_product:
        enriched_product['variants'] = detailed_product['variants']
    
    return enriched_product

def save_to_json(data, filename):
    """Save data to a JSON file."""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Data saved to {filename}")

def save_to_csv(data, filename):
    """Save data to a CSV file."""
    if not data:
        print("No data to save to CSV")
        return
    
    # Flatten nested fields for CSV format
    flattened_data = []
    for product in data:
        flat_product = {
            'id': product.get('id', ''),
            'name': product.get('name', ''),
            'slug': product.get('slug', ''),
            'short_description': product.get('short_description', ''),
            'category': product.get('category', ''),
            'subcategory': product.get('subcategory', ''),
            'brand': product.get('brand', ''),
            'price': product.get('price', 0),
            'listed_price': product.get('listed_price', 0),
            'is_discount': product.get('is_discount', False),
            'discount_percent': product.get('discount_percent', 0),
            'is_out_of_stock': product.get('is_out_of_stock', False),
            'rating_score': product.get('rating_score', 0),
            'total_sold': product.get('total_sold', 0),
            'image_url': product.get('image_url', ''),
            'description': product.get('description', '').replace('<p>', '').replace('</p>', ' ').replace('<br>', ' '),
            'ingredients': product.get('ingredients', ''),
            'manual': product.get('manual', ''),
            'variant_count': len(product.get('variants', [])),
            'images': ', '.join([img.get('url', '') for img in product.get('images', [])]) if isinstance(product.get('images'), list) else ''
        }
        flattened_data.append(flat_product)
    
    # Write to CSV
    fieldnames = flattened_data[0].keys() if flattened_data else []
    with open(filename, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(flattened_data)
    print(f"Data saved to {filename}")

def main():
    # Input and output files
    input_file = 'd:/crawler-data-product-30shine/output/30shine_products_20250509_101219.json'
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = 'd:/crawler-data-product-30shine/output'
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    output_json = f'{output_dir}/30shine_detailed_products_{timestamp}.json'
    output_csv = f'{output_dir}/30shine_detailed_products_{timestamp}.csv'
    
    # Load products from JSON file
    products = load_products(input_file)
    print(f"Loaded {len(products)} products from {input_file}")
    
    # Fetch details for each product and enrich data
    enriched_products = []
    for i, product in enumerate(products):
        print(f"Processing product {i+1}/{len(products)}: {product['name']}")
        
        slug = product.get('slug')
        if slug:
            # Fetch detailed product information
            detailed_product = fetch_product_details(slug)
            
            # Combine basic data with detailed information
            enriched_product = enrich_product_data(product, detailed_product)
            enriched_products.append(enriched_product)
            
            # Add a small delay to avoid overloading the server
            time.sleep(1)
        else:
            print(f"Missing slug for product: {product.get('name', 'Unknown')}")
    
    # Save enriched data to JSON and CSV
    save_to_json(enriched_products, output_json)
    save_to_csv(enriched_products, output_csv)
    
    print(f"Processed {len(enriched_products)} products")

if __name__ == "__main__":
    main()
