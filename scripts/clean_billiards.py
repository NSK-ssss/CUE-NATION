import os
from PIL import Image, ImageFilter

def create_clean_background():
    img_path = 'public/images/billiards.jfif'
    if not os.path.exists(img_path):
        print(f"File {img_path} not found")
        return

    img = Image.open(img_path).convert('RGB')
    w, h = img.size
    print(f"Original image size: {w}x{h}")

    # Create a copy to clean
    clean_img = img.copy()

    # The rack area is roughly x: 420 to 600, y: 110 to 370
    # The cue ball area is roughly x: 145 to 215, y: 175 to 235
    # The felt has a smooth radial lighting from around center (x=300, y=190)
    # Notice that the felt around x=260 to 380 is completely clean felt!
    # For any pixel (x, y) in the rack or cue ball area, the felt at (620 - x, y) or mirrored/offset y
    # has matching lighting, or we can sample vertically symmetric clean felt.

    # 1. Clean Cue Ball:
    # Cue ball center is around (177, 205), radius ~26.
    # The felt directly above (y: 100 to 160, x: 150 to 200) and below (y: 250 to 310, x: 150 to 200) is clean felt.
    # We can also use felt from x: 230 to 290 at the same y!
    cb_box = (140, 168, 214, 242)
    # Patch cue ball with felt from x in 230..304
    felt_cb_patch = img.crop((230, 168, 304, 242))
    clean_img.paste(felt_cb_patch, (140, 168))

    # 2. Clean Rack Area:
    # Rack covers x: 430 to 610, y: 110 to 370.
    # Let's inspect the clean area in the left/middle: x: 220 to 400.
    # Note that table felt is symmetric or has a soft spotlight at top-center.
    # For x in 420..610, we can take clean felt from x: 230..420 (flipped horizontally so lighting falls off towards right edge!)
    rack_w = 610 - 420
    rack_h = 370 - 110
    
    # Crop clean felt from x: 230 to 420 (width 190)
    felt_rack_patch = img.crop((230, 110, 230 + rack_w, 110 + rack_h))
    # Flip horizontally to match the right edge vignette
    felt_rack_patch = felt_rack_patch.transpose(Image.FLIP_LEFT_RIGHT)

    clean_img.paste(felt_rack_patch, (420, 110))

    # Apply a subtle blur along the blend seams to make transition 100% invisible
    # Create mask for smooth blending
    mask_cb = Image.new('L', (w, h), 0)
    from PIL import ImageDraw
    draw = ImageDraw.Draw(mask_cb)
    draw.ellipse((142, 170, 212, 240), fill=255)
    mask_cb = mask_cb.filter(ImageFilter.GaussianBlur(8))

    mask_rack = Image.new('L', (w, h), 0)
    draw_rack = ImageDraw.Draw(mask_rack)
    draw_rack.polygon([(425, 204), (595, 115), (615, 115), (615, 365), (595, 365)], fill=255)
    # expand slightly
    draw_rack.rectangle((430, 120, 615, 360), fill=255)
    mask_rack = mask_rack.filter(ImageFilter.GaussianBlur(12))

    # Composite cleanly onto original
    final_img = img.copy()
    final_img.paste(clean_img, (0, 0), mask_cb)
    final_img.paste(clean_img, (0, 0), mask_rack)

    output_path = 'public/images/billiards_table_clean.png'
    final_img.save(output_path, quality=95)
    print(f"Clean background saved to {output_path}")

if __name__ == '__main__':
    create_clean_background()
