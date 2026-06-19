import sys
import subprocess

pdf_path = "/home/ali/Downloads/Telegram Desktop/Инструкция на рус.pdf"
out_path = "pdf_text.txt"

# Try pdftotext command first
try:
    subprocess.run(["pdftotext", pdf_path, out_path], check=True)
    print("Extracted via pdftotext")
    sys.exit(0)
except Exception as e:
    print("pdftotext failed:", e)

# Try python libraries
for lib in ["pdfplumber", "pypdf", "PyPDF2", "fitz"]:
    try:
        if lib == "pdfplumber":
            import pdfplumber
            with pdfplumber.open(pdf_path) as pdf:
                text = "\n".join([page.extract_text() or "" for page in pdf.pages])
            with open(out_path, "w") as f:
                f.write(text)
            print("Extracted via pdfplumber")
            sys.exit(0)
        elif lib == "pypdf":
            import pypdf
            reader = pypdf.PdfReader(pdf_path)
            text = "\n".join([page.extract_text() or "" for page in reader.pages])
            with open(out_path, "w") as f:
                f.write(text)
            print("Extracted via pypdf")
            sys.exit(0)
        elif lib == "PyPDF2":
            import PyPDF2
            reader = PyPDF2.PdfReader(pdf_path)
            text = "\n".join([page.extract_text() or "" for page in reader.pages])
            with open(out_path, "w") as f:
                f.write(text)
            print("Extracted via PyPDF2")
            sys.exit(0)
        elif lib == "fitz":
            import fitz
            doc = fitz.open(pdf_path)
            text = "\n".join([page.get_text() or "" for page in doc])
            with open(out_path, "w") as f:
                f.write(text)
            print("Extracted via fitz")
            sys.exit(0)
    except Exception as ex:
        print(f"Library {lib} failed:", ex)

print("All extraction methods failed")
sys.exit(1)
