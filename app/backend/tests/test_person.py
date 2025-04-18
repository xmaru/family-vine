# tests/test_person.py
import pytest

@pytest.fixture
def created_person(client):
    resp = client.post("/", json={
        "name": "Alice",
        "birthday": "1990-01-01",
        "description": "Friend from school",
    })
    assert resp.status_code == 200, resp.text
    return resp.json()

def test_create_person(created_person):
    assert created_person["id"] > 0
    assert created_person["name"] == "Alice"

def test_list_people(client, created_person):
    resp = client.get("/")
    assert resp.status_code == 200
    assert any(p["id"] == created_person["id"] for p in resp.json())

def test_get_person(client, created_person):
    pid = created_person["id"]
    resp = client.get(f"/{pid}")
    assert resp.status_code == 200
    assert resp.json()["name"] == "Alice"

def test_update_person(client, created_person):
    pid = created_person["id"]
    resp = client.put(f"/{pid}", json={"name": "Alice Updated"})
    assert resp.status_code == 200
    assert resp.json()["name"] == "Alice Updated"

def test_delete_person(client, created_person):
    pid = created_person["id"]
    resp = client.delete(f"/{pid}")
    assert resp.status_code == 200
    assert "has been deleted" in resp.json()["message"]

def test_get_nonexistent(client):
    resp = client.get("/9999")
    assert resp.status_code == 404
