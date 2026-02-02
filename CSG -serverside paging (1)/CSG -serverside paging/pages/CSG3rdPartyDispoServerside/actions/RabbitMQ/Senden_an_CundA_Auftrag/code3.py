import requests
from requests.auth import HTTPBasicAuth

# Example payload, replace with your dynamic data
payload_array = {{ steps.Jsoncode.data }}

# API URL and credentials
url = "https://api-dev.csg-helm.com/api/v2/ui/send-to-customer"
username = "ui"
password = "t0ps3cr3t"  # or whatever your password is

for item in payload_array:
    try:
        response = requests.put(
            url,
            json=item,  # automatically encodes as JSON and sets content-type
            auth=HTTPBasicAuth(username, password),
            timeout=10
        )
        response.raise_for_status()  # raise error for bad HTTP status
        print(f"Sent successfully: {item}")
        print(f"Response: {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to send: {item}")
        print(f"Error: {e}")
