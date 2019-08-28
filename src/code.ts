import "figma-plugin-types";

const key = "settings";

interface Group {
  category: string;
  items: BaseNode[];
}

interface Settings {
  separator?: string;
  xSpacing?: number;
  ySpacing?: number;
  wrapCount?: number;
  layoutDirection?: "vertical" | "horizontal";
}

interface DefaultSettings {
  separator: string;
  xSpacing: number;
  ySpacing: number;
  wrapCount: number;
  layoutDirection: "vertical" | "horizontal";
}

const defaultSettings: DefaultSettings = {
  separator: "/",
  xSpacing: 32,
  ySpacing: 32,
  wrapCount: 10,
  layoutDirection: "horizontal"
};

const format = (settings: Settings | undefined) => {
  const d = settings ? settings : defaultSettings;
  const xSpacing = d.xSpacing ? d.xSpacing : defaultSettings.xSpacing;
  const ySpacing = d.ySpacing ? d.ySpacing : defaultSettings.ySpacing;
  const separator = d.separator ? d.separator : defaultSettings.separator;
  const wrapCount = d.wrapCount ? d.wrapCount : defaultSettings.wrapCount;
  const layoutDirection = d.layoutDirection
    ? d.layoutDirection
    : defaultSettings.layoutDirection;

  figma.currentPage.children
    .map(node => {
      return node;
    })
    // Group each node
    .reduce<Group[]>((groups, node) => {
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

      return groups;
    }, [])
    // Reorder groups
    .sort((a, b) => {
      return a.category.localeCompare(b.category, undefined, { numeric: true });
    })
    // Reorder items inside group
    .map(group => {
      const items = group.items.reverse().sort((a, b) => {
        return a.name.localeCompare(b.name, undefined, { numeric: true });
      });
      return { ...group, items };
    })
    // Move the nodes, depending on the layout direction
    .reduce<{ crossAxis: number; groups: Group[] }>(
      ({ crossAxis, groups }, group) => {
        let mainAxis = 0;
        let maxHeight = 0;
        let maxWidth = 0;

        const items = group.items.map((item, j) => {
          if (item.type !== "PAGE" && item.type !== "DOCUMENT") {
            const newItem = item;

            if (layoutDirection === "horizontal") {
              newItem.x = mainAxis;
              newItem.y = crossAxis;

              maxHeight = Math.max(maxHeight, item.height);
              mainAxis += item.width + xSpacing;

              if (j !== 0 && (j + 1) % wrapCount === 0) {
                mainAxis = 0;
                crossAxis += maxHeight + ySpacing;
                maxHeight = 0;
              }

              return newItem;
            }

            if (layoutDirection === "vertical") {
              newItem.x = crossAxis;
              newItem.y = mainAxis;

              maxWidth = Math.max(maxWidth, item.width);
              mainAxis += item.height + ySpacing;

              if (j !== 0 && (j + 1) % wrapCount === 0) {
                mainAxis = 0;
                crossAxis += maxWidth + xSpacing;
                maxWidth = 0;
              }

              return newItem;
            }
          }

          return item;
        });

        if (layoutDirection === "horizontal") {
          crossAxis += maxHeight + ySpacing;
        } else if (layoutDirection === "vertical") {
          crossAxis += maxWidth + xSpacing;
        }

        const newGroup: Group = { items, ...group };

        return { crossAxis, groups: [newGroup, ...groups] };
      },
      { groups: [], crossAxis: 0 }
    )
    .groups.forEach(group => {
      // Append every items
      group.items.reverse().forEach(item => {
        if (item.type !== "DOCUMENT" && item.type !== "PAGE") {
          figma.currentPage.appendChild(item);
        }
      });
    });
};

if (figma.command === "configure") {
  figma.showUI(__html__, { width: 400, height: 250 });
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
  if (msg.type === "format") {
    figma.clientStorage.setAsync(key, msg.settings).then(() => {
      format(msg.settings);
      figma.closePlugin("Successfully Formatted!");
    });
  }
};
