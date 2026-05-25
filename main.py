import requests

session = requests.Session()

r = session.post("http://localhost:5005/api/auth/login", json={
    "email": "zubayerh101@gmail.com",
    "password": "1234"
}, timeout = 5)

print("login done");

# create booking
# r = session.post("http://localhost:5005/api/bookings", json={
#    "facility_id": "6a11375e7cb54258cd07f4a6",
#    "booking_date": "2026-06-01",
#    "time_slots": ["9am-10am", "10am-11am"]
# })
# print(r.json())

r = session.patch("http://localhost:5005/api/bookings/6a1143f101ab842016002a5a", json={"status": "Cancelled"});
print(r.json())

# get my bookings
r = session.get("http://localhost:5005/api/bookings")
print(r.json())
