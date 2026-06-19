import struct
import sys

def get_mp4_duration(filename):
    with open(filename, 'rb') as f:
        while True:
            header = f.read(8)
            if len(header) < 8:
                break
            size, atom_type = struct.unpack('>I4s', header)
            if atom_type == b'moov':
                # moov is a container, we search inside it
                continue
            elif atom_type == b'mvhd':
                # read version
                version = struct.read(1) # wait, let's read the rest of the atom
                data = f.read(size - 8)
                version = data[0]
                if version == 0:
                    creation_time, modification_time, timescale, duration = struct.unpack('>IIII', data[4:20])
                else:
                    creation_time, modification_time, timescale, duration = struct.unpack('>QQII', data[4:28])
                return duration / timescale
            else:
                f.seek(size - 8, 1)
    return None

try:
    with open('public/video_2026-06-15_16-13-36.mp4', 'rb') as f:
        data = f.read()
    # Find 'mvhd' atom manually
    idx = data.find(b'mvhd')
    if idx != -1:
        # mvhd is: size (4 bytes), type (4 bytes: mvhd), version (1 byte), flags (3 bytes), creation (4/8 bytes), modification (4/8 bytes), timescale (4 bytes), duration (4/8 bytes)
        version = data[idx + 4]
        if version == 0:
            timescale, duration = struct.unpack('>II', data[idx + 16:idx + 24])
        else:
            timescale, duration = struct.unpack('>II', data[idx + 28:idx + 36])
        print(f"Timescale: {timescale}, Duration: {duration}, Duration sec: {duration / timescale:.2f}")
    else:
        print("mvhd not found")
except Exception as e:
    print("Error:", e)
