import { useState,useEffect } from "react";

type HistoryItem = {
  a: number;
  b: number;
  operator: "+" | "-" | "*" | "/";
  result: number;
};

function App() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [valueA, setValueA] = useState("");
  const [valueB, setValueB] = useState("");
  const [result, setResult] = useState<string | number>("");
useEffect(() => {
  fetch("http://localhost:3000/history")
    .then((res) => res.json())
    .then((data) => {
      setHistory(data.history);
    })
    .catch(() => {
      console.error("Failed to load history:");
    });
}, []);

  const handleOperation = async (operator: "+" | "-" | "*" | "/") => {
    const numA = parseFloat(valueA);
    const numB = parseFloat(valueB);
    if (isNaN(numA) || isNaN(numB)) {
      setResult("Please enter two valid numbers.");
      return;
    }

    setResult("Calculating...");

    try {
      const response = await fetch("http://localhost:3000/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          a: numA,
          b: numB,
          operator: operator,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult(data?.error || "Server error");
        return;
      }

      const resultFromServer = data.result;

      setResult(resultFromServer);
      fetch("http://localhost:3000/history")
        .then((res) => res.json())
        .then((data) => {
          setHistory(data.history);
        });
    } catch (error) {
      setResult("Network error: backend not reachable");
      console.error("handleOperation error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>CalcFlow</h1>
        <p style={styles.subtitle}>Simple Calculator</p>

        <input
          type="number"
          value={valueA}
          placeholder="First number"
          style={styles.input}
          onChange={(e) => setValueA(e.target.value)}
        />

        <input
          type="number"
          value={valueB}
          placeholder="Second number"
          style={styles.input}
          onChange={(e) => setValueB(e.target.value)}
        />

        <div style={styles.resultBox}>
          <p style={styles.resultValue}>{result !== "" ? result : "0"}</p>
        </div>

        <h3>History</h3>
        {history.length === 0 && <p>No calculations yet.</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {history.map((item, index) => (
            <li key={index} style={{ marginBottom: "6px" }}>
              {item.a} {item.operator} {item.b} = {item.result}
            </li>
          ))}
        </ul>

        <div style={styles.buttonGrid}>
          <button style={{ ...styles.button, ...styles.operatorButton }} onClick={() => handleOperation("+")}>+</button>
          <button style={{ ...styles.button, ...styles.operatorButton }} onClick={() => handleOperation("-")}>−</button>
          <button style={{ ...styles.button, ...styles.operatorButton }} onClick={() => handleOperation("*")}>×</button>
          <button style={{ ...styles.button, ...styles.operatorButton }} onClick={() => handleOperation("/")}>÷</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto",
  },
  card: {
    background: "linear-gradient(145deg, #f0f0f0, #ffffff)",
    borderRadius: "24px",
    padding: "28px 24px",
    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
    width: "100%",
    maxWidth: "340px",
    maxHeight: "80vh",
    overflowY: "auto" as const,
  },
  title: {
    margin: "0 0 4px",
    fontSize: "26px",
    color: "#333",
    textAlign: "center" as const,
    fontWeight: "700",
  },
  subtitle: {
    margin: "0 0 20px",
    fontSize: "13px",
    color: "#888",
    textAlign: "center" as const,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "14px",
    border: "2px solid #ddd",
    borderRadius: "10px",
    fontSize: "16px",
    boxSizing: "border-box" as const,
    transition: "all 0.3s",
    background: "#fafafa",
    outline: "none",
  },
  resultBox: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
  },
  resultValue: {
    margin: 0,
    fontSize: "44px",
    fontWeight: "700",
    color: "white",
    textAlign: "right" as const,
    letterSpacing: "-1px",
  },
  buttonGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "12px",
    marginTop: "20px",
  },
  button: {
    padding: "18px 12px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(145deg, #e8e8e8, #ffffff)",
    color: "#333",
    fontSize: "24px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.8)",
  },
  operatorButton: {
    background: "linear-gradient(145deg, #667eea, #764ba2)",
    color: "white",
    boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.2)",
  },
};

export default App;