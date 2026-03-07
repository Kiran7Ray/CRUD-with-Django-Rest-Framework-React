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
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Grocery Bud</h2>

        <div style={styles.form}>
          <input
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. eggs"
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
                style={styles.checkbox}
                checked={item.completed}
                onChange={() => toggleItem(item.id)}
              />

              <span
                style={{
                  ...styles.text,
                  textDecoration: item.completed ? "line-through" : "none",
                  color: item.completed ? "#94a3b8" : "#0f172a",
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
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#3f4750",
    margin: 0,
    fontFamily: "'Segoe UI', Roboto, Arial, sans-serif",
  },
  container: {
    width: "90%",
    maxWidth: "450px",
    backgroundColor: "#ffffff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#1e293b",
    fontSize: "1.75rem",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    gap: "0",
    marginBottom: "1.5rem",
  },
  input: {
    flex: 1,
    padding: "10px 15px",
    borderRadius: "5px 0 0 5px",
    border: "1px solid #46515f",
    fontSize: "1rem",
    outline: "none",
    backgroundColor: "#1b2228",
  },
  addBtn: {
    padding: "10px 20px",
    borderRadius: "0 5px 5px 0",
    border: "none",
    backgroundColor: "#6366f1",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "1rem",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "#453d3d",
    borderBottom: "1px solid #5c6772",
    transition: "background 0.2s",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#6366f1",
  },
  text: {
    flex: 1,
    fontSize: "1.05rem",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  editBtn: {
    padding: "4px 8px",
    backgroundColor: "#57685d",
    color: "#166534",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  deleteBtn: {
    padding: "4px 8px",
    backgroundColor: "#625b5b",
    color: "#991b1b",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
};

export default App;
