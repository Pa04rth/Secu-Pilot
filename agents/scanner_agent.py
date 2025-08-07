#!/usr/bin/env python3

import sys
import subprocess
import json

def run_nmap_scan(target_url):
    """
    Runs a basic nmap scan on the target URL.
    """
    try:
        result = subprocess.run(
            ['nmap', '-F', target_url],  # Fast scan with fewer ports
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
    except subprocess.CalledProcessError as e:
        return {
            'tool': 'nmap',
            'status': 'error',
            'error': e.stderr.strip()
        }

def run_zap_scan(target_url):
    """
    Runs a ZAP CLI quick scan on the target URL.
    Assumes zap-cli and OWASP ZAP daemon are properly installed and configured.
    """
    try:
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
            'error': 'zap-cli is not installed or not in PATH'
        }
    except subprocess.CalledProcessError as e:
        return {
            'tool': 'zap-cli',
            'status': 'error',
            'error': e.stderr.strip()
        }

def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No target URL provided'}))
        sys.exit(1)

    target_url = sys.argv[1]

    # Run both scans
    nmap_result = run_nmap_scan(target_url)
    zap_result = run_zap_scan(target_url)

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
