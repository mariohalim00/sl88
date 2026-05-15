import { useEffect, useState } from "react";
import { api } from "../treaty/client";

type PingResult =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; message: string; name: string }
  | { status: "error"; message: string };

export function ScaffoldDemo() {
  const [result, setResult] = useState<PingResult>({ status: "idle" });

  useEffect(() => {
    setResult({ status: "loading" });

    void api.api.scaffold.ping.get({ query: { name: "developer" } }).then(({ data, error }) => {
      if (error != null) {
        const msg = typeof error.value === "string" ? error.value : JSON.stringify(error.value);
        setResult({ status: "error", message: msg });
        return;
      }
      setResult({
        status: "success",
        message: data.message,
        name: data.echo.name,
      });
    });
  }, []);

  return (
    <section>
      <h2>Scaffold Ping</h2>
      {result.status === "idle" && <p>Ready.</p>}
      {result.status === "loading" && <p>Loading…</p>}
      {result.status === "success" && (
        <p>
          {result.message} — echo: <strong>{result.name}</strong>
        </p>
      )}
      {result.status === "error" && <p style={{ color: "red" }}>Error: {result.message}</p>}
    </section>
  );
}
