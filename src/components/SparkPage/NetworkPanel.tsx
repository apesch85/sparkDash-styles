import type { NetworkMetrics } from "../../api/types";
import { Panel } from "../ui/Panel";
import { NetworkIcon } from "../ui/icons";

interface NetworkPanelProps {
  network: NetworkMetrics | null;
  className?: string;
}

function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec >= 1024 * 1024 * 1024) return `${(bytesPerSec / 1024 / 1024 / 1024).toFixed(1)} GB/s`;
  if (bytesPerSec >= 1024 * 1024) return `${(bytesPerSec / 1024 / 1024).toFixed(1)} MB/s`;
  if (bytesPerSec >= 1024) return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
  return `${bytesPerSec} B/s`;
}

export function NetworkPanel({ network, className }: NetworkPanelProps) {
  const interfaces = network?.interfaces ?? [];
  const primary = network?.primaryInterface ?? null;
  const linkSpeed = network?.linkSpeedMbps ?? null;

  const visible = interfaces.filter(
    (iface) => !iface.disabled && iface.operstate === "up" && iface.ip
  );

  return (
    <Panel
      title="Network"
      accent
      icon={<NetworkIcon />}
      className={`panel-network ${className ?? ""}`}
    >
      {primary && (
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="text-muted">Primary</span>
          <span className="font-tabular text-text-strong">{primary}</span>
          {linkSpeed != null && (
            <span className="ml-auto chip py-0.5">{linkSpeed} Mbps</span>
          )}
        </div>
      )}
      <div className="space-y-2">
        {visible.length === 0 ? (
          <p className="text-xs text-muted">
            {interfaces.length === 0 ? "No interfaces" : "No active adapters"}
          </p>
        ) : (
          visible.map((iface) => {
            const isPrimary = iface.name === primary;
            return (
              <div
                key={iface.name}
                className={`flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between rounded-md border px-3 py-2 ${
                  isPrimary
                    ? "border-accent/40 bg-accent-soft"
                    : "border-border bg-surface-elevated"
                }`}
              >
                <span className={`flex items-center gap-2 text-xs ${isPrimary ? "text-text-strong" : "text-text"}`}>
                  {iface.ip ? (
                    <span className="font-tabular truncate">{iface.ip}</span>
                  ) : (
                    <span className="truncate">{iface.name}</span>
                  )}
                </span>
                <span className="font-tabular text-xs text-text">
                  <span className="text-accent">↑</span> {formatSpeed(iface.txSpeed)}
                  <span className="mx-1.5 text-border">·</span>
                  <span className="text-accent">↓</span> {formatSpeed(iface.rxSpeed)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </Panel>
  );
}
