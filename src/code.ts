// figma.showUI(__html__);

interface Group {
  category: string;
  items: BaseNode[];
}

// TODO: should be configurable
const xSpacing = 32;
const ySpacing = 32;
const separator = "/";
const wrapCount = 10;

if (figma.command === "format") {
  const children = figma.currentPage.children;
  const nodes = children.map(node => {
    return node;
  });

  let groups: Group[] = [];

  // Group each node
  nodes.forEach(node => {
    const [category, _] = node.name.split(separator);

    if (
      groups.filter(g => {
        return g.category === category;
      }).length === 0
    ) {
      groups.push({ category, items: [node] });
    } else {
      groups = groups.map(g => {
        return g.category === category
          ? { ...g, items: [...g.items, node] }
          : g;
      });
    }
  });

  // Reorder groups
  groups = groups.sort((a, b) => {
    return a.category.localeCompare(b.category, undefined, { numeric: true });
  });

  // Reorder items
  groups = groups.map(group => {
    const items = group.items.sort((a, b) => {
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
    return { ...group, items };
  });

  // Move each Nodes
  let y = 0;
  groups.forEach((group, i) => {
    let x = 0;
    let maxHeight = 0;

    group.items.forEach((item, j) => {
      if (item.type !== "PAGE" && item.type !== "DOCUMENT") {
        item.x = x;
        item.y = y;

        maxHeight = Math.max(maxHeight, item.height);
        x += item.width + xSpacing;

        if (j !== 0 && j % wrapCount === 0) {
          x = 0;
          y += maxHeight + ySpacing;
          maxHeight = 0;
        }
      }
    });

    y += maxHeight + ySpacing;
  });

  // // Append nodes
  // groups.forEach(group => {
  //   group.items.forEach(item => {
  //     figma.currentPage.appendChild(item);
  //   });
  // });

  // // Delete nodes
  // children.forEach(node => {
  //   node.remove();
  // });
}

figma.closePlugin();

figma.ui.onmessage = msg => {
  if (msg.type === "format") {
  }
};
