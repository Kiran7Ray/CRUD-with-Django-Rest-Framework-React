import { useEffect, useState } from "react";

const BASE_URL = "http://127.0.0.1:8000/api/grocery/";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  const refreshItems = async () => {
    const res = await fetch(BASE_URL);
    const data = await res.json();
    setItems(data);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    if (editId) {
      await fetch(`${BASE_URL}${editId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      setEditId(null);
    } else {
      await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    }

    setName("");
    refreshItems();
  };

  const toggleItem = async (id) => {
    await fetch(`${BASE_URL}${id}/toggle/`, {
      method: "POST",
    });
    refreshItems();
  };

  const deleteItem = async (id) => {
    await fetch(`${BASE_URL}${id}/`, {
      method: "DELETE",
    });
    refreshItems();
  };

  const startEdit = (item) => {
    setName(item.name);
    setEditId(item.id);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Grocery Bud</h2>

      <div style={styles.form}>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter item"
        />
        <button style={styles.addBtn} onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div>
        {items.map((item) => (
          <div key={item.id} style={styles.card}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
            />

            <span
              style={{
                ...styles.text,
                textDecoration: item.completed ? "line-through" : "none",
              }}
            >
              {item.name}
            </span>

            <button style={styles.editBtn} onClick={() => startEdit(item)}>
              Edit
            </button>

            <button
              style={styles.deleteBtn}
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    fontFamily: "Arial",
  },
  title: {
    textAlign: "center",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "8px",
  },
  addBtn: {
    padding: "8px 12px",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #ccc",
    padding: "8px",
    marginBottom: "8px",
  },
  text: {
    flex: 1,
  },
  editBtn: {
    padding: "4px 8px",
  },
  deleteBtn: {
    padding: "4px 8px",
  },
};

export default App;
