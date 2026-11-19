"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/Button";
import { FloorPlan } from "@/components/coverage/FloorPlan";
import { pickLocalized } from "@/lib/i18n-fields";
import {
  analyzeCoverage,
  cameraTypes,
  defaultLayouts,
  getCameraType,
  getScene,
  pointAngle,
  scenes,
  type Layout,
  type LayoutCamera,
  type Point,
  type Sector,
} from "@/lib/coverage-math";
import { cn } from "@/lib/utils";
import type { PackageRow } from "@/types/database";

type Drag = {
  kind: "move" | "rotate";
  id: string;
  pointerId: number;
  sector: Sector;
  dx: number;
  dy: number;
} | null;

type SendState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "error" }
  | { status: "sent"; whatsappUrl: string; name: string };

function cloneLayouts() {
  return structuredClone(defaultLayouts);
}

function clientToMeters(svg: SVGSVGElement, clientX: number, clientY: number): Point {
  const matrix = svg.getScreenCTM();
  if (!matrix) return { x: 0, y: 0 };
  const point = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
  return { x: point.x, y: point.y };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function nextCameraId(cameras: LayoutCamera[]) {
  let n = cameras.length + 1;
  let id = `c${n}`;
  while (cameras.some((camera) => camera.id === id)) {
    n += 1;
    id = `c${n}`;
  }
  return id;
}

function suggestPackage(packages: PackageRow[], sector: Sector, count: number) {
  const options = packages
    .filter((row) => row.sector === sector)
    .sort((a, b) => a.sort_order - b.sort_order || a.min_cameras - b.min_cameras);
  if (!options.length || count < 1) return null;
  const match = options.find((row) => count >= row.min_cameras && count <= row.max_cameras);
  if (match) return match;
  const first = options[0];
  const last = options[options.length - 1];
  if (!first || !last) return null;
  return count < first.min_cameras ? first : last;
}

export function CoveragePlanner({
  packages,
  initialSector = "home",
}: {
  packages: PackageRow[];
  initialSector?: Sector;
}) {
  const t = useTranslations("coverage");
  const locale = useLocale();
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<Drag>(null);
  const startSector = scenes.some((s) => s.sector === initialSector)
    ? initialSector
    : "home";
  const [sector, setSector] = useState<Sector>(startSector);
  const [layouts, setLayouts] = useState<Record<Sector, Layout>>(cloneLayouts);
  const [selectedId, setSelectedId] = useState<string | null>(
    defaultLayouts[startSector].cameras[0]?.id ?? null,
  );
  const [draftType, setDraftType] = useState<LayoutCamera["type"]>("dome");
  const [send, setSend] = useState<SendState>({ status: "idle" });

  const scene = getScene(sector);
  const layout = layouts[sector];
  const analysis = useMemo(() => analyzeCoverage(layout), [layout]);
  const selected = layout.cameras.find((camera) => camera.id === selectedId) ?? null;
  const suggestion = suggestPackage(packages, sector, layout.cameras.length);
  const selectedSpec = selected ? getCameraType(selected.type) : null;

  function updateCamera(activeSector: Sector, id: string, patch: Partial<LayoutCamera>) {
    setLayouts((current) => {
      const active = current[activeSector];
      return {
        ...current,
        [activeSector]: {
          ...active,
          cameras: active.cameras.map((camera) => (camera.id === id ? { ...camera, ...patch } : camera)),
        },
      };
    });
  }

  function applyDrag(event: { clientX: number; clientY: number; pointerId: number }) {
    const drag = dragRef.current;
    const svg = svgRef.current;
    if (!drag || !svg || drag.pointerId !== event.pointerId) return;
    const point = clientToMeters(svg, event.clientX, event.clientY);
    const plan = getScene(drag.sector);
    if (drag.kind === "move") {
      updateCamera(drag.sector, drag.id, {
        x: round2(clamp(point.x + drag.dx, 0, plan.widthM)),
        y: round2(clamp(point.y + drag.dy, 0, plan.heightM)),
      });
      return;
    }
    setLayouts((current) => {
      const camera = current[drag.sector].cameras.find((row) => row.id === drag.id);
      if (!camera) return current;
      const dist = Math.hypot(point.x - camera.x, point.y - camera.y);
      if (dist < plan.widthM * 0.03) return current;
      return {
        ...current,
        [drag.sector]: {
          ...current[drag.sector],
          cameras: current[drag.sector].cameras.map((row) =>
            row.id === drag.id
              ? { ...row, rotationDeg: Math.round(pointAngle({ x: camera.x, y: camera.y }, point)) }
              : row,
          ),
        },
      };
    });
  }

  function trackPointer(event: PointerEvent<SVGCircleElement>, drag: NonNullable<Drag>) {
    const svg = svgRef.current;
    dragRef.current = drag;
    setSelectedId(drag.id);
    if (svg) {
      try {
        svg.setPointerCapture(event.pointerId);
      } catch {
        // Capture is best-effort. Window listeners still follow the pointer.
      }
    }
    const move = (native: globalThis.PointerEvent) => applyDrag(native);
    const up = (native: globalThis.PointerEvent) => {
      applyDrag(native);
      if (dragRef.current?.pointerId === native.pointerId) dragRef.current = null;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }

  function onCameraPointerDown(event: PointerEvent<SVGCircleElement>, camera: LayoutCamera) {
    const svg = svgRef.current;
    if (!svg) return;
    const point = clientToMeters(svg, event.clientX, event.clientY);
    trackPointer(event, {
      kind: "move",
      id: camera.id,
      pointerId: event.pointerId,
      sector,
      dx: camera.x - point.x,
      dy: camera.y - point.y,
    });
  }

  function onRotatePointerDown(event: PointerEvent<SVGCircleElement>, camera: LayoutCamera) {
    trackPointer(event, {
      kind: "rotate",
      id: camera.id,
      pointerId: event.pointerId,
      sector,
      dx: 0,
      dy: 0,
    });
  }

  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    applyDrag(event);
  }

  function onPointerUp(event: PointerEvent<SVGSVGElement>) {
    applyDrag(event);
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
    if (svgRef.current?.hasPointerCapture(event.pointerId)) {
      svgRef.current.releasePointerCapture(event.pointerId);
    }
  }

  function addCamera() {
    if (layout.cameras.length >= 12) return;
    const id = nextCameraId(layout.cameras);
    const camera: LayoutCamera = {
      id,
      type: draftType,
      x: round2(scene.widthM / 2),
      y: round2(scene.heightM / 2),
      rotationDeg: 0,
    };
    setLayouts((current) => ({
      ...current,
      [sector]: { ...current[sector], cameras: [...current[sector].cameras, camera] },
    }));
    setSelectedId(id);
  }

  function removeCamera() {
    if (!selectedId) return;
    const remaining = layout.cameras.filter((camera) => camera.id !== selectedId);
    setLayouts((current) => ({
      ...current,
      [sector]: { ...current[sector], cameras: remaining },
    }));
    setSelectedId(remaining[0]?.id ?? null);
  }

  function resetLayout() {
    const next = structuredClone(defaultLayouts[sector]);
    setLayouts((current) => ({ ...current, [sector]: next }));
    setSelectedId(next.cameras[0]?.id ?? null);
  }

  const inputClass =
    "mt-1.5 w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:border-accent";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.8fr)]">
      <div className="min-w-0">
        <div role="tablist" aria-label={t("tabsLabel")} className="flex flex-wrap gap-2">
          {scenes.map((item) => {
            const active = item.sector === sector;
            return (
              <button
                key={item.sector}
                type="button"
                role="tab"
                aria-selected={active}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm",
                  active
                    ? "border-accent bg-accent text-on-accent"
                    : "border-border bg-panel text-text-secondary",
                )}
                onClick={() => {
                  setSector(item.sector);
                  setSelectedId(layouts[item.sector].cameras[0]?.id ?? null);
                  setSend({ status: "idle" });
                }}
              >
                {t(`sectors.${item.sector}`)}
              </button>
            );
          })}
        </div>

        <div className="mt-4 overflow-hidden rounded-[24px] border border-border bg-background">
          <FloorPlan
            ref={svgRef}
            scene={scene}
            cameras={layout.cameras}
            cones={analysis.cones}
            selectedId={selectedId}
            zoneLabel={(zone) => t(`zone.${zone.id}`)}
            cameraLabel={(camera) => t(`types.${camera.type}`)}
            onCameraPointerDown={onCameraPointerDown}
            onRotatePointerDown={onRotatePointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          />
        </div>
        <p className="mt-3 text-sm text-text-secondary">{t("rotateHint")}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-accent/40" />
            {t("legendView")}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-sm border border-accent bg-accent/20" />
            {t("legendPriority")}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {cameraTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm",
                draftType === type.id
                  ? "border-accent text-accent"
                  : "border-border bg-panel text-text-secondary",
              )}
              onClick={() => setDraftType(type.id)}
            >
              {t(`types.${type.id}`)}
            </button>
          ))}
          <button
            type="button"
            className={buttonClass("secondary", "px-4 py-2 disabled:opacity-40")}
            onClick={addCamera}
            disabled={layout.cameras.length >= 12}
          >
            {t("add")}
          </button>
          <button
            type="button"
            className={buttonClass("ghost", "px-4 py-2 disabled:opacity-40")}
            onClick={removeCamera}
            disabled={!selected}
          >
            {t("remove")}
          </button>
          <button type="button" className={buttonClass("ghost", "px-4 py-2")} onClick={resetLayout}>
            {t("reset")}
          </button>
        </div>

        {selected && selectedSpec ? (
          <p className="mt-3 text-sm text-text-secondary">
            {t(`types.${selected.type}`)} · {selectedSpec.rangeM} m · {selectedSpec.fovDeg}° · {selected.rotationDeg}°
          </p>
        ) : null}
      </div>

      <aside className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-xs text-text-secondary">{t("statCoverage")}</p>
            <p className="mt-1 font-display text-3xl text-foreground">{analysis.percent}%</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/60 p-4">
            <p className="text-xs text-text-secondary">{t("statCameras")}</p>
            <p className="mt-1 font-display text-3xl text-foreground">{layout.cameras.length}</p>
          </div>
        </div>

        <section className="rounded-2xl border border-border bg-background/60 p-4">
          <h2 className="text-sm text-foreground">{t("tipsTitle")}</h2>
          {analysis.tips.length === 0 ? (
            <p className="mt-2 text-sm text-text-secondary">{t("tipsClear")}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {analysis.tips.map((tip) => (
                <li key={tip.zoneId} className="text-sm text-foreground">
                  {t("tip", {
                    name: t(`zone.${tip.zoneId}`),
                    percent: tip.uncoveredPercent,
                  })}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-background/60 p-4">
          <h2 className="text-sm text-foreground">{t("package")}</h2>
          {suggestion ? (
            <div className="mt-2">
              <p className="text-foreground">{pickLocalized(suggestion.name, locale)}</p>
              <p className="mt-1 text-sm text-text-secondary">
                {pickLocalized(suggestion.description, locale)}
              </p>
              <p className="mt-2 text-xs text-text-secondary">
                {t("packageRange", { min: suggestion.min_cameras, max: suggestion.max_cameras })}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-text-secondary">{t("packageEmpty")}</p>
          )}
        </section>

        <form
          className="relative space-y-4 rounded-sm border border-border bg-panel p-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            setSend({ status: "sending" });
            const response = await fetch("/api/coverage", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: String(data.get("name") ?? ""),
                phone: String(data.get("phone") ?? ""),
                email: String(data.get("email") ?? ""),
                notes: String(data.get("notes") ?? ""),
                company_website: String(data.get("company_website") ?? ""),
                language: locale,
                layout,
                camera_count: layout.cameras.length,
                coverage_percent: analysis.percent,
              }),
            });
            const body = (await response.json().catch(() => null)) as {
              whatsappUrl?: string;
            } | null;
            if (!response.ok || !body?.whatsappUrl) {
              setSend({ status: "error" });
              return;
            }
            setSend({
              status: "sent",
              whatsappUrl: body.whatsappUrl,
              name: String(data.get("name") ?? ""),
            });
            form.reset();
          }}
        >
          <h2 className="text-sm text-foreground">{t("formTitle")}</h2>
          <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
            <label>
              {t("honeypot")}
              <input
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </label>
          </div>
          <label className="block text-sm text-text-secondary">
            {t("name")}
            <input required name="name" autoComplete="name" className={inputClass} />
          </label>
          <label className="block text-sm text-text-secondary">
            {t("phone")}
            <input required name="phone" autoComplete="tel" className={inputClass} />
          </label>
          <label className="block text-sm text-text-secondary">
            {t("email")}
            <input required type="email" name="email" autoComplete="email" className={inputClass} />
          </label>
          <label className="block text-sm text-text-secondary">
            {t("notes")}
            <textarea name="notes" rows={3} className={inputClass} />
          </label>
          <button type="submit" className={buttonClass("primary")} disabled={send.status === "sending"}>
            {send.status === "sending" ? t("sending") : t("submit")}
          </button>
          {send.status === "error" ? <p className="text-sm text-danger">{t("error")}</p> : null}
          {send.status === "sent" ? (
            <div className="space-y-2">
              <p className="text-sm text-accent">{t("success")}</p>
              <a
                className={buttonClass("secondary")}
                href={whatsAppHref(send.whatsappUrl, t("whatsappPrefill", {
                  sector: t(`sectors.${sector}`),
                  count: layout.cameras.length,
                  percent: analysis.percent,
                  name: send.name,
                }))}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("whatsapp")}
              </a>
            </div>
          ) : null}
        </form>
      </aside>
    </div>
  );
}

function whatsAppHref(base: string, text: string) {
  try {
    const url = new URL(base);
    url.searchParams.set("text", text);
    return url.toString();
  } catch {
    return base;
  }
}
