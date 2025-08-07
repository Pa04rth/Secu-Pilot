
#!/usr/bin/env python3

import sys
import subprocess
import json
from urllib.parse import urlparse

def run_nmap_scan(target_hostname): # <-- Changed input to hostname
    """
    Runs a basic nmap scan on the target hostname.
    """
    try:
        # Pass the hostname, not the full URL
        result = subprocess.run(
            ['nmap', '-F', target_hostname],  # Fast scan with fewer ports
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        return {
            'tool': 'nmap',
            'status': 'success',
            'output': result.stdout.strip()
        }
    except FileNotFoundError:
        # Added this check for a better user experience
        return {
            'tool': 'nmap',
            'status': 'error',
            'error': 'nmap is not installed or not in PATH. Please run "sudo apt-get install nmap".'
        }
    except subprocess.CalledProcessError as e:
        return {
            'tool': 'nmap',
            'status': 'error',
            'error': e.stderr.strip()
        }

def run_zap_scan(target_url): # <-- This tool can handle the full URL
    """
    Runs a ZAP CLI quick scan on the target URL.
    """
    try:
        # zap-cli works fine with the full URL
        result = subprocess.run(
            ['zap-cli', 'quick-scan', '--self-contained', target_url],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        return {
            'tool': 'zap-cli',
            'status': 'success',
            'output': result.stdout.strip()
        }
    except FileNotFoundError:
        return {
            'tool': 'zap-cli',
            'status': 'error',
            'error': 'zap-cli is not installed or not in PATH. ZAP daemon might not be running.'
        }
    except subprocess.CalledProcessError as e:
        return {
            'tool': 'zap-cli',
            'status': 'error',
            'error': e.stderr.strip()
        }

def main():
    if len(sys.argv) < 2:
        # --- IMPROVEMENT: Print errors to standard error ---
        print("Error: No target URL provided.", file=sys.stderr)
        sys.exit(1)

    target_url = sys.argv[1]

    # --- CRITICAL FIX: Parse the URL to get the hostname ---
    parsed_url = urlparse(target_url)
    target_hostname = parsed_url.hostname
    if not target_hostname:
        print(f"Error: Could not extract hostname from URL '{target_url}'.", file=sys.stderr)
        sys.exit(1)


    # Run both scans
    nmap_result = run_nmap_scan(target_hostname) # Pass hostname to nmap
    zap_result = run_zap_scan(target_url)       # Pass full URL to zap

    # Combine results
    combined_results = {
        'target': target_url,
        'scans': {
            'nmap': nmap_result,
            'zap-cli': zap_result
        }
    }

    # Output the final result as a single-line JSON
    print(json.dumps(combined_results))

if __name__ == '__main__':
    main()