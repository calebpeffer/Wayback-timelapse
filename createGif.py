
import glob
from PIL import Image, ImageFont, ImageDraw




def readInMetaDataFile():
    with open("imageInfo.txt", "r") as f:

        # read each line of in the file
        lines = f.readlines()

        # for each line, split it into a list of words then add it to a new dictionary with the 2nd word as the key and the 1st and 3rd word as the value
        return {line.split()[1]: [line.split()[0], line.split()[2]] for line in lines} 


def parseTimestamp(timestamp):
    # parse timestamp into month, day, year format
    return f"{timestamp[4:6]}/{timestamp[6:8]}/{timestamp[0:4]}"

def getFileIndexFromName(name):
    return int(name.split('/')[1].split('.')[0])


def addTextToImage(image, text, font, color):

    fontsize = 44
    padding = 20
    title_font = ImageFont.truetype('Inter-Black.otf', fontsize)

    image_editable = ImageDraw.Draw(image)
    width, height = image.size


    image_editable.rounded_rectangle((padding, height - fontsize - padding - 4, 316, height - fontsize + 58 - padding - 4), fill=(108,40,216), width=5, radius=10)

    
    image_editable.text((15 + padding , height - fontsize - padding - 4), text, color, font=title_font)


    return image_editable._image
    

def make_gif(frame_folder, output_file):
    framePath = f"{frame_folder}/*.png"
    frames = [Image.open(image) for image in glob.glob(framePath)]



    frames.sort(key=lambda x: getFileIndexFromName(x.filename))

    metaMap = readInMetaDataFile()
    for key, value in metaMap.items():
        # replace the second element in the value list with the parsed timestamp
        value[1] = parseTimestamp(value[1])

    #add text to each image in the frames list
    for i in range(len(frames)):
        frames[i] = addTextToImage(frames[i], metaMap[str(getFileIndexFromName(frames[i].filename))][1], "font", (252,252,252))

    
    frame_one = frames[0]
    frame_one.save(output_file, format="GIF", append_images=frames,
               save_all=True, duration=500, loop=0)
    
if __name__ == "__main__":

    OUTPUT_FILE = "output.gif" 
    INPUT_FOLDER = "screenshots" # The folder containing the screenshots created by takeScreenshots.js

    make_gif(INPUT_FOLDER, OUTPUT_FILE)

        




