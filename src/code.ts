const key = "settings";

interface Group {
  category: string;
  items: BaseNode[];
}

interface Settings {
  separator: string;
  xSpacing: number;
  ySpacing: number;
}

const defaultSettings: Settings = {
  separator: "/",
  xSpacing: 32,
  ySpacing: 32
};

const format = (settings: Settings) => {
  const { xSpacing, ySpacing, separator } = settings
    ? settings
    : defaultSettings;

  const wrapCount = 10;

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
    const items = group.items.reverse().sort((a, b) => {
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

  // Append nodes
  groups.reverse().forEach(group => {
    group.items.reverse().forEach(item => {
      figma.currentPage.appendChild(item);
    });
  });
};

if (figma.command === "configure") {
  figma.showUI(__html__, { width: 400, height: 200 });
  figma.clientStorage.getAsync(key).then(settings => {
    figma.ui.postMessage({ settings });
  });
}

if (figma.command === "format") {
  figma.clientStorage.getAsync(key).then(settings => {
    format(settings);
    figma.closePlugin("Successfully Formatted!");
  });
}

figma.ui.onmessage = msg => {
  console.log(msg.settings);
  if (msg.type === "format") {
    figma.clientStorage.setAsync(key, msg.settings).then(() => {
      format(msg.settings);
      figma.closePlugin("Successfully Formatted!");
    });
  }
};
