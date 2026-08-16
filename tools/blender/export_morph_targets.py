"""
Export Blender meshes as particle morph targets for the NEON scene.

Samples each selected mesh into an evenly distributed point cloud of a fixed
size, normalises it into the same unit space the shader uses, and writes a
JSON file of flat [x, y, z, ...] arrays.

Usage (background):

    blender scene.blend --background --python export_morph_targets.py -- \
        --count 4096 --out public/assets/forms.json

Usage (live session / MCP): select the meshes, then run this file from
Blender's text editor. Defaults apply.

Every target must have the same point count as the scene's particle budget
(4096 on the high tier) so the shader can interpolate between them.
"""

import bpy
import bmesh
import json
import random
import sys
from mathutils import Vector

DEFAULT_COUNT = 4096
DEFAULT_OUT = "forms.json"
SCALE = 6.0  # matches the analytic forms' half-extent in scene.js


def parse_args():
    argv = sys.argv
    argv = argv[argv.index("--") + 1:] if "--" in argv else []
    count, out = DEFAULT_COUNT, DEFAULT_OUT
    for i, arg in enumerate(argv):
        if arg == "--count" and i + 1 < len(argv):
            count = int(argv[i + 1])
        elif arg == "--out" and i + 1 < len(argv):
            out = argv[i + 1]
    return count, out


def triangulated(obj, depsgraph):
    """Evaluated, triangulated copy of the mesh in world space."""
    evaluated = obj.evaluated_get(depsgraph)
    mesh = evaluated.to_mesh()

    bm = bmesh.new()
    bm.from_mesh(mesh)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bm.transform(obj.matrix_world)

    tris = []
    for face in bm.faces:
        a, b, c = (v.co.copy() for v in face.verts[:3])
        tris.append((a, b, c, face.calc_area()))

    bm.free()
    evaluated.to_mesh_clear()
    return tris


def sample_surface(tris, count, rng):
    """Area-weighted uniform sampling across the triangle set."""
    total = sum(t[3] for t in tris)
    if total <= 0:
        return []

    # cumulative area table for weighted picking
    table, running = [], 0.0
    for a, b, c, area in tris:
        running += area
        table.append((running / total, a, b, c))

    points = []
    for _ in range(count):
        target = rng.random()
        lo, hi = 0, len(table) - 1
        while lo < hi:
            mid = (lo + hi) // 2
            if table[mid][0] < target:
                lo = mid + 1
            else:
                hi = mid
        _, a, b, c = table[lo]

        u, v = rng.random(), rng.random()
        if u + v > 1.0:
            u, v = 1.0 - u, 1.0 - v
        points.append(a + (b - a) * u + (c - a) * v)

    return points


def normalise(points, scale=SCALE):
    """Centre on origin and fit into a cube of half-extent `scale`."""
    if not points:
        return []

    lo = Vector((min(p.x for p in points), min(p.y for p in points), min(p.z for p in points)))
    hi = Vector((max(p.x for p in points), max(p.y for p in points), max(p.z for p in points)))
    centre = (lo + hi) * 0.5
    extent = max((hi - lo).x, (hi - lo).y, (hi - lo).z) or 1.0
    factor = (scale * 2.0) / extent

    flat = []
    for p in points:
        q = (p - centre) * factor
        # Blender is Z-up, three.js is Y-up
        flat.extend([round(q.x, 4), round(q.z, 4), round(-q.y, 4)])
    return flat


def main():
    count, out = parse_args()
    rng = random.Random(20260816)  # deterministic — reruns produce identical files
    depsgraph = bpy.context.evaluated_depsgraph_get()

    targets = [o for o in bpy.context.selected_objects if o.type == "MESH"]
    if not targets:
        targets = [o for o in bpy.context.scene.objects if o.type == "MESH"]

    if not targets:
        print("[morph] no mesh objects found — nothing exported")
        return

    forms = {}
    for obj in targets:
        tris = triangulated(obj, depsgraph)
        points = sample_surface(tris, count, rng)
        flat = normalise(points)
        if len(flat) != count * 3:
            print(f"[morph] skipped {obj.name}: sampled {len(flat) // 3}/{count}")
            continue
        forms[obj.name] = flat
        print(f"[morph] {obj.name}: {count} points")

    payload = {"count": count, "scale": SCALE, "space": "y-up", "forms": forms}
    with open(out, "w", encoding="utf-8") as handle:
        json.dump(payload, handle)

    size = sum(len(v) for v in forms.values()) * 3 / 1024
    print(f"[morph] wrote {len(forms)} target(s) to {out} (~{size:.0f}kB)")


if __name__ == "__main__":
    main()
