import { useCallback, useEffect, useState } from "react";
import apiClient from "../../infrastructure/apiClient";

interface Config {
  apiKeyMasked: string;
  baseUrl: string;
  model: string;
  apiVersion: string;
}

export function SettingsPage() {
  const [config, setConfig] = useState<Config | null>(null);
  const [newKey, setNewKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/api/config");
      setConfig({
        apiKeyMasked: data.api_key_masked,
        baseUrl: data.base_url,
        model: data.model,
        apiVersion: data.api_version,
      });
    } catch {
      setMessage({ type: "err", text: "無法載入設定" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConfig(); }, [fetchConfig]);

  const handleSave = async () => {
    if (!newKey.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      const { data } = await apiClient.put("/api/config/api-key", {
        api_key: newKey.trim(),
      });
      setConfig((prev) => prev ? { ...prev, apiKeyMasked: data.api_key_masked } : prev);
      setNewKey("");
      setMessage({ type: "ok", text: "API Key 已更新" });
    } catch (e) {
      setMessage({ type: "err", text: e instanceof Error ? e.message : "更新失敗" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">設定</h1>
      <p className="page-subtitle">配置 HKBU GenAI API 連接參數</p>

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <div className="loading-text">載入設定中...</div>
        </div>
      )}

      {config && (
        <>
          {/* Current config display */}
          <section className="settings-section">
            <div className="result-label">目前設定</div>
            <div className="settings-grid">
              <div className="settings-row">
                <span className="settings-key">API Key</span>
                <span className="settings-value mono">{config.apiKeyMasked}</span>
              </div>
              <div className="settings-row">
                <span className="settings-key">Base URL</span>
                <span className="settings-value mono">{config.baseUrl}</span>
              </div>
              <div className="settings-row">
                <span className="settings-key">Model</span>
                <span className="settings-value">{config.model}</span>
              </div>
              <div className="settings-row">
                <span className="settings-key">API Version</span>
                <span className="settings-value">{config.apiVersion}</span>
              </div>
            </div>
          </section>

          {/* Update API key */}
          <section className="settings-section">
            <div className="result-label">更新 API Key</div>
            <div className="input-area">
              <input
                type="text"
                placeholder="輸入新的 HKBU API Key..."
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                disabled={saving}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
            <div className="btn-row">
              <button
                className="btn-primary"
                onClick={handleSave}
                disabled={saving || !newKey.trim()}
              >
                {saving ? "儲存中..." : "儲存"}
              </button>
            </div>
          </section>

          {message && (
            <div className={message.type === "ok" ? "settings-success" : "error-banner"}>
              {message.type === "err" && <span className="dot" />}
              {message.text}
            </div>
          )}
        </>
      )}
    </div>
  );
}
