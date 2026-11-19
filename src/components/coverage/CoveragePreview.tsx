import { getScene, isLayout, analyzeCoverage } from "@/lib/coverage-math";
import { FloorPlan } from "@/components/coverage/FloorPlan";

export function CoveragePreview({ layout }: { layout: unknown }) {
  if (!isLayout(layout)) {
    return <p className="text-sm text-text-secondary">Layout preview unavailable.</p>;
  }

  const scene = getScene(layout.sector);
  const analysis = analyzeCoverage(layout);

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-background">
      <FloorPlan scene={scene} cameras={layout.cameras} cones={analysis.cones} />
    </div>
  );
}
