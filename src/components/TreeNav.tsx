import { useState } from "react";
import type { Vignette } from "../types";
import { vignetteMeta } from "../lib/vignettes";
import "./TreeNav.css";

type TreeNavProps = {
  vignettes: Vignette[];
  selectedId: number;
  onSelect: (id: number) => void;
};

type TreeNode = {
  label: string;
  count: number;
  children?: TreeNode[];
  vignetteId?: number;
};

function buildTree(vignettes: Vignette[]): TreeNode[] {
  const { taskType, directedness, dataAccess, visibility } =
    vignetteMeta.factors;

  return taskType.map((tt) => {
    const ttVignettes = vignettes.filter((v) => v.taskType === tt);
    return {
      label: `Task Type: ${tt}`,
      count: ttVignettes.length,
      children: directedness.map((dir) => {
        const dirVignettes = ttVignettes.filter((v) => v.directedness === dir);
        return {
          label: `Directedness: ${dir}`,
          count: dirVignettes.length,
          children: dataAccess.map((da) => {
            const daVignettes = dirVignettes.filter(
              (v) => v.dataAccess === da,
            );
            return {
              label: `Data Access: ${da}`,
              count: daVignettes.length,
              children: visibility.map((vis) => {
                const leaf = daVignettes.find((v) => v.visibility === vis);
                return {
                  label: `Visibility: ${vis}`,
                  count: leaf ? 1 : 0,
                  vignetteId: leaf?.id,
                };
              }),
            };
          }),
        };
      }),
    };
  });
}

function TreeNodeItem({
  node,
  depth,
  selectedId,
  onSelect,
  defaultOpen,
}: {
  node: TreeNode;
  depth: number;
  selectedId: number;
  onSelect: (id: number) => void;
  defaultOpen: boolean;
}) {
  const isLeaf = node.vignetteId !== undefined;
  const [open, setOpen] = useState(defaultOpen || depth < 1);

  if (isLeaf) {
    return (
      <button
        type="button"
        className={`tree-nav__leaf${selectedId === node.vignetteId ? " tree-nav__leaf--active" : ""}`}
        style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
        onClick={() => onSelect(node.vignetteId!)}
      >
        {node.label}
        <span className="tree-nav__badge">#{node.vignetteId}</span>
      </button>
    );
  }

  return (
    <div className="tree-nav__branch">
      <button
        type="button"
        className="tree-nav__toggle"
        style={{ paddingLeft: `${depth * 1.25 + 0.5}rem` }}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="tree-nav__arrow">{open ? "▾" : "▸"}</span>
        {node.label}
        <span className="tree-nav__badge">({node.count})</span>
      </button>
      {open &&
        node.children?.map((child, i) => (
          <TreeNodeItem
            key={`${node.label}-${child.label}-${i}`}
            node={child}
            depth={depth + 1}
            selectedId={selectedId}
            onSelect={onSelect}
            defaultOpen={false}
          />
        ))}
    </div>
  );
}

export function TreeNav({ vignettes, selectedId, onSelect }: TreeNavProps) {
  const tree = buildTree(vignettes);

  return (
    <nav className="tree-nav" aria-label="Vignette factor tree">
      {tree.map((node) => (
        <TreeNodeItem
          key={node.label}
          node={node}
          depth={0}
          selectedId={selectedId}
          onSelect={onSelect}
          defaultOpen={false}
        />
      ))}
    </nav>
  );
}
