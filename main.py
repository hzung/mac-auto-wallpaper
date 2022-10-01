import os
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw





title = "always in"
# content = "If you have to be in the market at all times, either long or short, this is whatever your current position is (always-in long or always-in short). If at any time you are forced to decide between initiating a long or a short trade and are confident in your choice, then the market is in always-in mode at that moment. Almost all of these trades require a spike in the direction of the trend before traders will have confidence."

img_path = "/Users/team0x/mac-auto-wallpaper/images/img2.jpg"
img = Image.open(img_path)
base_width = 2400
wpercent = (base_width/float(img.size[0]))
base_height = int((float(img.size[1])*float(wpercent)))
img = img.resize((base_width,base_height), Image.Resampling.LANCZOS)

draw = ImageDraw.Draw(img)
font = ImageFont.truetype("Roboto/Roboto-Medium.ttf", 56)

rect_width = 1200
rect_height = 800
left = (base_width - rect_width)/2
top = (base_height - rect_height)/2
right = left + rect_width
bottom = top + rect_height

draw.rectangle(((left, top), (right, bottom)), fill="grey")
draw.text((left, top), title, (255,255,255), font=font)
img.save('sample-out.jpg')



# command = f"osascript -e 'tell application \"Finder\" to set desktop picture to POSIX file \"{img_path}\"'"
# os.system(command)