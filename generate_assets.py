from PIL import Image, ImageDraw, ImageFont
import os

STATIC_IMG_DIR = r"c:\Users\usuar\Desktop\project\portafolio\static\img"
SOURCE_IMG = os.path.join(STATIC_IMG_DIR, "perfil.jpg")

def generate_webp():
    """Convert profile image to WebP"""
    if os.path.exists(SOURCE_IMG):
        img = Image.open(SOURCE_IMG)
        webp_path = os.path.join(STATIC_IMG_DIR, "perfil.webp")
        img.save(webp_path, "WEBP", quality=85)
        print(f"Generated: {webp_path}")

def generate_icons():
    """Generate PWA icons from profile image or create simple ones"""
    sizes = [(192, 192), (512, 512)]
    
    if os.path.exists(SOURCE_IMG):
         # Use profile image as base
        base_img = Image.open(SOURCE_IMG).convert("RGBA")
        
        # Create a circle mask
        mask = Image.new('L', base_img.size, 0)
        draw = ImageDraw.Draw(mask) 
        draw.ellipse((0, 0) + base_img.size, fill=255)
        
        # Fit to circle
        output = Image.new("RGBA", base_img.size, (0, 0, 0, 0))
        output.paste(base_img, (0, 0), mask=mask)
        
        for width, height in sizes:
            resized = output.resize((width, height), Image.Resampling.LANCZOS)
            save_path = os.path.join(STATIC_IMG_DIR, f"icon-{width}.png")
            resized.save(save_path, "PNG")
            print(f"Generated: {save_path}")
    else:
        # Fallback: Create colored replacement
        for width, height in sizes:
            img = Image.new('RGB', (width, height), color = '#050505')
            d = ImageDraw.Draw(img)
            # Draw simplistic 'CM' text if possible, or just a gold circle
            d.ellipse([width*0.2, height*0.2, width*0.8, height*0.8], outline="#C9A962", width=width//20)
            save_path = os.path.join(STATIC_IMG_DIR, f"icon-{width}.png")
            img.save(save_path, "PNG")
            print(f"Generated fallback: {save_path}")

if __name__ == "__main__":
    generate_webp()
    generate_icons()
