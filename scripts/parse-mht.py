import email
from email import policy
import re
import sys

def html_to_markdown(html_content):
    # Very basic html to markdown converter
    # Remove script and style elements
    text = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
    # Replace headers
    text = re.sub(r'<h([1-6])[^>]*>(.*?)</h\1>', lambda m: '\n' + '#' * int(m.group(1)) + ' ' + m.group(2) + '\n', text, flags=re.IGNORECASE | re.DOTALL)
    # Replace paragraphs
    text = re.sub(r'<p[^>]*>(.*?)</p>', r'\n\1\n', text, flags=re.IGNORECASE | re.DOTALL)
    # Replace br
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    # Replace lists
    text = re.sub(r'<li[^>]*>(.*?)</li>', r'* \1\n', text, flags=re.IGNORECASE | re.DOTALL)
    # Remove all other tags
    text = re.sub(r'<[^>]+>', '', text)
    # Replace HTML entities
    text = text.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    # Clean up excessive whitespace
    text = re.sub(r'\n\s*\n', '\n\n', text)
    return text.strip()

def process_mht(input_path, output_path):
    print(f"Reading {input_path}...")
    with open(input_path, "rb") as f:
        msg = email.message_from_binary_file(f, policy=policy.default)

    html_content = ""
    for part in msg.walk():
        if part.get_content_type() == "text/html":
            payload = part.get_payload(decode=True)
            if payload:
                # MHT files usually have a specific encoding, try windows-1252 or utf-8
                html_content = payload.decode("windows-1252", errors="replace")
                break

    if not html_content:
        print("No HTML content found in MHT file.")
        return

    print("Extracting text...")
    markdown_text = html_to_markdown(html_content)

    with open(output_path, "w", encoding="utf-8") as out:
        out.write(markdown_text)
    
    print(f"Successfully wrote {len(markdown_text)} characters to {output_path}")

if __name__ == "__main__":
    input_file = "brain/SPECIALTIES/Criterios de diseño  sistema de señalización, control de tráfico y comunicaciones (1) (3).mht"
    output_file = "brain/SPECIALTIES/Criterios_Senalizacion_Comunicaciones.md"
    process_mht(input_file, output_file)
