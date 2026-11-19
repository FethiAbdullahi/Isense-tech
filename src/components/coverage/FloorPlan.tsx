import { forwardRef, type PointerEvent } from "react";
import type { LayoutCamera, Point, Scene, Zone } from "@/lib/coverage-math";
import { cn } from "@/lib/utils";

type FloorPlanProps = {
  scene: Scene;
  cameras: LayoutCamera[];
  cones: { cameraId: string; polygon: Point[] }[];
  selectedId?: string | null;
  zoneLabel?: (zone: Zone) => string;
  cameraLabel?: (camera: LayoutCamera) => string;
  className?: string;
  onCameraPointerDown?: (event: PointerEvent<SVGCircleElement>, camera: LayoutCamera) => void;
  onRotatePointerDown?: (event: PointerEvent<SVGCircleElement>, camera: LayoutCamera) => void;
  onPointerMove?: (event: PointerEvent<SVGSVGElement>) => void;
  onPointerUp?: (event: PointerEvent<SVGSVGElement>) => void;
};

function pointsAttr(polygon: Point[]) {
  return polygon.map((point) => `${point.x},${point.y}`).join(" ");
}

function centroid(polygon: Point[]): Point {
  if (!polygon.length) return { x: 0, y: 0 };
  const sum = polygon.reduce((acc, point) => ({ x: acc.x + point.x, y: acc.y + point.y }), {
    x: 0,
    y: 0,
  });
  return { x: sum.x / polygon.length, y: sum.y / polygon.length };
}

export const FloorPlan = forwardRef<SVGSVGElement, FloorPlanProps>(function FloorPlan(
  {
    scene,
    cameras,
    cones,
    selectedId,
    zoneLabel,
    cameraLabel,
    className,
    onCameraPointerDown,
    onRotatePointerDown,
    onPointerMove,
    onPointerUp,
  },
  ref,
) {
  const unit = scene.widthM;
  const stroke = (value: number) => Math.round(value * 1000) / 1000;
  const wallWidth = stroke(Math.max(unit * 0.006, 0.06));
  const camR = unit * 0.016;
  const hitR = unit * 0.055;
  const handleDist = unit * 0.14;
  const handleR = unit * 0.014;
  const handleHit = unit * 0.048;
  const labelSize = unit * 0.03;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${scene.widthM} ${scene.heightM}`}
      className={cn("block h-auto w-full touch-none select-none bg-background", className)}
      style={{ aspectRatio: `${scene.widthM} / ${scene.heightM}`, direction: "ltr" }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <rect
        x={0}
        y={0}
        width={scene.widthM}
        height={scene.heightM}
        className="fill-background stroke-border"
        strokeWidth={wallWidth}
      />
      {scene.zones.map((zone) => {
        const center = centroid(zone.polygon);
        const high = zone.priority === "high";
        return (
          <g key={zone.id} className="pointer-events-none">
            <polygon
              points={pointsAttr(zone.polygon)}
              className={high ? "fill-accent/20 stroke-accent" : "fill-foreground/5 stroke-border"}
              strokeWidth={stroke(wallWidth * 0.7)}
            />
            <text
              x={center.x}
              y={center.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={labelSize}
              style={{ unicodeBidi: "plaintext" }}
              className={high ? "fill-accent" : "fill-text-secondary"}
            >
              {zoneLabel ? zoneLabel(zone) : zone.name}
            </text>
          </g>
        );
      })}
      {cones.map((cone) => {
        const selected = cone.cameraId === selectedId;
        return (
          <polygon
            key={cone.cameraId}
            points={pointsAttr(cone.polygon)}
            className="pointer-events-none stroke-accent"
            fill="var(--accent)"
            fillOpacity={selected ? 0.34 : 0.18}
            strokeWidth={stroke(wallWidth * 0.55)}
            strokeOpacity={0.85}
            suppressHydrationWarning
          />
        );
      })}
      {scene.walls.map((wall) => (
        <line
          key={wall.id}
          x1={wall.a.x}
          y1={wall.a.y}
          x2={wall.b.x}
          y2={wall.b.y}
          className="pointer-events-none stroke-foreground"
          strokeWidth={stroke(wallWidth * 1.6)}
          strokeLinecap="square"
        />
      ))}
      {cameras.map((camera) => {
        const selected = camera.id === selectedId;
        const label = cameraLabel ? cameraLabel(camera) : camera.type;
        return (
          <g key={camera.id} transform={`translate(${camera.x} ${camera.y}) rotate(${camera.rotationDeg})`}>
            <circle
              r={hitR}
              role="button"
              aria-label={label}
              className="fill-transparent"
              style={{ cursor: onCameraPointerDown ? "grab" : "default" }}
              onPointerDown={
                onCameraPointerDown
                  ? (event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onCameraPointerDown(event, camera);
                    }
                  : undefined
              }
            >
              <title>{label}</title>
            </circle>
            <circle
              r={camR}
              className={selected ? "pointer-events-none fill-accent stroke-foreground" : "pointer-events-none fill-accent"}
              strokeWidth={selected ? wallWidth : 0}
            />
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={-camR * 1.7}
              className="pointer-events-none stroke-background"
              strokeWidth={stroke(wallWidth * 0.9)}
              strokeLinecap="round"
            />
            {onRotatePointerDown ? (
              <g>
                <line
                  x1={0}
                  y1={-camR}
                  x2={0}
                  y2={-handleDist}
                  className="pointer-events-none stroke-accent"
                  strokeWidth={stroke(wallWidth * 0.45)}
                />
                <circle
                  cy={-handleDist}
                  r={handleHit}
                  role="button"
                  aria-label={`${label} aim`}
                  className="fill-transparent"
                  style={{ cursor: "crosshair" }}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onRotatePointerDown(event, camera);
                  }}
                >
                  <title>{label}</title>
                </circle>
                <circle
                  cy={-handleDist}
                  r={handleR}
                  className="pointer-events-none fill-background stroke-accent"
                  strokeWidth={stroke(wallWidth * 0.7)}
                />
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
});
