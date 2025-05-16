from PIL import Image
import glob
import os

# Set the path to the assets folder
frame_files = sorted(glob.glob("assets/frame*.png"))
frames = [Image.open(f) for f in frame_files]

# Compute total width and height
widths, heights = zip(*(img.size for img in frames))
total_width = sum(widths)
max_height = max(heights)

# Create a new image to hold the sprite sheet
sprite = Image.new("RGBA", (total_width, max_height))

# Paste each frame side by side
x_offset = 0
for img in frames:
    sprite.paste(img, (x_offset, 0))
    x_offset += img.width

# Save it to the assets folder
sprite.save("assets/stickman-sprite.png")
print("✅ Sprite sheet saved as: assets/stickman-sprite.png")
