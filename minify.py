#!/usr/bin/env python3
"""
Simple CSS and JS minifier for SEO optimization
"""
import re
import os
from pathlib import Path

def minify_css(css_content):
    """Minify CSS by removing comments, whitespace, and unnecessary characters"""
    # Remove comments
    css = re.sub(r'/\*[\s\S]*?\*/', '', css_content)
    # Remove newlines and extra whitespace
    css = re.sub(r'\s+', ' ', css)
    # Remove spaces around special characters
    css = re.sub(r'\s*([{};:,>+~])\s*', r'\1', css)
    # Remove spaces around brackets
    css = re.sub(r'\s*\(\s*', '(', css)
    css = re.sub(r'\s*\)\s*', ')', css)
    # Remove last semicolon before }
    css = re.sub(r';}', '}', css)
    # Remove leading/trailing whitespace
    css = css.strip()
    return css

def minify_js(js_content):
    """Minify JS by removing comments and unnecessary whitespace"""
    # Remove single-line comments (but not URLs)
    js = re.sub(r'(?<!:)//[^\n]*', '', js_content)
    # Remove multi-line comments
    js = re.sub(r'/\*[\s\S]*?\*/', '', js)
    # Remove newlines and extra whitespace
    js = re.sub(r'\s+', ' ', js)
    # Remove spaces around operators and special characters
    js = re.sub(r'\s*([{};:,=<>+\-*/%&|!?])\s*', r'\1', js)
    # Add space after keywords that need it
    for keyword in ['function', 'return', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'new', 'typeof', 'instanceof']:
        js = re.sub(rf'\b{keyword}\b([^\s])', rf'{keyword} \1', js)
    # Remove leading/trailing whitespace
    js = js.strip()
    return js

def process_files(directory):
    """Process all CSS and JS files in directory"""
    css_dir = Path(directory) / 'css'
    js_dir = Path(directory) / 'js'
    
    # Process CSS files
    if css_dir.exists():
        for css_file in css_dir.glob('*.css'):
            if not css_file.name.endswith('.min.css'):
                min_file = css_file.with_suffix('.min.css')
                print(f"Minifying {css_file.name} -> {min_file.name}")
                
                with open(css_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                minified = minify_css(content)
                
                with open(min_file, 'w', encoding='utf-8') as f:
                    f.write(minified)
                
                original_size = len(content)
                minified_size = len(minified)
                savings = ((original_size - minified_size) / original_size) * 100
                print(f"  {original_size} -> {minified_size} bytes ({savings:.1f}% smaller)")
    
    # Process JS files
    if js_dir.exists():
        for js_file in js_dir.glob('*.js'):
            if not js_file.name.endswith('.min.js'):
                min_file = js_file.with_suffix('.min.js')
                print(f"Minifying {js_file.name} -> {min_file.name}")
                
                with open(js_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                minified = minify_js(content)
                
                with open(min_file, 'w', encoding='utf-8') as f:
                    f.write(minified)
                
                original_size = len(content)
                minified_size = len(minified)
                savings = ((original_size - minified_size) / original_size) * 100
                print(f"  {original_size} -> {minified_size} bytes ({savings:.1f}% smaller)")

if __name__ == '__main__':
    import sys
    directory = sys.argv[1] if len(sys.argv) > 1 else '.'
    process_files(directory)
    print("\nMinification complete!")
