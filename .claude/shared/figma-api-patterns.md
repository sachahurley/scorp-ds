# Figma API Patterns — Shared Reference

Reusable code patterns for building on the Figma canvas via `figma_execute`.

## Variable Caching

Cache all variables upfront for performance. Build ONE lookup map across all collections:

```javascript
const collections = await figma.variables.getLocalVariableCollectionsAsync();

const varCache = {};
for (const collection of collections) {
  for (const id of collection.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    varCache[v.name] = v;
  }
}

function bindFill(node, variableName) {
  const variable = varCache[variableName];
  if (!variable) {
    console.warn('Missing variable: ' + variableName);
    return false;
  }
  const fillCopy = JSON.parse(JSON.stringify(node.fills));
  fillCopy[0] = figma.variables.setBoundVariableForPaint(fillCopy[0], 'color', variable);
  node.fills = fillCopy;
  return true;
}
```

- Bind **every** swatch fill to its Figma variable
- If a variable is missing, log a warning and skip (suggest `/sync-tokens`)
- Label/documentation text does NOT get variable-bound — use hardcoded color values

## Creating Frames with Auto Layout

```javascript
const frame = figma.createFrame();
frame.name = 'Component Name';
frame.layoutMode = 'HORIZONTAL'; // or 'VERTICAL'
frame.primaryAxisAlignItems = 'MIN';
frame.counterAxisAlignItems = 'MIN';
frame.itemSpacing = 16;
frame.paddingLeft = frame.paddingRight = frame.paddingTop = frame.paddingBottom = 24;
frame.primaryAxisSizingMode = 'AUTO';
frame.counterAxisSizingMode = 'AUTO';
```

## Creating Text (correct Figma font style names)

```javascript
const text = figma.createText();
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });  // NOT 'SemiBold'
await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
await figma.loadFontAsync({ family: 'Inter', style: 'Extra Bold' }); // NOT 'ExtraBold'
text.fontName = { family: 'Inter', style: 'Semi Bold' };
text.characters = 'Token Name';
text.fontSize = 12;
```

**Important:** Figma font style names use spaces: `Semi Bold` (not `SemiBold`), `Extra Bold` (not `ExtraBold`). Check your font's actual style names if you use a custom font family.

## Child Stretching in Auto Layout

```javascript
// To make a child stretch to fill parent width, use layoutAlign AFTER appending:
parent.appendChild(child);
child.layoutAlign = 'STRETCH';
// Do NOT use counterAxisSizingMode: 'FILL' — that value doesn't exist
```

## Horizontal vs Vertical Fill

```javascript
// For HORIZONTAL frames inside VERTICAL parents, use layoutSizingHorizontal:
frame.layoutSizingHorizontal = 'FILL';  // stretches to parent width

// For VERTICAL frames, use layoutAlign after appending:
parent.appendChild(child);
child.layoutAlign = 'STRETCH';
```

## Execution Chunking

Split builds into multiple `figma_execute` calls to avoid plugin timeouts:

1. **Chunk 1** — Create container frames, position on canvas
2. **Per-section chunks** — One `figma_execute` call per section
3. **Final** — Reposition, screenshot validation

Each chunk finds its parent by name: `figma.currentPage.findOne(n => n.name === '...')`

Rebuild the variable cache at the start of each chunk that needs it.

## Key Rules

- ALWAYS use async Figma API methods (`getLocalVariableCollectionsAsync`, `getVariableByIdAsync`, etc.)
- ALWAYS bind colors to variables — never hardcode hex values on the canvas
- ALWAYS take a screenshot after building to visually validate
- Use `figma.loadFontAsync` before setting text characters
- Use `layoutAlign: 'STRETCH'` (set after appending) for children that should fill parent width
