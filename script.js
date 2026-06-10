
// IMPORTANT VARIABLES SECTION

// Cavas Variables
const canvas = document.getElementById("circuitCanvas");
const ctx = canvas.getContext("2d");
const adjustment = -document.querySelector(".topbar").offsetHeight;
let offsetX = 0, offsetY = 0;
let scale = 1.2;

// Control Variables
let isDragging = false;
let dragStart = { x: 0, y: 0 };

// Drag And Drop Variables
const overlayCanvas = document.getElementById("overlayCanvas");
const overlayCtx = overlayCanvas.getContext("2d");
let isDraggingElement = false;
let currentElement = null;
let dragOffset = { x: 0, y: 0 };

// Arrow Endpoint Dragging Variables
let isDraggingArrowEndpoint = false;
let draggingArrowElement = null;
let draggingArrowElementIndex = null;

// Connection Points And Wires
let connectionPoints = [];
let wires = [];
let isDraggingWire = false;
let currentWire = null;
let wireStartPoint = null;
let isDraggingWirePoint = false;
let draggingWireIndex = null;
let draggingPointType = null;
let draggedElementConnections = [];
let hoveredConnectionPoint = null;
let isWireConnecting = false;

// Text Editing Variables
let isEditingText = false;
let editingElement = null;
let editingElementIndex = null;
let textInput = null;

// Size Variables
const OVERLAY_ELEMENT_SIZE = 56;
const CANVAS_ELEMENT_SIZE = 40;

// Undo And Redo Variables
let undoStack = [];
let redoStack = [];
const MAX_UNDO_HISTORY_SIZE = 2 * 1024 * 1024; // 2MB
let currentHistorySize = 0;

// Store Placed Elements
let placedElements = [];

// Element Context Menu Variables
const elementContextMenu = document.getElementById("elementContextMenu");
let contextMenuElement = null;
let isRightClicking = false;
let longPressTimeout = null;
let touchStartPos = { x: 0, y: 0 };
let contextMenuTimeout = null;
let contextMenuOpened = false;

// Element Styles
const elementStyles = {
  0: [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: 2,
      height: 1,
      fill: "rgb(156, 156, 156)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "rect",
      x: 0.6,
      y: 0,
      width: 0.8,
      height: 1,
      fill: "rgb(227, 159, 52)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.6,
      y: -0.15,
      x2: 0.6,
      y2: 0.15,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.45,
      y: 0,
      x2: 0.75,
      y2: 0,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.75,
      y: 0,
      x2: -0.45,
      y2: 0,
      stroke: "rgb(11, 11, 11)"
    }
  ],
  1: [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: 2,
      height: 1,
      fill: "rgb(172, 169, 196)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.7,
      y: 0,
      x2: 0.7,
      y2: 0,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.2,
      y: -0.3,
      x2: 0.7,
      y2: 0,
      x3: 0.2,
      y3: 0.3,
      stroke: "rgb(11, 11, 11)"
    },
  ],
  2: [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: 2,
      height: 1,
      fill: "rgb(156, 156, 156)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "rect",
      x: 0.6,
      y: 0,
      width: 0.8,
      height: 1,
      fill: "rgb(227, 221, 52)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.6,
      y: -0.15,
      x2: 0.6,
      y2: 0.15,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.45,
      y: 0,
      x2: 0.75,
      y2: 0,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "curve",
      x: -0.75,
      y: 0,
      x2: -0.395,
      y2: 0.01,
      c: -0.35,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "curve",
      x: -0.4,
      y: 0,
      x2: -0.05,
      y2: 0,
      c: 0.35,
      stroke: "rgb(11, 11, 11)"
    }
  ],
  3: [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: 2,
      height: 1,
      fill: "rgb(168, 167, 162)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "curve",
      x: -0.7,
      y: 0,
      x2: -0.35,
      y2: 0,
      c: -0.35,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "curve",
      x: -0.35,
      y: 0,
      x2: 0,
      y2: -0,
      c: 0.35,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.01,
      y: 0.02,
      x2: 0,
      y2: 0,
      x3: 0.7,
      y3: 0,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.2,
      y: -0.3,
      x2: 0.7,
      y2: 0,
      x3: 0.2,
      y3: 0.3,
      stroke: "rgb(11, 11, 11)"
    }
  ],
  4: [
    {
      type: "polygon",
      x: -0.5,
      y: 0,
      x2: 0,
      y2: 0.5,
      x3: 0.5,
      y3: 0,
      fill: "rgb(199, 106, 0)",
      stroke: "rgb(11, 11, 11)"
    }
  ],
  5: [
    {
      type: "roundrect",
      x: 0.25,
      y: 0,
      width: 1.5,
      height: 1,
      radius: 0.5,
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "roundrect",
      x: 0.25,
      y: 0,
      width: 1.25,
      height: 0.8,
      radius: 0.4,
      fill: "rgb(240, 55, 55)",
      stroke: "rgb(82, 16, 16)"
    },
    {
      type: "circle",
      x: 0.05,
      y: 0,
      radius: 0.3,
      fill: "rgb(125, 25, 25)",
      stroke: "rgb(125, 25, 25)"
    }
  ],
  6: [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "circle",
      x: 0,
      y: 0,
      radius: 0.35,
      fill: "rgb(240, 55, 55)",
      stroke: "rgb(82, 16, 16)"
    }
  ],
  7: [
    {
      type: "polygon",
      x: -0.5,
      y: 0.3,
      x2: 0,
      y2: 0.6,
      x3: 0.5,
      y3: 0.3,
      x4: 0.5,
      y4: -0.3,
      x5: 0,
      y5: -0.6,
      x6: -0.5,
      y6: -0.3,
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "circle",
      x: 0,
      y: 0,
      radius: 0.4,
      fill: "white",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "circle",
      x: 0,
      y: 0,
      radius: 0.2,
      fill: "white",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0,
      y: 0.3,
      x2: 0,
      y2: -0.3,
      stroke: "rgb(11, 11, 11)"
    }
  ],
  8: [
    {
      type: "polygon",
      x: -0.5,
      y: 0.3,
      x2: 0,
      y2: 0.6,
      x3: 0.5,
      y3: 0.3,
      x4: 0.5,
      y4: -0.3,
      x5: 0,
      y5: -0.6,
      x6: -0.5,
      y6: -0.3,
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "circle",
      x: 0,
      y: 0,
      radius: 0.4,
      fill: "white",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.3,
      y: 0.1,
      x2: -0.12,
      y2: 0.1,
      x3: -0.12,
      y3: -0.1,
      x4: 0.12,
      y4: -0.1,
      x5: 0.12,
      y5: 0.1,
      x6: 0.3,
      y6: 0.1,
      stroke: "rgb(11, 11, 11)"
    }
  ],
  9: [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: 2,
      height: 1,
      fill: "rgb(175, 175, 175)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "rect",
      x: 0,
      y: 0.4,
      width: 2,
      height: 0.2,
      fill: "rgb(156, 156, 156)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -1,
      y: 0,
      x2: -0.1,
      y2: -0.2,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.6,
      y: -0.2,
      x2: 0.6,
      y2: -0.2,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0,
      y: -0.2,
      x2: 0,
      y2: -0.5,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.1,
      y: -0.2,
      x2: 1,
      y2: 0,
      stroke: "rgb(11, 11, 11)"
    }
  ],
  10: [
    {
      type: "polygon",
      x: -0.5,
      y: 0.5,
      x2: 0.468,
      y2: 0,
      x3: -0.5,
      y3: -0.5,
      fill: "rgb(120, 120, 120)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.5,
      y: 0.526316,
      x2: 0.5,
      y2: -0.526316,
      stroke: "rgb(11, 11, 11)"
    }
  ],
  11: [
    {
      type: "roundrect",
      x: 0.25,
      y: -0.25,
      width: 1.5,
      height: 0.5,
      radius: 0.25,
      fill: "rgb(209, 170, 98)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "roundrect",
      x: -0.325,
      y: -0.25,
      width: 0.35,
      height: 0.5,
      radius: 0.25,
      corners: "1001",
      fill: "rgb(166, 134, 71)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "roundrect",
      x: 0.825,
      y: -0.25,
      width: 0.35,
      height: 0.5,
      radius: 0.25,
      corners: "0110",
      fill: "rgb(166, 134, 71)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.15,
      y: -0.475,
      x2: -0.15,
      y2: -0.025,
      wline: 2,
      stroke: "rgb(110, 55, 0)"
    },
    {
      type: "lines",
      x: 0.11666,
      y: -0.475,
      x2: 0.11666,
      y2: -0.025,
      wline: 2,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.38333,
      y: -0.475,
      x2: 0.38333,
      y2: -0.025,
      wline: 2,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.65,
      y: -0.475,
      x2: 0.65,
      y2: -0.025,
      wline: 2,
      stroke: "rgb(219, 212, 0)"
    }
  ],
  12: [
    {
      type: "roundrect",
      x: 0.25,
      y: -0.25,
      width: 1.5,
      height: 0.5,
      radius: 0.25,
      fill: "rgb(204, 222, 235)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.15,
      y: -0.2,
      x2: -0.05,
      y2: -0.3,
      x3: 0.05,
      y3: -0.2,
      x4: 0.15,
      y4: -0.3,
      x5: 0.25,
      y5: -0.2,
      x6: 0.35,
      y6: -0.3,
      x7: 0.45,
      y7: -0.2,
      x8: 0.55,
      y8: -0.3,
      x9: 0.65,
      y9: -0.2,
      wline: 0.4,
      stroke: "rgb(70, 0, 0)"
    },
    {
      type: "roundrect",
      x: -0.325,
      y: -0.25,
      width: 0.35,
      height: 0.5,
      radius: 0.25,
      corners: "1001",
      fill: "rgb(175, 175, 175)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "roundrect",
      x: 0.825,
      y: -0.25,
      width: 0.35,
      height: 0.5,
      radius: 0.25,
      corners: "0110",
      fill: "rgb(175, 175, 175)",
      stroke: "rgb(11, 11, 11)"
    }
  ],
  13: [
    {
      type: "roundrect",
      x: 0.25,
      y: -0.25,
      width: 1.5,
      height: 0.5,
      radius: 0.25,
      fill: "rgb(193, 196, 199)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "roundrect",
      x: -0.325,
      y: -0.25,
      width: 0.35,
      height: 0.5,
      radius: 0.25,
      corners: "1001",
      fill: "rgb(146, 153, 161)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "roundrect",
      x: 0.825,
      y: -0.25,
      width: 0.35,
      height: 0.5,
      radius: 0.25,
      corners: "0110",
      fill: "rgb(146, 153, 161)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.15,
      y: -0.25,
      x2: 0.15,
      y2: -0.25,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.15,
      y: -0.425,
      x2: 0.15,
      y2: -0.075,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.35,
      y: -0.425,
      x2: 0.35,
      y2: -0.075,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.35,
      y: -0.25,
      x2: 0.65,
      y2: -0.25,
      stroke: "rgb(11, 11, 11)"
    }
  ],
  14: [
    {
      type: "roundrect",
      x: 0.25,
      y: -0.25,
      width: 1.5,
      height: 0.5,
      radius: 0.25,
      fill: "rgb(150, 150, 150)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "roundrect",
      x: -0.325,
      y: -0.25,
      width: 0.35,
      height: 0.5,
      radius: 0.25,
      corners: "1001",
      fill: "rgb(175, 175, 175)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "roundrect",
      x: 0.825,
      y: -0.25,
      width: 0.35,
      height: 0.5,
      radius: 0.25,
      corners: "0110",
      fill: "rgb(175, 175, 175)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "curve",
      x: -0.1,
      y: -0.25,
      x2: 0,
      y2: -0.25,
      c: -0.4,
      stroke: "rgb(242, 179, 19)"
    },
    {
      type: "curve",
      x: 0,
      y: -0.25,
      x2: 0.1,
      y2: -0.25,
      c: 0.4,
      stroke: "rgb(242, 179, 19)"
    },
    {
      type: "curve",
      x: 0.1,
      y: -0.25,
      x2: 0.2,
      y2: -0.25,
      c: -0.4,
      stroke: "rgb(242, 179, 19)"
    },
    {
      type: "curve",
      x: 0.2,
      y: -0.25,
      x2: 0.3,
      y2: -0.25,
      c: 0.4,
      stroke: "rgb(242, 179, 19)"
    },
    {
      type: "curve",
      x: 0.3,
      y: -0.25,
      x2: 0.4,
      y2: -0.25,
      c: -0.4,
      stroke: "rgb(242, 179, 19)"
    },
    {
      type: "curve",
      x: 0.4,
      y: -0.25,
      x2: 0.5,
      y2: -0.25,
      c: 0.4,
      stroke: "rgb(242, 179, 19)"
    },
    {
      type: "curve",
      x: 0.5,
      y: -0.25,
      x2: 0.6,
      y2: -0.25,
      c: -0.4,
      stroke: "rgb(242, 179, 19)"
    },
    {
      type: "lines",
      x: -0.125,
      y: -0.25,
      x2: -0.1,
      y2: -0.25,
      x3: -0.099,
      y3: -0.26,
      stroke: "rgb(242, 179, 19)"
    },
    {
      type: "lines",
      x: 0.625,
      y: -0.25,
      x2: 0.6,
      y2: -0.25,
      x3: 0.599,
      y3: -0.26,
      stroke: "rgb(242, 179, 19)"
    }
  ],
  15: [
    {
      type: "roundrect",
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      radius: 0.5,
      corners: "0011",
      fill: "rgb(120, 120, 120)",
      stroke: "rgb(11, 11, 11)"
    }
  ],
  16: [
    {
      type: "roundrect",
      x: 0,
      y: -0.1,
      width: 0.6,
      height: 1,
      radius: 0.3,
      corners: "0011",
      fill: "rgb(175, 175, 175)",
    },
    {
      type: "rect",
      x: 0,
      y: -0.03,
      width: 0.55,
      height: 0.06,
      fill: "rgb(150, 150, 150)"
    },
    {
      type: "rect",
      x: 0,
      y: 0.07,
      width: 0.55,
      height: 0.06,
      fill: "rgb(150, 150, 150)"
    },
    {
      type: "rect",
      x: 0,
      y: 0.17,
      width: 0.55,
      height: 0.06,
      fill: "rgb(150, 150, 150)"
    },
    {
      type: "roundrect",
      x: 0,
      y: -0.1,
      width: 0.6,
      height: 1,
      radius: 0.3,
      corners: "0011",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "circle",
      x: 0,
      y: -0.5,
      radius: 0.5,
      fill: "rgb(120, 120, 120)",
      stroke: "rgb(11, 11, 11)"
    }
  ],
  17: [
    {
      type: "circle",
      x: 0,
      y: 0,
      radius: 0.5,
      fill: "rgb(90, 90, 90)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "circle",
      x: 0,
      y: 0,
      radius: 0.2,
      fill: "rgb(50, 50, 50)",
      stroke: "rgb(72, 72, 72)"
    }
  ],
  18: [
    {
      type: "rect",
      x: 0.25,
      y: 0,
      width: 1.5,
      height: 2,
      fill: "rgb(120, 120, 120)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.05,
      y: -0.7,
      x2: 0.55,
      y2: -0.7,
      wline: 2,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.6,
      y: -0.65,
      x2: 0.55,
      y2: -0.05,
      wline: 2,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.55,
      y: 0.05,
      x2: 0.5,
      y2: 0.65,
      wline: 2,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.15,
      y: 0.7,
      x2: 0.45,
      y2: 0.7,
      wline: 2,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.15,
      y: 0.05,
      x2: -0.2,
      y2: 0.65,
      wline: 2,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.1,
      y: -0.65,
      x2: -0.15,
      y2: -0.05,
      wline: 2,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.1,
      y: 0,
      x2: 0.5,
      y2: 0,
      wline: 2,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "rect",
      x: 0.75,
      y: 0.65,
      width: 0.2,
      height: 0.2,
      fill: "rgb(11, 11, 11)"
    }
  ],
  19: [
    {
      type: "lines",
      x: -0.5,
      y: 0.5,
      x2: -0.25,
      y2: 0.5,
      x3: 0.25,
      y3: 0.25,
      x4: 0.5,
      y4: 0.25,
      wline: 2,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.5,
      y: 0,
      x2: -0.25,
      y2: 0,
      x3: 0.25,
      y3: 0.25,
      wline: 2,
      stroke: "rgb(11, 11, 11)"
    }
  ],
  20: [
    {
      type: "lines",
      x: 0.5,
      y: 0.5,
      x2: 0.25,
      y2: 0.5,
      x3: -0.25,
      y3: 0.25,
      x4: -0.5,
      y4: 0.25,
      wline: 2,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.5,
      y: 0,
      x2: 0.25,
      y2: 0,
      x3: -0.25,
      y3: 0.25,
      wline: 2,
      stroke: "rgb(11, 11, 11)"
    }
  ],
  21: [
    {
      type: "roundrect",
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      radius: 0.5,
      corners: "0110",
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    }
  ],
  22: [
    {
      type: "polygon",
      x: -0.5,
      y: -0.5,
      x2: -0.4,
      y2: -0.2,
      x3: -0.4,
      y3: 0.2,
      x4: -0.5,
      y4: 0.5,
      x5: -0.2,
      y5: 0.5,
      x6: 0.2,
      y6: 0.32,
      x7: 0.5,
      y7: 0,
      x8: 0.2,
      y8: -0.32,
      x9: -0.2,
      y9: -0.5,
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    }
  ],
  23: [
    {
      type: "roundrect",
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      radius: 0.5,
      corners: "0110",
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "circle",
      x: 0.625,
      y: 0,
      radius: 0.125,
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    }
  ],
  24: [
    {
      type: "polygon",
      x: -0.5,
      y: -0.5,
      x2: -0.4,
      y2: -0.2,
      x3: -0.4,
      y3: 0.2,
      x4: -0.5,
      y4: 0.5,
      x5: -0.2,
      y5: 0.5,
      x6: 0.2,
      y6: 0.32,
      x7: 0.5,
      y7: 0,
      x8: 0.2,
      y8: -0.32,
      x9: -0.2,
      y9: -0.5,
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "circle",
      x: 0.625,
      y: 0,
      radius: 0.125,
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    }
  ],
  25: [
    {
      type: "polygon",
      x: -0.5,
      y: -0.5,
      x2: -0.4,
      y2: -0.2,
      x3: -0.4,
      y3: 0.2,
      x4: -0.5,
      y4: 0.5,
      x5: -0.2,
      y5: 0.5,
      x6: 0.2,
      y6: 0.32,
      x7: 0.5,
      y7: 0,
      x8: 0.2,
      y8: -0.32,
      x9: -0.2,
      y9: -0.5,
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.65,
      y: -0.5,
      x2: -0.55,
      y2: -0.2,
      x3: -0.55,
      y3: 0.2,
      x4: -0.65,
      y4: 0.5,
      stroke: "rgb(11, 11, 11)"
    }
  ],
  26: [
    {
      type: "polygon",
      x: -0.5,
      y: -0.5,
      x2: -0.4,
      y2: -0.2,
      x3: -0.4,
      y3: 0.2,
      x4: -0.5,
      y4: 0.5,
      x5: -0.2,
      y5: 0.5,
      x6: 0.2,
      y6: 0.32,
      x7: 0.5,
      y7: 0,
      x8: 0.2,
      y8: -0.32,
      x9: -0.2,
      y9: -0.5,
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "circle",
      x: 0.625,
      y: 0,
      radius: 0.125,
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.65,
      y: -0.5,
      x2: -0.55,
      y2: -0.2,
      x3: -0.55,
      y3: 0.2,
      x4: -0.65,
      y4: 0.5,
      stroke: "rgb(11, 11, 11)"
    }
  ],
  27: [
    {
      type: "polygon",
      x: -0.5,
      y: -0.5,
      x2: -0.5,
      y2: 0.5,
      x3: 0.5,
      y3: 0,
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "circle",
      x: 0.625,
      y: 0,
      radius: 0.125,
      fill: "rgb(144, 201, 240)",
      stroke: "rgb(11, 11, 11)"
    }
  ],
  28: [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      fill: "rgb(175, 175, 175)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "text",
      x: 0,
      y: 0.06,
      text: "D",
      size: 30,
      fill: "rgb(11, 11, 11)"
    }
  ],
  29: [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      fill: "rgb(175, 175, 175)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "text",
      x: 0,
      y: 0.06,
      text: "T",
      size: 30,
      fill: "rgb(11, 11, 11)"
    }
  ],
  30: [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      fill: "rgb(175, 175, 175)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "text",
      x: 0,
      y: 0.06,
      text: "S",
      size: 30,
      fill: "rgb(11, 11, 11)"
    }
  ],
  31: [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      fill: "rgb(175, 175, 175)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "text",
      x: 0,
      y: 0.06,
      text: "J",
      size: 30,
      fill: "rgb(11, 11, 11)"
    }
  ],
  32: [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      fill: "rgb(175, 175, 175)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "text",
      x: 0,
      y: 0.06,
      text: "L",
      size: 30,
      fill: "rgb(11, 11, 11)"
    }
  ],
  33: [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      fill: "rgb(175, 175, 175)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "text",
      x: 0,
      y: 0.06,
      text: "B",
      size: 30,
      fill: "rgb(11, 11, 11)"
    }
  ],
  34: [
    {
      type: "polygon",
      x: -0.5,
      y: 0.5,
      x2: -0.5,
      y2: -0.5,
      x3: 0.5,
      y3: 0,
      x4: 0.5,
      y4: 0,
      fill: "rgb(81, 207, 72)",
      stroke: "rgb(11, 11, 11)"
    }
  ],
  35: [
    {
      type: "polygon",
      x: 0.5,
      y: 0.5,
      x2: 0.5,
      y2: -0.5,
      x3: -0.5,
      y3: 0,
      x4: -0.5,
      y4: 0,
      fill: "rgb(81, 207, 72)",
      stroke: "rgb(11, 11, 11)"
    }
  ],
  36: [
    {
      type: "polygon",
      x: -0.5,
      y: 1,
      x2: -0.5,
      y2: -1,
      x3: 0.5,
      y3: -0.5,
      x4: 0.5,
      y4: 0.5,
      fill: "rgb(219, 176, 68)",
      stroke: "rgb(11, 11, 11)"
    }
  ],
  37: [
    {
      type: "polygon",
      x: 0.5,
      y: 1,
      x2: 0.5,
      y2: -1,
      x3: -0.5,
      y3: -0.5,
      x4: -0.5,
      y4: 0.5,
      fill: "rgb(219, 176, 68)",
      stroke: "rgb(11, 11, 11)"
    }
  ],
  38: [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: 1,
      height: 2,
      fill: "rgb(98, 210, 217)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "rect",
      x: 0,
      y: 0.8,
      width: 1,
      height: 0.4,
      fill: "rgb(112, 192, 196)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "rect",
      x: 0,
      y: -0.8,
      width: 1,
      height: 0.4,
      fill: "rgb(112, 192, 196)",
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "circle",
      x: 0,
      y: 0,
      radius: 0.2,
      wline: 1.5,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0,
      y: -0.2,
      x2: 0,
      y2: -0.4,
      wline: 1.5,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.15,
      y: -0.15,
      x2: 0.285,
      y2: -0.285,
      wline: 1.5,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.2,
      y: 0,
      x2: 0.4,
      y2: 0,
      wline: 1.5,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.15,
      y: 0.15,
      x2: 0.285,
      y2: 0.285,
      wline: 1.5,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0,
      y: 0.2,
      x2: 0,
      y2: 0.4,
      wline: 1.5,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.15,
      y: 0.15,
      x2: -0.285,
      y2: 0.285,
      wline: 1.5,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.2,
      y: 0,
      x2: -0.4,
      y2: 0,
      wline: 1.5,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.15,
      y: -0.15,
      x2: -0.285,
      y2: -0.285,
      wline: 1.5,
      stroke: "rgb(11, 11, 11)"
    }
  ],
  39: [
    {
      type: "circle",
      x: 0.35,
      y: -0.25,
      radius: 0.1,
      fill: "rgb(11, 11, 11)"
    },
    {
      type: "text",
      x: 0.55,
      y: -0.21,
      text: "Text",
      leftAlign: true,
      size: 20,
      fill: "rgb(11, 11, 11)"
    }
  ],
  40: [
    {
      type: "circle",
      x: -0.25,
      y: -0.25,
      radius: 0.1,
      fill: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: -0.25,
      y: -0.25,
      x2: 0.75,
      y2: -0.25,
      wline: 1.8,
      stroke: "rgb(11, 11, 11)"
    },
    {
      type: "lines",
      x: 0.4,
      y: -0.45,
      x2: 0.75,
      y2: -0.25,
      x3: 0.4,
      y3: -0.05,
      wline: 1.8,
      stroke: "rgb(11, 11, 11)"
    }
  ]
};

// Element Hitboxes
const elementHitboxes = {
  0: {
    type: "rect",
    x: 0,
    y: 0,
    width: 2,
    height: 1
  },
  1: {
    type: "rect",
    x: 0,
    y: 0,
    width: 2,
    height: 1
  },
  2: {
    type: "rect",
    x: 0,
    y: 0,
    width: 2,
    height: 1
  },
  3: {
    type: "rect",
    x: 0,
    y: 0,
    width: 2,
    height: 1
  },
  4: {
    type: "3point",
    x: -0.5,
    y: 0,
    x2: 0,
    y2: 0.5,
    x3: 0.5,
    y3: 0
  },
  5: {
    type: "roundrect",
    x: 0.25,
    y: 0,
    width: 1.5,
    height: 1,
    radius: 0.5
  },
  6: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  7: {
    type: "circle",
    x: 0,
    y: 0,
    radius: 0.6
  },
  8: {
    type: "circle",
    x: 0,
    y: 0,
    radius: 0.6
  },
  9: {
    type: "rect",
    x: 0,
    y: 0,
    width: 2,
    height: 1
  },
  10: {
    type: "3point",
    x: -0.5,
    y: 0.5,
    x2: 0.5,
    y2: 0,
    x3: -0.5,
    y3: -0.5
  },
  11: {
    type: "roundrect",
    x: 0.25,
    y: -0.25,
    width: 1.5,
    height: 0.5,
    radius: 0.25
  },
  12: {
    type: "roundrect",
    x: 0.25,
    y: -0.25,
    width: 1.5,
    height: 0.5
  },
  13: {
    type: "roundrect",
    x: 0.25,
    y: -0.25,
    width: 1.5,
    height: 0.5
  },
  14: {
    type: "roundrect",
    x: 0.25,
    y: -0.25,
    width: 1.5,
    height: 0.5
  },
  15: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  16: {
    type: "roundrect",
    x: 0,
    y: -0.3,
    width: 1,
    height: 1.4,
    radius: 0.5
  },
  17: {
    type: "circle",
    x: 0,
    y: 0,
    radius: 0.5
  },
  18: {
    type: "rect",
    x: 0.25,
    y: 0,
    width: 1.5,
    height: 2
  },
  19: {
    type: "3point",
    x: -0.5,
    y: -0.1,
    x2: -0.5,
    y2: 0.6,
    x3: 0.5,
    y3: 0.25
  },
  20: {
    type: "3point",
    x: 0.5,
    y: -0.1,
    x2: 0.5,
    y2: 0.6,
    x3: -0.5,
    y3: 0.25
  },
  21: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  22: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  23: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  24: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  25: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  26: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  27: {
    type: "3point",
    x: -0.5,
    y: -0.5,
    x2: -0.5,
    y2: 0.5,
    x3: 0.5,
    y3: 0
  },
  28: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  29: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  30: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  31: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  32: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  33: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  34: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  35: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 1
  },
  36: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 2
  },
  37: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 2
  },
  38: {
    type: "rect",
    x: 0,
    y: 0,
    width: 1,
    height: 2
  },
  39: {
    type: "circle",
    x: 0.35,
    y: -0.25,
    radius: 0.25
  },
  40: {
    type: "circle",
    x: -0.25,
    y: -0.25,
    radius: 0.25
  }
};

// Element Offsets
const elementOffset = [
  {x: 0, y: 0},   // 0: Voltage Source
  {x: 0, y: 0},   // 1: Current Source
  {x: 0, y: 0},   // 2: AC Voltage Source
  {x: 0, y: 0},   // 3: AC Current Source
  {x: 0, y: -3},   // 4: Ground
  {x: -6, y: 0},   // 5: Switch
  {x: 0, y: 0},   // 6: Button
  {x: 0, y: 0},   // 7: Clock Generator
  {x: 0, y: 0},   // 8: Pulse Generator
  {x: 0, y: 0},   // 9: Transistor
  {x: 0, y: 0},   // 10: Diode
  {x: -6, y: 6},   // 11: Resistor
  {x: -6, y: 6},   // 12: Fuse
  {x: -6, y: 6},   // 13: Capacitor
  {x: -6, y: 6},   // 14: Inductor
  {x: 0, y: 0},   // 15: LED
  {x: 0, y: 6},   // 16: Light Bulb
  {x: 0, y: 0},   // 17: Buzzer
  {x: -6, y: 0},   // 18: Segment Display
  {x: 0, y: -6},   // 19: Merger
  {x: 0, y: -6},   // 20: Splitter
  {x: 0, y: 0},   // 21: And
  {x: 0, y: 0},   // 22: Or
  {x: 0, y: 0},   // 23: Nand
  {x: 0, y: 0},   // 24: Nor
  {x: 0, y: 0},   // 25: Xor
  {x: 0, y: 0},   // 26: Xnor
  {x: 0, y: 0},   // 27: Not
  {x: 0, y: 0},   // 28: D Flip-Flop
  {x: 0, y: 0},   // 29: T Flip-Flop
  {x: 0, y: 0},   // 30: SR Flip-Flop
  {x: 0, y: 0},   // 31: JK Flip-Flop
  {x: 0, y: 0},   // 32: SR Latch
  {x: 0, y: 0},   // 33: Binary Counter
  {x: 0, y: 0},   // 34: Mux
  {x: 0, y: 0},   // 35: Demux
  {x: 0, y: 0},   // 36: Encoder
  {x: 0, y: 0},   // 37: Decoder
  {x: 0, y: 0},   // 38: Display Decoder
  {x: -22, y: 6},   // 39: Text
  {x: -6, y: 6}    // 40: Arrow
];

// Element Rotation Offsets
const elementRotationOffset = {
  5: [{x: 10, y: -20}, {x: 20, y: 0}, {x: 10, y: 0}],   // 5: Switch
  11: [{x: 0, y: -20}, {x: 20, y: -20}, {x: 20, y: 0}],   // 11: Resistor
  12: [{x: 0, y: -20}, {x: 20, y: -20}, {x: 20, y: 0}],   // 12: Fuse
  13: [{x: 0, y: -20}, {x: 20, y: -20}, {x: 20, y: 0}],   // 13: Capacitor
  14: [{x: 0, y: -20}, {x: 20, y: -20}, {x: 20, y: 0}],   // 14: Inductor
  18: [{x: 10, y: 0}, {x: 20, y: 0}, {x: 10, y: 20}],   // 18: Segment Display
  19: [{x: 10, y: 0}, {x: 0, y: 20}, {x: -10, y: 0}],   // 19: Merger
  20: [{x: 10, y: 0}, {x: 0, y: 20}, {x: -10, y: 0}],   // 20: Splitter
  39: [{x: 0, y: -20}, {x: 20, y: -20}, {x: 20, y: 0}]   // 39: Text
};

// Element Text Heights
const elementTextHeight = [
  0,  // 0: Voltage Source
  0,  // 1: Current Source
  0,  // 2: AC Voltage Source
  0,  // 3: AC Current Source
  0,  // 4: Ground
  0,  // 5: Switch
  0,  // 6: Button
  0,  // 7: Clock Generator
  0,  // 8: Pulse Generator
  0,  // 9: Transistor
  0,  // 10: Diode
  20,  // 11: Resistor
  20,  // 12: Fuse
  20,  // 13: Capacitor
  20,  // 14: Inductor
  0,  // 15: LED
  0,  // 16: Light Bulb
  0,  // 17: Buzzer
  -20,  // 18: Segment Display
  0,  // 19: Merger
  0,  // 20: Splitter
  0,  // 21: And
  0,  // 22: Or
  0,  // 23: Nand
  0,  // 24: Nor
  0,  // 25: Xor
  0,  // 26: Xnor
  0,  // 27: Not
  0,  // 28: D Flip-Flop
  0,  // 29: T Flip-Flop
  0,  // 30: SR Flip-Flop
  0,  // 31: JK Flip-Flop
  0,  // 32: SR Latch
  0,  // 33: Binary Counter
  0,  // 34: Mux
  0,  // 35: Demux
  -20,  // 36: Encoder
  -20,  // 37: Decoder
  -20,  // 38: Display Decoder
  0,  // 39: Text
  0   // 40: Arrow
];

// Rotation Text Height
const rotationTextHeight = {
  0: [-20, 0, -20],  // 0: Voltage Source
  1: [-20, 0, -20],  // 1: Current Source
  2: [-20, 0, -20],  // 2: AC Voltage Source
  3: [-20, 0, -20],  // 3: AC Current Source
  4: [0, 60, 0],  // 4: Ground
  9: [-20, 0, -20],  // 9: Transistor
  11: [-20, 0, -20],  // 11: Resistor
  12: [-20, 0, -20],  // 12: Fuse
  13: [-20, 0, -20],  // 13: Capacitor
  14: [-20, 0, -20],  // 14: Inductor
  15: [0, 60, 0],  // 15: LED
  16: [0, -20, 0],  // 16: Light Bulb
  36: [20, 0, 20],  // 36: Encoder
  37: [20, 0, 20],  // 37: Decoder
  38: [20, 0, 20]  // 38: Display Decoder
};

// Element Connection Points
const elementConnectionPoints = {
  0: [
    {x: -1, y: 0, type: "input"},
    {x: 1, y: 0, type: "output"}
  ],
  1: [
    {x: -1, y: 0, type: "input"},
    {x: 1, y: 0, type: "output"}
  ],
  2: [
    {x: -1, y: 0, type: "input"},
    {x: 1, y: 0, type: "output"}
  ],
  3: [
    {x: -1, y: 0, type: "input"},
    {x: 1, y: 0, type: "output"}
  ],
  4: [
    {x: 0, y: 0, type: "input"}
  ],
  5: [
    {x: -0.5, y: 0, type: "input"},
    {x: 1, y: 0, type: "output"}
  ],
  6: [
    {x: -0.5, y: 0, type: "input"},
    {x: 0.5, y: 0, type: "output"}
  ],
  7: [
    {x: -0.5, y: 0, type: "input"},
    {x: 0.5, y: 0, type: "output"}
  ],
  8: [
    {x: -0.5, y: 0, type: "input"},
    {x: 0.5, y: 0, type: "output"}
  ],
  9: [
    {x: -1, y: 0, type: "input"},
    {x: 0, y: -0.5, type: "input"},
    {x: 1, y: 0, type: "output"}
  ],
  10: [
    {x: -0.5, y: 0, type: "input"},
    {x: 0.5, y: 0, type: "output"}
  ],
  11: [
    {x: -0.5, y: -0.25, type: "input"},
    {x: 1, y: -0.25, type: "output"}
  ],
  12: [
    {x: -0.5, y: -0.25, type: "input"},
    {x: 1, y: -0.25, type: "output"}
  ],
  13: [
    {x: -0.5, y: -0.25, type: "input"},
    {x: 1, y: -0.25, type: "output"}
  ],
  14: [
    {x: -0.5, y: -0.25, type: "input"},
    {x: 1, y: -0.25, type: "output"}
  ],
  15: [
    {x: -0.25, y: -0.5, type: "input"},
    {x: 0.25, y: -0.5, type: "output"}
  ],
  16: [
    {x: -0.3, y: 0.12, type: "input"},
    {x: 0.3, y: 0.12, type: "output"}
  ],
  17: [
    {x: -0.5, y: 0, type: "input"},
    {x: 0.5, y: 0, type: "output"}
  ],
  18: [
    {x: -0.5, y: -0.875, type: "input"},
    {x: -0.5, y: -0.625, type: "input"},
    {x: -0.5, y: -0.375, type: "input"},
    {x: -0.5, y: -0.125, type: "input"},
    {x: -0.5, y: 0.125, type: "input"},
    {x: -0.5, y: 0.375, type: "input"},
    {x: -0.5, y: 0.625, type: "input"},
    {x: -0.5, y: 0.875, type: "input"},
    {x: 1, y: -0.875, type: "output"},
    {x: 1, y: -0.625, type: "output"},
    {x: 1, y: -0.375, type: "output"},
    {x: 1, y: -0.125, type: "output"},
    {x: 1, y: 0.125, type: "output"},
    {x: 1, y: 0.375, type: "output"},
    {x: 1, y: 0.625, type: "output"},
    {x: 1, y: 0.875, type: "output"},
  ],
  19: [
    {x: -0.5, y: 0, type: "input"},
    {x: -0.5, y: 0.5, type: "input"},
    {x: 0.5, y: 0.25, type: "output"}
  ],
  20: [
    {x: -0.5, y: 0.25, type: "input"},
    {x: 0.5, y: 0, type: "output"},
    {x: 0.5, y: 0.5, type: "output"}
  ],
  21: [
    {x: -0.5, y: -0.25, type: "input"},
    {x: -0.5, y: 0.25, type: "input"},
    {x: 0.5, y: 0, type: "output"}
  ],
  22: [
    {x: -0.41, y: -0.25, type: "input"},
    {x: -0.41, y: 0.25, type: "input"},
    {x: 0.5, y: 0, type: "output"}
  ],
  23: [
    {x: -0.5, y: -0.25, type: "input"},
    {x: -0.5, y: 0.25, type: "input"},
    {x: 0.75, y: 0, type: "output"}
  ],
  24: [
    {x: -0.41, y: -0.25, type: "input"},
    {x: -0.41, y: 0.25, type: "input"},
    {x: 0.75, y: 0, type: "output"}
  ],
  25: [
    {x: -0.41, y: -0.25, type: "input"},
    {x: -0.41, y: 0.25, type: "input"},
    {x: 0.5, y: 0, type: "output"}
  ],
  26: [
    {x: -0.41, y: -0.25, type: "input"},
    {x: -0.41, y: 0.25, type: "input"},
    {x: 0.75, y: 0, type: "output"}
  ],
  27: [
    {x: -0.5, y: 0, type: "input"},
    {x: 0.75, y: 0, type: "output"}
  ],
  28: [
    {x: -0.5, y: 0, type: "input"},
    {x: 0, y: -0.5, type: "input"},
    {x: 0.5, y: 0, type: "output"}
  ],
  29: [
    {x: -0.5, y: 0, type: "input"},
    {x: 0, y: -0.5, type: "input"},
    {x: 0.5, y: 0, type: "output"}
  ],
  30: [
    {x: -0.5, y: -0.25, type: "input"},
    {x: -0.5, y: 0.25, type: "input"},
    {x: 0, y: -0.5, type: "input"},
    {x: 0.5, y: 0, type: "output"}
  ],
  31: [
    {x: -0.5, y: -0.25, type: "input"},
    {x: -0.5, y: 0.25, type: "input"},
    {x: 0, y: -0.5, type: "input"},
    {x: 0.5, y: 0, type: "output"}
  ],
  32: [
    {x: -0.5, y: -0.25, type: "input"},
    {x: -0.5, y: 0.25, type: "input"},
    {x: 0.5, y: 0, type: "output"}
  ],
  33: [
    {x: -0.5, y: 0, type: "input"},
    {x: 0.5, y: -0.25, type: "output"},
    {x: 0.5, y: 0.25, type: "output"}
  ],
  34: [
    {x: -0.5, y: -0.25, type: "input"},
    {x: -0.5, y: 0.25, type: "input"},
    {x: 0, y: -0.25, type: "input"},
    {x: 0.5, y: 0, type: "output"}
  ],
  35: [
    {x: -0.5, y: 0, type: "input"},
    {x: 0, y: -0.25, type: "input"},
    {x: 0.5, y: -0.25, type: "output"},
    {x: 0.5, y: 0.25, type: "output"}
  ],
  36: [
    {x: -0.5, y: -0.75, type: "input"},
    {x: -0.5, y: -0.25, type: "input"},
    {x: -0.5, y: 0.25, type: "input"},
    {x: -0.5, y: 0.75, type: "input"},
    {x: 0.5, y: -0.25, type: "output"},
    {x: 0.5, y: 0.25, type: "output"}
  ],
  37: [
    {x: -0.5, y: -0.25, type: "input"},
    {x: -0.5, y: 0.25, type: "input"},
    {x: 0.5, y: -0.75, type: "output"},
    {x: 0.5, y: -0.25, type: "output"},
    {x: 0.5, y: 0.25, type: "output"},
    {x: 0.5, y: 0.75, type: "output"}
  ],
  38: [
    {x: -0.5, y: -0.75, type: "input"},
    {x: -0.5, y: -0.375, type: "input"},
    {x: -0.5, y: 0, type: "input"},
    {x: -0.5, y: 0.375, type: "input"},
    {x: -0.5, y: 0.75, type: "input"},
    {x: 0.5, y: -0.875, type: "output"},
    {x: 0.5, y: -0.625, type: "output"},
    {x: 0.5, y: -0.375, type: "output"},
    {x: 0.5, y: -0.125, type: "output"},
    {x: 0.5, y: 0.125, type: "output"},
    {x: 0.5, y: 0.375, type: "output"},
    {x: 0.5, y: 0.625, type: "output"},
    {x: 0.5, y: 0.875, type: "output"},
  ],
};

const exampleProjects = [
  `{"name":"Simple Circuit","elements":[{"type":"Ground","x":520,"y":140,"rotation":0,"showText":true},{"type":"Light Bulb","x":440,"y":140,"rotation":0,"showText":true},{"type":"Resistor","x":340,"y":160,"rotation":0,"showText":true},{"type":"Switch","x":240,"y":140,"rotation":0,"showText":true},{"type":"Voltage Source","x":140,"y":140,"rotation":0,"showText":true},{"type":"Text","x":100,"y":80,"rotation":0,"showText":false,"textContent":"Simple Circuit"}],"wires":[{"isDiagonal":false,"end":{"type":"element","elementIndex":4,"connectionIndex":1},"start":{"type":"element","elementIndex":3,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":3,"connectionIndex":1},"start":{"type":"element","elementIndex":2,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":2,"connectionIndex":1},"start":{"type":"element","elementIndex":1,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":1,"connectionIndex":1},"start":{"type":"element","elementIndex":0,"connectionIndex":0}}],"connectionPoints":[{"x":520,"y":140,"type":"input","elementIndex":0,"connectionIndex":0},{"x":428,"y":144.8,"type":"input","elementIndex":1,"connectionIndex":0},{"x":452,"y":144.8,"type":"output","elementIndex":1,"connectionIndex":1},{"x":320,"y":150,"type":"input","elementIndex":2,"connectionIndex":0},{"x":380,"y":150,"type":"output","elementIndex":2,"connectionIndex":1},{"x":220,"y":140,"type":"input","elementIndex":3,"connectionIndex":0},{"x":280,"y":140,"type":"output","elementIndex":3,"connectionIndex":1},{"x":100,"y":140,"type":"input","elementIndex":4,"connectionIndex":0},{"x":180,"y":140,"type":"output","elementIndex":4,"connectionIndex":1}],"viewport":{"offX":-429.94802066461517,"offY":-237.51270817811258,"scale":1.3891500000000003},"timestamp":"2026-04-19T14:23:19.813Z"}`,

  `{"name":"Pulsing LED","elements":[{"type":"Voltage Source","x":460,"y":240,"rotation":1,"showText":true},{"type":"Pulse Generator","x":700,"y":240,"rotation":3,"showText":true},{"type":"Button","x":580,"y":340,"rotation":0,"showText":true},{"type":"LED","x":580,"y":140,"rotation":2,"showText":true}],"wires":[{"isDiagonal":false,"end":{"type":"element","elementIndex":0,"connectionIndex":1},"start":{"type":"element","elementIndex":2,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":2,"connectionIndex":1},"start":{"type":"element","elementIndex":1,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":1,"connectionIndex":1},"start":{"type":"element","elementIndex":3,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":3,"connectionIndex":1},"start":{"type":"element","elementIndex":0,"connectionIndex":0}}],"connectionPoints":[{"x":460,"y":200,"type":"input","elementIndex":0,"connectionIndex":0},{"x":460,"y":280,"type":"output","elementIndex":0,"connectionIndex":1},{"x":700,"y":260,"type":"input","elementIndex":1,"connectionIndex":0},{"x":700,"y":220,"type":"output","elementIndex":1,"connectionIndex":1},{"x":560,"y":340,"type":"input","elementIndex":2,"connectionIndex":0},{"x":600,"y":340,"type":"output","elementIndex":2,"connectionIndex":1},{"x":590,"y":160,"type":"input","elementIndex":3,"connectionIndex":0},{"x":570,"y":160,"type":"output","elementIndex":3,"connectionIndex":1}],"viewport":{"offX":-812.5258750000002,"offY":-427.3028750000001,"scale":1.3891500000000003},"timestamp":"2026-04-19T14:30:10.496Z"}`,

  `{"name":"Capacitor Charge/Discharge Bulb","elements":[{"type":"Light Bulb","x":760,"y":280,"rotation":1,"showText":true},{"type":"Capacitor","x":660,"y":180,"rotation":0,"showText":true},{"type":"Switch","x":420,"y":300,"rotation":3,"showText":true},{"type":"Resistor","x":520,"y":180,"rotation":0,"showText":true},{"type":"Voltage Source","x":600,"y":400,"rotation":2,"showText":true}],"wires":[{"isDiagonal":false,"end":{"type":"element","element":{"type":"Capacitor","x":660,"y":180,"rotation":0,"showText":true},"elementIndex":1,"connectionIndex":1},"start":{"type":"element","elementIndex":0,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":0,"connectionIndex":1},"start":{"type":"element","element":{"type":"Voltage Source","x":600,"y":400,"rotation":2,"showText":true},"elementIndex":4,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","element":{"type":"Voltage Source","x":600,"y":400,"rotation":2,"showText":true},"elementIndex":4,"connectionIndex":1},"start":{"type":"element","element":{"type":"Switch","x":420,"y":300,"rotation":3,"showText":true},"elementIndex":2,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":2,"connectionIndex":1},"start":{"type":"element","elementIndex":3,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":3,"connectionIndex":1},"start":{"type":"element","elementIndex":1,"connectionIndex":0}}],"connectionPoints":[{"x":755.2,"y":268,"type":"input","elementIndex":0,"connectionIndex":0},{"x":755.2,"y":292,"type":"output","elementIndex":0,"connectionIndex":1},{"x":640,"y":170,"type":"input","elementIndex":1,"connectionIndex":0},{"x":700,"y":170,"type":"output","elementIndex":1,"connectionIndex":1},{"x":430,"y":320,"type":"input","elementIndex":2,"connectionIndex":0},{"x":430,"y":260,"type":"output","elementIndex":2,"connectionIndex":1},{"x":500,"y":170,"type":"input","elementIndex":3,"connectionIndex":0},{"x":560,"y":170,"type":"output","elementIndex":3,"connectionIndex":1},{"x":640,"y":400,"type":"input","elementIndex":4,"connectionIndex":0},{"x":560,"y":400,"type":"output","elementIndex":4,"connectionIndex":1}],"viewport":{"offX":-720,"offY":-389,"scale":1.2},"timestamp":"2026-04-19T14:39:28.484Z"}`,

  `{"name":"Binary Counter Display","elements":[{"type":"Binary Counter","x":420,"y":180,"rotation":3,"showText":true},{"type":"Display Decoder","x":540,"y":100,"rotation":0,"showText":true},{"type":"Segment Display","x":660,"y":160,"rotation":0,"showText":true},{"type":"Merger","x":780,"y":100,"rotation":0,"showText":false},{"type":"Merger","x":780,"y":140,"rotation":0,"showText":false},{"type":"Merger","x":780,"y":180,"rotation":0,"showText":false},{"type":"Merger","x":780,"y":220,"rotation":0,"showText":false},{"type":"Merger","x":840,"y":180,"rotation":0,"showText":false},{"type":"Merger","x":840,"y":140,"rotation":0,"showText":false},{"type":"Merger","x":900,"y":160,"rotation":0,"showText":false},{"type":"Ground","x":960,"y":180,"rotation":3,"showText":true},{"type":"Voltage Source","x":720,"y":300,"rotation":2,"showText":true},{"type":"Clock Generator","x":520,"y":240,"rotation":2,"showText":true},{"type":"Text","x":240,"y":320,"rotation":0,"showText":false,"textContent":"As A Ground"},{"type":"Text","x":240,"y":300,"rotation":0,"showText":false,"textContent":"This Input Is Acting"},{"type":"Arrow","x":400,"y":280,"rotation":0,"showText":false,"arrowEndOffset":{"x":1,"y":-2.5}}],"wires":[{"isDiagonal":false,"end":{"type":"element","element":{"type":"Clock Generator","x":520,"y":240,"rotation":2,"showText":true},"elementIndex":12,"connectionIndex":1},"start":{"type":"element","element":{"type":"Binary Counter","x":420,"y":180,"rotation":3,"showText":true},"elementIndex":0,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","element":{"type":"Binary Counter","x":420,"y":180,"rotation":3,"showText":true},"elementIndex":0,"connectionIndex":1},"start":{"type":"element","element":{"type":"Display Decoder","x":540,"y":100,"rotation":0,"showText":true},"elementIndex":1,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","element":{"type":"Binary Counter","x":420,"y":180,"rotation":3,"showText":true},"elementIndex":0,"connectionIndex":2},"start":{"type":"element","element":{"type":"Display Decoder","x":540,"y":100,"rotation":0,"showText":true},"elementIndex":1,"connectionIndex":1}},{"isDiagonal":false,"end":{"type":"element","element":{"type":"Display Decoder","x":540,"y":100,"rotation":0,"showText":true},"elementIndex":1,"connectionIndex":5},"start":{"type":"element","element":{"type":"Segment Display","x":660,"y":160,"rotation":0,"showText":true},"elementIndex":2,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","element":{"type":"Display Decoder","x":540,"y":100,"rotation":0,"showText":true},"elementIndex":1,"connectionIndex":6},"start":{"type":"element","element":{"type":"Segment Display","x":660,"y":160,"rotation":0,"showText":true},"elementIndex":2,"connectionIndex":1}},{"isDiagonal":false,"end":{"type":"element","element":{"type":"Display Decoder","x":540,"y":100,"rotation":0,"showText":true},"elementIndex":1,"connectionIndex":7},"start":{"type":"element","element":{"type":"Segment Display","x":660,"y":160,"rotation":0,"showText":true},"elementIndex":2,"connectionIndex":2}},{"isDiagonal":false,"end":{"type":"element","element":{"type":"Display Decoder","x":540,"y":100,"rotation":0,"showText":true},"elementIndex":1,"connectionIndex":8},"start":{"type":"element","element":{"type":"Segment Display","x":660,"y":160,"rotation":0,"showText":true},"elementIndex":2,"connectionIndex":3}},{"isDiagonal":false,"end":{"type":"element","element":{"type":"Display Decoder","x":540,"y":100,"rotation":0,"showText":true},"elementIndex":1,"connectionIndex":9},"start":{"type":"element","element":{"type":"Segment Display","x":660,"y":160,"rotation":0,"showText":true},"elementIndex":2,"connectionIndex":4}},{"isDiagonal":false,"end":{"type":"element","element":{"type":"Display Decoder","x":540,"y":100,"rotation":0,"showText":true},"elementIndex":1,"connectionIndex":10},"start":{"type":"element","element":{"type":"Segment Display","x":660,"y":160,"rotation":0,"showText":true},"elementIndex":2,"connectionIndex":5}},{"isDiagonal":false,"end":{"type":"element","element":{"type":"Display Decoder","x":540,"y":100,"rotation":0,"showText":true},"elementIndex":1,"connectionIndex":11},"start":{"type":"element","element":{"type":"Segment Display","x":660,"y":160,"rotation":0,"showText":true},"elementIndex":2,"connectionIndex":6}},{"isDiagonal":false,"start":{"type":"element","element":{"type":"Clock Generator","x":520,"y":240,"rotation":2,"showText":true},"elementIndex":12,"connectionIndex":0},"end":{"type":"element","element":{"type":"Voltage Source","x":720,"y":300,"rotation":2,"showText":true},"elementIndex":11,"connectionIndex":1}},{"isDiagonal":false,"end":{"type":"element","elementIndex":2,"connectionIndex":8},"start":{"type":"element","element":{"type":"Merger","x":780,"y":100,"rotation":0,"showText":false},"elementIndex":3,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":2,"connectionIndex":9},"start":{"type":"element","element":{"type":"Merger","x":780,"y":100,"rotation":0,"showText":false},"elementIndex":3,"connectionIndex":1}},{"isDiagonal":false,"end":{"type":"element","elementIndex":2,"connectionIndex":10},"start":{"type":"element","element":{"type":"Merger","x":780,"y":140,"rotation":0,"showText":false},"elementIndex":4,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":2,"connectionIndex":11},"start":{"type":"element","element":{"type":"Merger","x":780,"y":140,"rotation":0,"showText":false},"elementIndex":4,"connectionIndex":1}},{"isDiagonal":false,"end":{"type":"element","elementIndex":2,"connectionIndex":12},"start":{"type":"element","elementIndex":5,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":2,"connectionIndex":13},"start":{"type":"element","elementIndex":5,"connectionIndex":1}},{"isDiagonal":false,"end":{"type":"element","elementIndex":2,"connectionIndex":14},"start":{"type":"element","elementIndex":6,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":2,"connectionIndex":15},"start":{"type":"element","elementIndex":6,"connectionIndex":1}},{"isDiagonal":false,"end":{"type":"element","elementIndex":6,"connectionIndex":2},"start":{"type":"element","element":{"type":"Merger","x":840,"y":180,"rotation":0,"showText":false},"elementIndex":7,"connectionIndex":1}},{"isDiagonal":false,"end":{"type":"element","elementIndex":5,"connectionIndex":2},"start":{"type":"element","element":{"type":"Merger","x":840,"y":180,"rotation":0,"showText":false},"elementIndex":7,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":4,"connectionIndex":2},"start":{"type":"element","element":{"type":"Merger","x":840,"y":140,"rotation":0,"showText":false},"elementIndex":8,"connectionIndex":1}},{"isDiagonal":false,"end":{"type":"element","elementIndex":3,"connectionIndex":2},"start":{"type":"element","element":{"type":"Merger","x":840,"y":140,"rotation":0,"showText":false},"elementIndex":8,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":8,"connectionIndex":2},"start":{"type":"element","elementIndex":9,"connectionIndex":0}},{"isDiagonal":false,"end":{"type":"element","elementIndex":7,"connectionIndex":2},"start":{"type":"element","elementIndex":9,"connectionIndex":1}},{"isDiagonal":false,"end":{"type":"element","elementIndex":9,"connectionIndex":2},"start":{"type":"element","elementIndex":10,"connectionIndex":0}}],"connectionPoints":[{"x":420,"y":200,"type":"input","elementIndex":0,"connectionIndex":0},{"x":410,"y":160,"type":"output","elementIndex":0,"connectionIndex":1},{"x":430,"y":160,"type":"output","elementIndex":0,"connectionIndex":2},{"x":520,"y":70,"type":"input","elementIndex":1,"connectionIndex":0},{"x":520,"y":85,"type":"input","elementIndex":1,"connectionIndex":1},{"x":520,"y":100,"type":"input","elementIndex":1,"connectionIndex":2},{"x":520,"y":115,"type":"input","elementIndex":1,"connectionIndex":3},{"x":520,"y":130,"type":"input","elementIndex":1,"connectionIndex":4},{"x":560,"y":65,"type":"output","elementIndex":1,"connectionIndex":5},{"x":560,"y":75,"type":"output","elementIndex":1,"connectionIndex":6},{"x":560,"y":85,"type":"output","elementIndex":1,"connectionIndex":7},{"x":560,"y":95,"type":"output","elementIndex":1,"connectionIndex":8},{"x":560,"y":105,"type":"output","elementIndex":1,"connectionIndex":9},{"x":560,"y":115,"type":"output","elementIndex":1,"connectionIndex":10},{"x":560,"y":125,"type":"output","elementIndex":1,"connectionIndex":11},{"x":560,"y":135,"type":"output","elementIndex":1,"connectionIndex":12},{"x":640,"y":125,"type":"input","elementIndex":2,"connectionIndex":0},{"x":640,"y":135,"type":"input","elementIndex":2,"connectionIndex":1},{"x":640,"y":145,"type":"input","elementIndex":2,"connectionIndex":2},{"x":640,"y":155,"type":"input","elementIndex":2,"connectionIndex":3},{"x":640,"y":165,"type":"input","elementIndex":2,"connectionIndex":4},{"x":640,"y":175,"type":"input","elementIndex":2,"connectionIndex":5},{"x":640,"y":185,"type":"input","elementIndex":2,"connectionIndex":6},{"x":640,"y":195,"type":"input","elementIndex":2,"connectionIndex":7},{"x":700,"y":125,"type":"output","elementIndex":2,"connectionIndex":8},{"x":700,"y":135,"type":"output","elementIndex":2,"connectionIndex":9},{"x":700,"y":145,"type":"output","elementIndex":2,"connectionIndex":10},{"x":700,"y":155,"type":"output","elementIndex":2,"connectionIndex":11},{"x":700,"y":165,"type":"output","elementIndex":2,"connectionIndex":12},{"x":700,"y":175,"type":"output","elementIndex":2,"connectionIndex":13},{"x":700,"y":185,"type":"output","elementIndex":2,"connectionIndex":14},{"x":700,"y":195,"type":"output","elementIndex":2,"connectionIndex":15},{"x":760,"y":100,"type":"input","elementIndex":3,"connectionIndex":0},{"x":760,"y":120,"type":"input","elementIndex":3,"connectionIndex":1},{"x":800,"y":110,"type":"output","elementIndex":3,"connectionIndex":2},{"x":760,"y":140,"type":"input","elementIndex":4,"connectionIndex":0},{"x":760,"y":160,"type":"input","elementIndex":4,"connectionIndex":1},{"x":800,"y":150,"type":"output","elementIndex":4,"connectionIndex":2},{"x":760,"y":180,"type":"input","elementIndex":5,"connectionIndex":0},{"x":760,"y":200,"type":"input","elementIndex":5,"connectionIndex":1},{"x":800,"y":190,"type":"output","elementIndex":5,"connectionIndex":2},{"x":760,"y":220,"type":"input","elementIndex":6,"connectionIndex":0},{"x":760,"y":240,"type":"input","elementIndex":6,"connectionIndex":1},{"x":800,"y":230,"type":"output","elementIndex":6,"connectionIndex":2},{"x":820,"y":180,"type":"input","elementIndex":7,"connectionIndex":0},{"x":820,"y":200,"type":"input","elementIndex":7,"connectionIndex":1},{"x":860,"y":190,"type":"output","elementIndex":7,"connectionIndex":2},{"x":820,"y":140,"type":"input","elementIndex":8,"connectionIndex":0},{"x":820,"y":160,"type":"input","elementIndex":8,"connectionIndex":1},{"x":860,"y":150,"type":"output","elementIndex":8,"connectionIndex":2},{"x":880,"y":160,"type":"input","elementIndex":9,"connectionIndex":0},{"x":880,"y":180,"type":"input","elementIndex":9,"connectionIndex":1},{"x":920,"y":170,"type":"output","elementIndex":9,"connectionIndex":2},{"x":960,"y":180,"type":"input","elementIndex":10,"connectionIndex":0},{"x":760,"y":300,"type":"input","elementIndex":11,"connectionIndex":0},{"x":680,"y":300,"type":"output","elementIndex":11,"connectionIndex":1},{"x":540,"y":240,"type":"input","elementIndex":12,"connectionIndex":0},{"x":500,"y":240,"type":"output","elementIndex":12,"connectionIndex":1}],"viewport":{"offX":-784.6999999999999,"offY":-336.54999999999995,"scale":1.2599999999999998},"timestamp":"2026-04-19T15:36:49.244Z"}`
];





// TOP SECTION

// Edit Button Variables
const editBtn = document.querySelector(".edit-btn");
const dropdownContent = document.querySelector(".dropdown-content");

// Help Button Variables
const helpBtn = document.querySelector(".help-btn");
const helpContent = document.querySelector(".help-content");
const helpContentTitle = document.querySelector(".help-title");
const originalHelpText = document.getElementById("originalHelpText");
const exampleText = document.getElementById("exampleText");
const exampleBtn = document.querySelector(".example-btn");
let isExampleToggled = false;

// Edit Button
editBtn.addEventListener("click", () => {
  if (isStarted) return;
  const active = editBtn.classList.toggle("active");
  editBtn.classList.toggle("show", active);
  dropdownContent.classList.toggle("show");
  if (helpBtn.classList.contains("active")) {
    const active = helpBtn.classList.toggle("active");
    helpBtn.classList.toggle("show", active);
    helpContent.classList.toggle("show", active);
    if (!active && isExampleToggled) {
      isExampleToggled = false;
      helpContentTitle.textContent = "Help";
      originalHelpText.style.display = "block";
      exampleText.style.display = "none";
      exampleBtn.style.display = "block";
    }
  }
});

document.addEventListener("click", (e) => {
  if (editBtn.classList.contains("active") && !editBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
    const active = editBtn.classList.toggle("active");
    editBtn.classList.toggle("show", active);
    dropdownContent.classList.toggle("show");
  }
});

dropdownContent.addEventListener("click", () => {
  const active = editBtn.classList.toggle("active");
  editBtn.classList.toggle("show", active);
  dropdownContent.classList.toggle("show");
});

// Edit Buttons
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const clearBtn = document.getElementById("clearBtn");

clearBtn.addEventListener("click", () => {
  if (placedElements.length > 0) {
    saveStateToHistory();
    placedElements = [];
    wires = []
    redraw();
  }
});

// Help Button
exampleBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  isExampleToggled = !isExampleToggled;

  if (isExampleToggled) {
    helpContentTitle.textContent = "Examples";
    originalHelpText.style.display = "none";
    exampleText.style.display = "block";
    exampleBtn.style.display = "none";
  } else {
    helpContentTitle.textContent = "Help";
    originalHelpText.style.display = "block";
    exampleText.style.display = "none";
    exampleBtn.style.display = "block";
  }
});

helpBtn.addEventListener("click", () => {
  const active = helpBtn.classList.toggle("active");
  helpBtn.classList.toggle("show", active);
  helpContent.classList.toggle("show", active);
  if (!active && isExampleToggled) {
    isExampleToggled = false;
    helpContentTitle.textContent = "Help";
    originalHelpText.style.display = "block";
    exampleText.style.display = "none";
    exampleBtn.style.display = "block";
  }
});

// Undo And Redo Helpers
function saveStateToHistory() {
  const state = {
    elements: JSON.parse(JSON.stringify(placedElements)),
    wires: JSON.parse(JSON.stringify(wires))
  };

  const stateSize = calculateStateSize(state);

  // Exceeding Limit Deletes Old Undos / Redos
  while (currentHistorySize + stateSize > MAX_UNDO_HISTORY_SIZE && undoStack.length > 0) {
    const oldestState = undoStack.shift();
    currentHistorySize -= calculateStateSize(oldestState);
  }

  // Save State
  undoStack.push(state);
  currentHistorySize += stateSize;

  redoStack = [];
  updateUndoRedoButtons();
}

function calculateStateSize(elements) {
  // Estimate Size
  return JSON.stringify(elements).length;
}

// Example Projects Loading
function loadProjectFromText(text) {
  try {
    const projectData = JSON.parse(text);

    if (!projectData.elements || !Array.isArray(projectData.elements)) {
      throw new Error("Invalid format");
    }

    saveStateToHistory();

    placedElements = projectData.elements;
    wires = projectData.wires || [];
    connectionPoints = projectData.connectionPoints || [];

    if (projectData.viewport) {
      offsetX = projectData.viewport.offX + window.innerWidth / 2;
      offsetY = projectData.viewport.offY + window.innerHeight / 2;
      scale = projectData.viewport.scale;
    }

    if (projectData.name) {
      document.getElementById("projectName").value = projectData.name;
    }

    redraw();
  } catch (e) {
    alert("Example project failed to load.");
  }
}

document.querySelectorAll(".example-project").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    loadProjectFromText(exampleProjects[index]);
  });
});

// Save Functionality
function saveProject() {
  const projectName = document.getElementById("projectName").value.trim();

  if (!projectName) {
    alert("Please enter a project name before saving.");
    return;
  }

  if (placedElements.length === 0) {
    alert("Your project is empty. Add some elements before saving.");
    return;
  }

  const offX = offsetX - window.innerWidth/2;
  const offY = offsetY - window.innerHeight/2;

  // Project Data
  const projectData = {
    name: projectName,
    elements: placedElements,
    wires: wires,
    connectionPoints: connectionPoints,
    viewport: {
      offX,
      offY,
      scale
    },
    timestamp: new Date().toISOString()
  };
  const jsonData = JSON.stringify(projectData);

  // Create Blob And Download Link
  const blob = new Blob([jsonData], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${projectName}.circuit`;
  document.body.appendChild(a);
  a.click();

  // Clean Up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

// Load Functionality
function loadProject(file) {
  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const projectData = JSON.parse(e.target.result);

      // Invalid File Format Check
      if (!projectData.elements || !Array.isArray(projectData.elements)) {
        throw new Error("Invalid file format.");
      }

      saveStateToHistory();

      // Restore
      placedElements = projectData.elements;
      wires = projectData.wires || [];
      connectionPoints = projectData.connectionPoints || [];

      if (projectData.viewport) {
        offsetX = projectData.viewport.offX + window.innerWidth/2;
        offsetY = projectData.viewport.offY + window.innerHeight/2;
        scale = projectData.viewport.scale;
      }

      if (projectData.name) {
        document.getElementById("projectName").value = projectData.name;
      }

      redraw();
    } catch (error) {
      alert("This file is not in the correct format. Please select a valid Circuit Craft project file.");
    }
  };

  reader.onerror = function() {
    alert("Error reading file.");
  };

  reader.readAsText(file);
}

// Handle File Input
function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.name.endsWith(".circuit") && !file.name.endsWith(".circuit.json")) {
    alert("Please select a valid Circuit Craft project file (.circuit).");
    return;
  }

  loadProject(file);

  e.target.value = "";
}

// Create Hidden File Input
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = ".circuit";
fileInput.style.display = "none";
document.body.appendChild(fileInput);
fileInput.addEventListener("change", handleFileSelect);

// Save And Load Buttons
const saveBtn = document.querySelector(".save-btn");
const loadBtn = document.querySelector(".load-btn");

saveBtn.addEventListener("click", saveProject);

loadBtn.addEventListener("click", () => {
  fileInput.click();
});





// CANVAS SECTION

// WIRES SUB-SECTION

// Get Connection Points Of An Element
function getElementConnectionPoints(element) {
  const elementId = getElementTypeId(element.type);
  const points = elementConnectionPoints[elementId] || [];
  const size = CANVAS_ELEMENT_SIZE;
  const rotation = element.rotation || 0;

  const rotationOffsets = elementRotationOffset[elementId];
  const rotationOffset = (rotationOffsets && rotation > 0) ? rotationOffsets[rotation - 1] || {x: 0, y: 0} : {x: 0, y: 0};

  return points.map((point, index) => {
    const rotationRadians = (rotation * 90) * Math.PI / 180;
    const cosAngle = Math.cos(rotationRadians);
    const sinAngle = Math.sin(rotationRadians);

    const rotatedX = point.x * cosAngle - point.y * sinAngle;
    const rotatedY = point.x * sinAngle + point.y * cosAngle;

    const offsetX = rotatedX + (rotationOffset.x / size);
    const offsetY = rotatedY + (rotationOffset.y / size);

    return {
      x: element.x + offsetX * size,
      y: element.y + offsetY * size,
      type: point.type,
      elementIndex: -1,
      connectionIndex: index
    };
  });
}

// Update All Conection Points
function updateConnectionPoints() {
  connectionPoints = [];
  placedElements.forEach((element, index) => {
    const points = getElementConnectionPoints(element);

    points.forEach(point => {
      point.elementIndex = index;
    });
    connectionPoints.push(...points);
  });
}

// Find Connection Point
function findConnectionPointAt(x, y, radius = 8) {
  return connectionPoints.find(point => {
    const dx = point.x - x;
    const dy = point.y - y;
    return Math.sqrt(dx * dx + dy * dy) <= radius;
  });
}

// Snap To 45°
function snapAngle(dx, dy) {
  const angle = Math.atan2(dy, dx);
  const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
  return snapAngle;
}

// Snap Wire For Angle And Length
function snapWireEnd(startX, startY, endX, endY, isDiagonal) {
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const gridSize = 20;

  const angle = Math.atan2(dy, dx);
  let angleDeg = (angle * 180 / Math.PI + 450) % 360;
  const nearest45 = Math.round(angleDeg / 45) * 45;
  if (nearest45 % 90 !== 0) {
    const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4); // Snap to nearest 45°
    const snappedDistance = Math.round(distance / (gridSize * Math.SQRT2)) * (gridSize * Math.SQRT2);

    return {
      x: startX + Math.cos(snapAngle) * snappedDistance,
      y: startY + Math.sin(snapAngle) * snappedDistance
    };
  } else {
    if (Math.abs(dx) > Math.abs(dy)) {
      const snappedDistance = Math.round(Math.abs(dx) / gridSize) * gridSize;
      return {
        x: startX + (dx > 0 ? snappedDistance : -snappedDistance),
        y: startY
      };
    } else {
      const snappedDistance = Math.round(Math.abs(dy) / gridSize) * gridSize;
      return {
        x: startX,
        y: startY + (dy > 0 ? snappedDistance : -snappedDistance)
      };
    }
  }
}

// Draw Connection Points
function drawConnectionPoints() {
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  
  connectionPoints.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4.25, 0, Math.PI * 2);
    if (point.type === "input") {
      ctx.fillStyle = "#8f9da8";
    } else {
      ctx.fillStyle = "#a89c85";
    }
    ctx.fill();
    if (point.type === "input") {
      ctx.strokeStyle = "#2f3940";
    } else {
      ctx.strokeStyle = "#4d453a";
    }
    ctx.lineWidth = 1.75;
    ctx.stroke();
  });
  
  ctx.restore();
}

// Draw Wires
function drawWires() {
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

  wires.forEach((wire, index) => {
    const coords = getWireCoordinates(wire);
    if (!coords) return;

    const isDashedWire = false;

    ctx.beginPath();
    ctx.moveTo(coords.startX, coords.startY);
    ctx.lineTo(coords.endX, coords.endY);
    ctx.strokeStyle = isDashedWire ? "#888888" : "#444444";
    ctx.lineWidth = 3;

    if (isDashedWire) {
      ctx.setLineDash([8, 4]);
    }

    ctx.stroke();
    ctx.setLineDash([]);

    if (wire.start.type === "canvas" || wire.start.type === "wire") {
      ctx.beginPath();
      ctx.arc(coords.startX, coords.startY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#666666";
      ctx.fill();
    }

    if (wire.end.type === "canvas" || wire.end.type === "wire") {
      ctx.beginPath();
      ctx.arc(coords.endX, coords.endY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#666666";
      ctx.fill();
    }
  });

  // Draw Wires Being Dragged
  if (isDraggingWire && currentWire) {
    ctx.beginPath();
    ctx.moveTo(currentWire.startX, currentWire.startY);
    ctx.lineTo(currentWire.endX, currentWire.endY);
    ctx.strokeStyle = isWireConnecting ? "#888888" : "#666666";
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  ctx.restore();
}

// Get Wire Coordinates
function getWireCoordinates(wire, visited = new Set()) {
  const wireId = `${JSON.stringify(wire.start)}-${JSON.stringify(wire.end)}`;

  if (visited.has(wireId)) {
    console.warn("Circular reference detected in wire connections");
    return null;
  }

  visited.add(wireId);

  let startX, startY, endX, endY;

  // Get start coordinates
  if (wire.start.type === "element") {
    const element = placedElements[wire.start.elementIndex];
    if (!element) return null;

    const points = getElementConnectionPoints(element);
    const point = points[wire.start.connectionIndex];
    if (!point) return null;

    startX = point.x;
    startY = point.y;
  } else if (wire.start.type === "canvas") {
    startX = wire.start.x;
    startY = wire.start.y;
  } else if (wire.start.type === "wire") {
    const sourceWire = wires[wire.start.wireIndex];
    if (!sourceWire) return null;

    // Recursive call with visited set to detect cycles
    const sourceCoords = getWireCoordinates(sourceWire, new Set([...visited]));
    if (!sourceCoords) return null;

    if (wire.start.wirePoint === "start") {
      startX = sourceCoords.startX;
      startY = sourceCoords.startY;
    } else {
      startX = sourceCoords.endX;
      startY = sourceCoords.endY;
    }
  } else {
    return null;
  }

  // Get end coordinates
  if (wire.end.type === "element") {
    const element = placedElements[wire.end.elementIndex];
    if (!element) return null;
    
    const points = getElementConnectionPoints(element);
    const point = points[wire.end.connectionIndex];
    if (!point) return null;
    
    endX = point.x;
    endY = point.y;
  } else if (wire.end.type === "canvas") {
    endX = startX + wire.end.xOffset;
    endY = startY + wire.end.yOffset;
  } else if (wire.end.type === "wire") {
    const sourceWire = wires[wire.end.wireIndex];
    if (!sourceWire) return null;
    
    // Recursive call with visited set to detect cycles
    const sourceCoords = getWireCoordinates(sourceWire, new Set([...visited]));
    if (!sourceCoords) return null;
    
    if (wire.end.wirePoint === "start") {
      endX = sourceCoords.startX;
      endY = sourceCoords.startY;
    } else {
      endX = sourceCoords.endX;
      endY = sourceCoords.endY;
    }
  } else {
    return null;
  }
  
  return { startX, startY, endX, endY };
}

// Check If A Point Is Connected
function isPointConnected(elementIndex, connectionIndex, pointType) {
  if (elementIndex === undefined || elementIndex === -1) return false;

  return wires.some(wire => {
    if (pointType === "input") {
      return wire.start.type === "element" && 
        wire.start.elementIndex === elementIndex && 
        wire.start.connectionIndex === connectionIndex;
    } else {
      return wire.end.type === "element" && 
        wire.end.elementIndex === elementIndex && 
        wire.end.connectionIndex === connectionIndex;
    }
  });
}

// Find Connection Point
function findConnectionPointWithIndex(x, y, radius = 8) {
  for (let i = 0; i < placedElements.length; i++) {
    const element = placedElements[i];
    const points = getElementConnectionPoints(element);

    for (let j = 0; j < points.length; j++) {
      const point = points[j];
      const dx = point.x - x;
      const dy = point.y - y;

      if (Math.sqrt(dx * dx + dy * dy) <= radius) {
        return {
          elementIndex: i,
          connectionIndex: j,
          type: point.type,
          x: point.x,
          y: point.y
        };
      }
    }
  }
  return null;
}

// Find A Wire Point At A Position
function findWirePointAt(x, y, radius = 8) {
  for (let i = 0; i < wires.length; i++) {
    const wire = wires[i];
    const coords = getWireCoordinates(wire);
    if (!coords) continue;

    if (wire.start.type !== "element") {
      const dx = coords.startX - x;
      const dy = coords.startY - y;
      if (Math.sqrt(dx * dx + dy * dy) <= radius) {
        return { wireIndex: i, pointType: "start", x: coords.startX, y: coords.startY };
      }
    }

    if (wire.end.type !== "element") {
      const dx = coords.endX - x;
      const dy = coords.endY - y;
      if (Math.sqrt(dx * dx + dy * dy) <= radius) {
        return { wireIndex: i, pointType: "end", x: coords.endX, y: coords.endY };
      }
    }
  }
  return null;
}

// Find A Wire At A Position
function findWireAt(x, y, tolerance = 5) {
  for (let i = wires.length - 1; i >= 0; i--) {
    const wire = wires[i];
    const coords = getWireCoordinates(wire);
    if (!coords) continue;

    const { startX, startY, endX, endY } = coords;

    const A = x - startX;
    const B = y - startY;
    const C = endX - startX;
    const D = endY - startY;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
      xx = startX;
      yy = startY;
    } else if (param > 1) {
      xx = endX;
      yy = endY;
    } else {
      xx = startX + param * C;
      yy = startY + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= tolerance) {
      return i;
    }
  }
  return -1;
}





// OTHER SUB-SECTION

// Get The Hitbox Of An Element
function getElementHitbox(elementTypeId) {
  return elementHitboxes[elementTypeId] || elementHitboxes.default;
}

// Resize Canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - document.querySelector(".topbar").offsetHeight;

  overlayCanvas.width = window.innerWidth;
  overlayCanvas.height = window.innerHeight;

  redraw();
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Draw Grid
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

  ctx.strokeStyle = "rgb(218, 218, 218)";
  ctx.lineWidth = 1 / scale;
  const gridSize = 20;

  const startX = -offsetX / scale;
  const startY = -offsetY / scale;
  const endX = startX + canvas.width / scale;
  const endY = startY + canvas.height / scale;

  const firstX = Math.floor(startX / gridSize) * gridSize;
  const firstY = Math.floor(startY / gridSize) * gridSize;

  for (let x = firstX; x < endX; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, startY);
    ctx.lineTo(x, endY);
    ctx.stroke();
  }
  for (let y = firstY; y < endY; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);
    ctx.stroke();
  }

  ctx.restore();
}

// Redraw
function redraw() {
  drawGrid();
  updateConnectionPoints();

  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

  placedElements.forEach(el => {
    const elementId = getElementTypeId(el.type);
    const rotation = el.rotation;

    const rotationOffsets = elementRotationOffset[elementId];
    const rotationOffset = rotationOffsets ? rotationOffsets[rotation - 1] || {x: 0, y: 0} : {x: 0, y: 0};

    drawCircuitElement(ctx, el.x + rotationOffset.x, el.y + rotationOffset.y, CANVAS_ELEMENT_SIZE, elementId, rotation, el.arrowEndOffset, el);
  });

  ctx.restore();

  drawWires();
  drawConnectionPoints();

  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

  placedElements.forEach(el => {
    if (el.showText !== false) {
      const elementId = getElementTypeId(el.type);
      const rotation = el.rotation;

      ctx.fillStyle = "black";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.strokeStyle = "#F2F2F2";
      ctx.lineWidth = 4;
      ctx.lineJoin = "round";

      const offset = elementOffset[elementId];
      const textHeightOffset = elementTextHeight[elementId];

      const rotationTextOffsets = rotationTextHeight[elementId];
      const rotationTextOffset = rotationTextOffsets ? rotationTextOffsets[rotation - 1] || 0 : 0;

      const xPos = el.x - offset.x * 1.75;
      const yPos = el.y + 33 - textHeightOffset - rotationTextOffset;

      ctx.strokeText(el.type, xPos, yPos);
      ctx.fillText(el.type, xPos, yPos);
    }
  });

  ctx.restore();
}

redraw();

// Draw The Circuit Pieces
function drawCircuitElement(ctx, x, y, size, elementType, rotation = 1, arrowEndOffset = null) {
  const lineWidth = size / 20;
  const styles = elementStyles[elementType];

  ctx.save();

  // Apply Rotation
  if (rotation > 0) {
    ctx.translate(x, y);
    ctx.rotate((rotation * 90) * Math.PI / 180);
    ctx.translate(-x, -y);
  }

  styles.forEach(style => {
    ctx.lineWidth = style.wline ? lineWidth * style.wline : lineWidth;

    // Shape Values
    if (style.fill) ctx.fillStyle = style.fill;
    if (style.stroke) ctx.strokeStyle = style.stroke;

    const width = style.width ? style.width * size : 0;
    const height = style.height ? style.height * size : 0;
    const radius = style.radius ? style.radius * size : 0;

    const corners = style.corners ? style.corners : 1111;

    const text = style.text ? style.text : "";
    const fontSize = style.size ? style.size * size / 46 : 10;
    const leftAlign = style.leftAlign ? style.leftAlign : false;

    // Shape X And Y
    const points = [];
      let i = 1;
      while (true) {
        const currentXProp = (i === 1) ? "x" : `x${i}`;
        const currentYProp = (i === 1) ? "y" : `y${i}`;

        if (style[currentXProp] !== undefined && style[currentYProp] !== undefined) {
          let pointX = x + style[currentXProp] * size;
          let pointY = y + style[currentYProp] * size;

          if (elementType === 40 && arrowEndOffset) {
            if (i === 2 && style.type === "lines" && !style.x3) {
              pointX = x + (-0.25 * size) + (arrowEndOffset.x * 20);
              pointY = y + (-0.25 * size) + (arrowEndOffset.y * 20);
            }
            else if (style.type === "lines" && style.x3) {
              const endX = x + (-0.25 * size) + (arrowEndOffset.x * 20);
              const endY = y + (-0.25 * size) + (arrowEndOffset.y * 20);

              if (i === 1) {
                const dx = endX - (x + (-0.25 * size));
                const dy = endY - (y + (-0.25 * size));
                const angle = Math.atan2(dy, dx);
                const arrowLength = 0.4 * size;
                const arrowAngle = Math.PI / 6;

                pointX = endX - arrowLength * Math.cos(angle - arrowAngle);
                pointY = endY - arrowLength * Math.sin(angle - arrowAngle);
              } else if (i === 2) {
                pointX = endX;
                pointY = endY;
              } else if (i === 3) {
                const dx = endX - (x + (-0.25 * size));
                const dy = endY - (y + (-0.25 * size));
                const angle = Math.atan2(dy, dx);
                const arrowLength = 0.4 * size;
                const arrowAngle = Math.PI / 6;

                pointX = endX - arrowLength * Math.cos(angle + arrowAngle);
                pointY = endY - arrowLength * Math.sin(angle + arrowAngle);
              }
            }
          }

          points.push({ x: pointX, y: pointY });
          i++;
        } else {
          break;
        }
      }

    ctx.beginPath();

    // Shapes For Styles
    switch (style.type) {
      case "rect":
        ctx.rect(points[0].x - width / 2, points[0].y - height / 2, width, height);
        break;

      case "roundrect":
        const rectX = points[0].x - width / 2;
        const rectY = points[0].y - height / 2;

        const cornersStr = corners.toString().padStart(4, "0");
        const [topLeft, topRight, bottomRight, bottomLeft] = cornersStr.split("").map(c => c === "1");

        ctx.moveTo(rectX + (topLeft ? radius : 0), rectY);

        ctx.lineTo(rectX + width - (topRight ? radius : 0), rectY);
        if (topRight) {
          ctx.quadraticCurveTo(rectX + width, rectY, rectX + width, rectY + radius);
        }

        ctx.lineTo(rectX + width, rectY + height - (bottomRight ? radius : 0));
        if (bottomRight) {
          ctx.quadraticCurveTo(rectX + width, rectY + height, rectX + width - radius, rectY + height);
        }

        ctx.lineTo(rectX + (bottomLeft ? radius : 0), rectY + height);
        if (bottomLeft) {
          ctx.quadraticCurveTo(rectX, rectY + height, rectX, rectY + height - radius);
        }

        ctx.lineTo(rectX, rectY + (topLeft ? radius : 0));
        if (topLeft) {
          ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
        }

        ctx.closePath();
        break;

      case "circle":
        ctx.arc(points[0].x, points[0].y, radius, 0, Math.PI * 2);
        break;

      case "polygon":
        if (points.length > 2) {
          ctx.moveTo(points[0].x, points[0].y);
          for (let j = 1; j < points.length; j++) {
            ctx.lineTo(points[j].x, points[j].y);
          }
          ctx.closePath();
        }
        break;

      case "lines":
        ctx.moveTo(points[0].x, points[0].y);
        for (let j = 1; j < points.length; j++) {
          ctx.lineTo(points[j].x, points[j].y);
        }
        break;

      case "curve":
        const c = style.c ? style.c * size : 0;

        const p0 = points[0];
        const p1 = points[1];

        const mx = (p0.x + p1.x) / 2;
        const my = (p0.y + p1.y) / 2;

        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;

        const length = Math.sqrt(dx * dx + dy * dy);
        const perpX = -dy / length;
        const perpY = dx / length;

        const cx = mx + perpX * c;
        const cy = my + perpY * c;

        ctx.moveTo(p0.x, p0.y);
        ctx.quadraticCurveTo(cx, cy, p1.x, p1.y);
        break;

        case "text":
          ctx.font = `${fontSize}px Arial`;
          if (leftAlign) {
            ctx.textAlign = "left";
          } else {
            ctx.textAlign = "center";
          }
          ctx.textBaseline = "middle";

          let displayText = text;
          if (elementType === 39 && arguments[7] && arguments[7].textContent) {
            displayText = arguments[7].textContent;
          }

          if (style.stroke && c > 0) {
            ctx.lineWidth = c;
            ctx.strokeText(displayText, points[0].x, points[0].y);
          }

          if (style.fill) {
            ctx.fillText(displayText, points[0].x, points[0].y);
          }
          break;
    }

    if (style.type !== "text") {
      if (style.fill) ctx.fill();
      if (style.stroke) ctx.stroke();
    }
  });
  ctx.restore();
}

// Get Element Id From Name
function getElementTypeId(typeName) {
  const elementMap = {
    "Voltage Source": 0,
    "Current Source": 1,
    "AC Voltage Source": 2,
    "AC Current Source": 3,
    "Ground": 4,
    "Switch": 5,
    "Button": 6,
    "Clock Generator": 7,
    "Pulse Generator": 8,
    "Transistor": 9,
    "Diode": 10,
    "Resistor": 11,
    "Fuse": 12,
    "Capacitor": 13,
    "Inductor": 14,
    "LED": 15,
    "Light Bulb": 16,
    "Buzzer": 17,
    "Segment Display": 18,
    "Merger": 19,
    "Splitter": 20,
    "And": 21,
    "Or": 22,
    "Nand": 23,
    "Nor": 24,
    "Xor": 25,
    "Xnor": 26,
    "Not": 27,
    "D Flip-Flop": 28,
    "T Flip-Flop": 29,
    "SR Flip-Flop": 30,
    "JK Flip-Flop": 31,
    "SR Latch": 32,
    "Binary Counter": 33,
    "Mux": 34,
    "Demux": 35,
    "Encoder": 36,
    "Decoder": 37,
    "Display Decoder": 38,
    "Text": 39,
    "Arrow": 40
  };

  return elementMap[typeName];
}

// Draw Pieces On All Canvases (except the overlay canvas)
function drawAllPieceCanvases() {
  const pieceCanvases = document.querySelectorAll(".piece-canvas");
  pieceCanvases.forEach((canvas) => {
    canvas.width = 60;
    canvas.height = 60;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get The Piece Type
    const pieceElement = canvas.closest(".piece");
    if (pieceElement) {
      const pieceTextElement = pieceElement.querySelector(".piece-text");
      if (pieceTextElement) {
        const pieceType = pieceTextElement.textContent;
        const elementId = getElementTypeId(pieceType);
        const offset = elementOffset[elementId] || {x: 0, y: 0};

        drawCircuitElement(ctx, canvas.width/2 + offset.x, canvas.height/2 + offset.y, 24, getElementTypeId(pieceType), 0);
      }
    }
  });
}
drawAllPieceCanvases();

// Get Canvas Pos
function getCanvasPos(clientX, clientY) {
  const topBarHeight = document.querySelector(".topbar").offsetHeight;

  return {
    x: (clientX - offsetX) / scale,
    y: (clientY - offsetY - topBarHeight) / scale
  };
}

// Snap To Grid
function snapToGrid(x, y) {
  const gridSize = 20;
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize
  };
}

// Piece Selection
function handlePieceSelection(e) {
  if (isStarted) return;
  
  const pieceCanvas = e.target.closest(".piece-canvas");
  if (!pieceCanvas) return;
  
  const pieceType = pieceCanvas.closest(".piece").querySelector(".piece-text").textContent;

  const elementId = getElementTypeId(pieceType);
  const offset = elementOffset[elementId] || {x: 0, y: 0};

  // Create A New Circuit Piece To Drag
  currentElement = {
    type: pieceType,
    x: e.clientX + offset.x * 2.5 || e.touches[0].clientX,
    y: e.clientY + offset.y * 2.5 || e.touches[0].clientY,
    width: OVERLAY_ELEMENT_SIZE,
    height: OVERLAY_ELEMENT_SIZE,
    isExisting: false
  };

  // Center Drag
  dragOffset = {
    x: ((e.clientX || e.touches[0].clientX) - currentElement.x) * scale,
    y: ((e.clientY || e.touches[0].clientY) - currentElement.y) * scale
  };

  isDraggingElement = true;
  document.body.style.cursor = "grabbing";
  canvas.style.cursor = "grabbing";
  drawOverlay();
}

// Draw On Overlay Canvas
function drawOverlay() {
  overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  if (isDraggingElement && currentElement) {
    const sizeToDraw = currentElement.displaySize;
    const rotation = currentElement.rotation || 0;
    const elementId = getElementTypeId(currentElement.type);

    const rotationOffsets = elementRotationOffset[elementId];
    const rotationOffset = rotationOffsets ? rotationOffsets[rotation - 1] || {x: 0, y: 0} : {x: 0, y: 0};

    const scaleRatio = sizeToDraw / CANVAS_ELEMENT_SIZE;
    const arrowHeadOffset = currentElement.arrowEndOffset ? {x: currentElement.arrowEndOffset.x * scaleRatio, y: currentElement.arrowEndOffset.y * scaleRatio} : null;

    drawCircuitElement(overlayCtx, currentElement.x + rotationOffset.x, currentElement.y + rotationOffset.y, sizeToDraw, getElementTypeId(currentElement.type), rotation, arrowHeadOffset, currentElement);
  }
}

// Handle Dropping
function handleDrop(clientX, clientY) {
  if (!isDraggingElement || !currentElement) return;

  const bottomBar = document.querySelector(".bottom-left");
  const canvas = document.getElementById("circuitCanvas");

  const bottomBarRect = bottomBar.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();

  if (
    clientX >= canvasRect.left &&
    clientX <= canvasRect.right &&
    clientY >= canvasRect.top + 35 &&
    clientY <= canvasRect.bottom &&
    clientY <= bottomBarRect.top + 10
  ) {
    // Convert To Canvas
    const canvasPos = getCanvasPos(clientX, clientY);
    const snappedPos = snapToGrid(canvasPos.x, canvasPos.y);

    addElementToCanvas(currentElement.type, snappedPos.x, snappedPos.y);
  } else {
    // Delete wires since element isn't added back
    if (currentElement.draggedFromCanvas) {
      removeWiresConnectedToElement(currentElement.draggedElementIndex);

      // Fix indices
      wires.forEach(wire => {
        if (wire.start?.type === "element" && wire.start.elementIndex > currentElement.draggedElementIndex) {
          wire.start.elementIndex--;
        }
        if (wire.end?.type === "element" && wire.end.elementIndex > currentElement.draggedElementIndex) {
          wire.end.elementIndex--;
        }
      });
      
      redraw();
    }
  }

  isDraggingElement = false;
  currentElement = null;
  drawOverlay();
}

// Add Element To Main Canvas
function addElementToCanvas(type, x, y) {
  if (!currentElement.isExisting) {
    saveStateToHistory();
  }

  const elementId = getElementTypeId(type);
  const isText = elementId === 39;
  const isArrow = elementId === 40;

  let defaultShowText = true;
  if (isText || isArrow) {
    defaultShowText = false;
  }

  const newElement = {
    type,
    x,
    y,
    rotation: currentElement.rotation || 0,
    showText: currentElement.showText !== undefined ? currentElement.showText : defaultShowText
  };

  if (isText) {
    newElement.textContent = currentElement.textContent || "";
  }

  if (isArrow) {
    newElement.arrowEndOffset = currentElement.arrowEndOffset || { x: 2, y: 0 };
  }

  placedElements.push(newElement);

  // Reconnect wires if this was an existing element
  if (currentElement.isExisting && draggedElementConnections.length > 0) {
    const newElementIndex = placedElements.length - 1;

    draggedElementConnections.forEach(connection => {
      const wire = wires[connection.wireIndex];
      if (!wire) return;

      if (connection.pointType === "start") {
        wire.start = {
          type: "element",
          element: newElement,
          elementIndex: newElementIndex,
          connectionIndex: connection.connectionIndex
        };
      } else {
        wire.end = {
          type: "element",
          element: newElement,
          elementIndex: newElementIndex,
          connectionIndex: connection.connectionIndex
        };
      }
    });

    draggedElementConnections = [];
  }

  redraw();
}

// Update Wires When Elements Change (for undo/redo)
function updateWiresForElementChanges(oldElements, newElements) {
  const elementMapping = new Map();

  for (let oldIndex = 0; oldIndex < oldElements.length; oldIndex++) {
    const oldEl = oldElements[oldIndex];
    let foundMatch = false;

    for (let newIndex = 0; newIndex < newElements.length; newIndex++) {
      const newEl = newElements[newIndex];

      // Check if elements match
      if (oldEl.type === newEl.type &&
          Math.abs(oldEl.x - newEl.x) < 1 &&
          Math.abs(oldEl.y - newEl.y) < 1 &&
          (oldEl.rotation || 0) === (newEl.rotation || 0)) {
        elementMapping.set(oldIndex, newIndex);
        foundMatch = true;
        break;
      }
    }

    if (!foundMatch) {
      elementMapping.set(oldIndex, -1);
    }
  }

  const mappedNewIndices = new Set(elementMapping.values());
  for (let newIndex = 0; newIndex < newElements.length; newIndex++) {
    if (!mappedNewIndices.has(newIndex)) {
      // Newly added element
      elementMapping.set(-1 - newIndex, newIndex);
    }
  }

  // Update all wires
  for (let i = wires.length - 1; i >= 0; i--) {
    const wire = wires[i];

    // Wire start point
    if (wire.start.type === "element") {
      const oldIndex = wire.start.elementIndex;
      const newIndex = elementMapping.get(oldIndex);
      
      if (newIndex === undefined || newIndex === -1) {
        // Element was deleted
        const coords = getWireCoordinates(wire);
        if (coords) {
          wire.start = {
            type: "canvas",
            x: coords.startX,
            y: coords.startY
          };
        }
      } else {
        wire.start.elementIndex = newIndex;
      }
    }

    // Wire end point
    if (wire.end.type === "element") {
      const oldIndex = wire.end.elementIndex;
      const newIndex = elementMapping.get(oldIndex);

      if (newIndex === undefined || newIndex === -1) {
        // Element was deleted
        const coords = getWireCoordinates(wire);
        if (coords) {
          const startCoords = getWireCoordinates({ 
            start: wire.start, 
            end: { type: "canvas", xOffset: 0, yOffset: 0 } 
          });
          if (startCoords) {
            wire.end = {
              type: "canvas",
              xOffset: coords.endX - startCoords.startX,
              yOffset: coords.endY - startCoords.startY
            };
          }
        }
      } else {
        wire.end.elementIndex = newIndex;
      }
    }
  }
}

// Remove Wires On Deleted Element
function removeWiresConnectedToElement(elementIndex) {
  // Create a list of wire indices to remove
  const wiresToRemove = [];

  for (let i = 0; i < wires.length; i++) {
    const wire = wires[i];
    const startIsElement =
      wire.start?.type === "element" &&
      wire.start.elementIndex === elementIndex;

    const endIsElement =
      wire.end?.type === "element" &&
      wire.end.elementIndex === elementIndex;

    if (startIsElement || endIsElement) {
      wiresToRemove.push(i);
    }
  }

  // Remove wires in reverse order
  for (let i = wiresToRemove.length - 1; i >= 0; i--) {
    wires.splice(wiresToRemove[i], 1);
  }

  // Clean up wire-to-wire connections
  for (let i = wires.length - 1; i >= 0; i--) {
    const wire = wires[i];

    // Check start connection
    if (wire.start?.type === "wire") {
      let removedBeforeCount = 0;
      for (const removedIndex of wiresToRemove) {
        if (removedIndex < wire.start.wireIndex) {
          removedBeforeCount++;
        } else if (removedIndex === wire.start.wireIndex) {
          const coords = getWireCoordinates(wire);
          if (coords) {
            wire.start = {
              type: "canvas",
              x: coords.startX,
              y: coords.startY
            };
          }
          break;
        }
      }
      if (wire.start.type === "wire" && wire.start.wireIndex >= wiresToRemove.length) {
        wire.start.wireIndex -= removedBeforeCount;
      }
    }

    // Check end connection
    if (wire.end?.type === "wire") {
      let removedBeforeCount = 0;
      for (const removedIndex of wiresToRemove) {
        if (removedIndex < wire.end.wireIndex) {
          removedBeforeCount++;
        } else if (removedIndex === wire.end.wireIndex) {
          const coords = getWireCoordinates(wire);
          if (coords) {
            wire.end = {
              type: "canvas",
              xOffset: coords.endX - coords.startX,
              yOffset: coords.endY - coords.startY
            };
          }
          break;
        }
      }
      if (wire.end.type === "wire" && wire.end.wireIndex >= wiresToRemove.length) {
        wire.end.wireIndex -= removedBeforeCount;
      }
    }
  }
}

// Undo
function undo() {
  if (undoStack.length === 0) return;

  // Save current state to redo stack
  const currentState = {
    elements: JSON.parse(JSON.stringify(placedElements)),
    wires: JSON.parse(JSON.stringify(wires))
  };
  redoStack.push(currentState);

  // Get previous state
  const previousState = undoStack.pop();
  currentHistorySize -= calculateStateSize(previousState);

  // Restore both elements and wires
  placedElements = previousState.elements;
  wires = previousState.wires;

  redraw();
  updateUndoRedoButtons();
}

// Redo
function redo() {
  if (redoStack.length === 0) return;

  // Save current state to undo stack
  const currentState = {
    elements: JSON.parse(JSON.stringify(placedElements)),
    wires: JSON.parse(JSON.stringify(wires))
  };
  undoStack.push(currentState);
  currentHistorySize += calculateStateSize(currentState);

  // Get next state
  const nextState = redoStack.pop();

  // Restore both elements and wires
  placedElements = nextState.elements;
  wires = nextState.wires;

  redraw();
  updateUndoRedoButtons();
}

undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);

function updateUndoRedoButtons() {
  undoBtn.disabled = undoStack.length === 0;
  redoBtn.disabled = redoStack.length === 0;
}

updateUndoRedoButtons();

// Undo Z, Redo Y
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && !e.altKey) {
    if (e.key === "z" || e.key === "Z") {
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    } else if (e.key === "y" || e.key === "Y") {
      e.preventDefault();
      redo();
    }
  }
});

// Hitbox
function findHitElement(canvasPosX, canvasPosY, elements) {
  let hitElement = null;
  let hitElementIndex = -1;

  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];
    const elementId = getElementTypeId(el.type);
    const hitbox = getElementHitbox(elementId);
    const size = CANVAS_ELEMENT_SIZE;
    const rotation = el.rotation || 0;

    const rotationOffsets = elementRotationOffset[elementId];
    const rotationOffset = rotationOffsets ? rotationOffsets[rotation - 1] || {x: 0, y: 0} : {x: 0, y: 0};

    const offset = elementOffset[elementId] || {x: 0, y: 0};

    const elementCenterX = el.x + rotationOffset.x;
    const elementCenterY = el.y + rotationOffset.y;

    const rotationRadians = (rotation * 90) * Math.PI / 180;
    const cosAngle = Math.cos(-rotationRadians);
    const sinAngle = Math.sin(-rotationRadians);

    const relativeX = canvasPosX - elementCenterX;
    const relativeY = canvasPosY - elementCenterY;

    const localX = relativeX * cosAngle - relativeY * sinAngle + elementCenterX;
    const localY = relativeX * sinAngle + relativeY * cosAngle + elementCenterY;

    let hitboxX = elementCenterX + (hitbox.x * size);
    let hitboxY = elementCenterY + (hitbox.y * size);

    let isHit = false;

    switch (hitbox.type) {
      case "rect":
        const hitboxWidth = (hitbox.width || 1) * size;
        const hitboxHeight = (hitbox.height || 1) * size;
        if (
          localX >= hitboxX - hitboxWidth / 2 &&
          localX <= hitboxX + hitboxWidth / 2 &&
          localY >= hitboxY - hitboxHeight / 2 &&
          localY <= hitboxY + hitboxHeight / 2
        ) {
          isHit = true;
        }
        break;

      case "roundrect":
        const roundrectWidth = (hitbox.width || 1) * size;
        const roundrectHeight = (hitbox.height || 1) * size;
        const roundrectRadius = (hitbox.radius || 0) * size;

        const rX = hitboxX - roundrectWidth / 2;
        const rY = hitboxY - roundrectHeight / 2;
        const rW = roundrectWidth;
        const rH = roundrectHeight;
        const rR = roundrectRadius;

        if (localX >= rX + rR && localX <= rX + rW - rR &&
            localY >= rY && localY <= rY + rH) {
          isHit = true;
        }
        else if (localX >= rX && localX <= rX + rW &&
                  localY >= rY + rR && localY <= rY + rH - rR) {
          isHit = true;
        }
        else {
          const corners = [
            { cx: rX + rR, cy: rY + rR },           // Top-left corner
            { cx: rX + rW - rR, cy: rY + rR },      // Top-right corner
            { cx: rX + rW - rR, cy: rY + rH - rR }, // Bottom-right corner
            { cx: rX + rR, cy: rY + rH - rR }       // Bottom-left corner
          ];
          for (const corner of corners) {
            const dx = localX - corner.cx;
            const dy = localY - corner.cy;
            if ((dx * dx + dy * dy) <= (rR * rR)) {
              isHit = true;
              break;
            }
          }
        }
        break;

      case "circle":
        const circleCenterX = elementCenterX + (hitbox.x || 0) * size;
        const circleCenterY = elementCenterY + (hitbox.y || 0) * size;
        const hitboxRadius = (hitbox.radius || 0.5) * size;
        const distance = Math.sqrt(
          Math.pow(localX - circleCenterX, 2) +
          Math.pow(localY - circleCenterY, 2)
        );
        if (distance <= hitboxRadius) {
          isHit = true;
        }
        break;

      case "3point":
        const v1x = elementCenterX + hitbox.x * size;
        const v1y = elementCenterY + hitbox.y * size;
        const v2x = elementCenterX + hitbox.x2 * size;
        const v2y = elementCenterY + hitbox.y2 * size;
        const v3x = elementCenterX + hitbox.x3 * size;
        const v3y = elementCenterY + hitbox.y3 * size;

        const v1 = { x: v1x, y: v1y };
        const v2 = { x: v2x, y: v2y };
        const v3 = { x: v3x, y: v3y };

        const sign = (p1, p2, p3) => {
          return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
        };

        const s1 = sign({x: localX, y: localY}, v1, v2);
        const s2 = sign({x: localX, y: localY}, v2, v3);
        const s3 = sign({x: localX, y: localY}, v3, v1);

        const hasNegative = (s1 < 0) || (s2 < 0) || (s3 < 0);
        const hasPositive = (s1 > 0) || (s2 > 0) || (s3 > 0);

        if (!(hasNegative && hasPositive)) {
          isHit = true;
        }
        break;

      default:
        if (
          localX >= elementCenterX - size / 2 &&
          localX <= elementCenterX + size / 2 &&
          localY >= elementCenterY - size / 2 &&
          localY <= elementCenterY + size / 2
        ) {
          isHit = true;
        }
        break;
    }

    if (isHit) {
      hitElement = el;
      hitElementIndex = i;
      break;
    }
  }
  return { hitElement, hitElementIndex };
}

// Arrow Endpoint Hitbox
function findArrowEndpointHit(canvasPosX, canvasPosY, elements) {
  for (let i = elements.length - 1; i >= 0; i--) {
    const el = elements[i];
    const elementId = getElementTypeId(el.type);

    if (elementId !== 40) continue;

    const size = CANVAS_ELEMENT_SIZE;
    const endOffset = el.arrowEndOffset || { x: 1, y: 0 };

    const endpointX = el.x + (-0.25 * size) + (endOffset.x * 20);
    const endpointY = el.y + (-0.25 * size) + (endOffset.y * 20);

    const hitboxRadius = 0.25 * size;
    const distance = Math.sqrt(
      Math.pow(canvasPosX - endpointX, 2) +
      Math.pow(canvasPosY - endpointY, 2)
    );
      
    if (distance <= hitboxRadius) {
      return { element: el, elementIndex: i };
    }
  }
  return null;
}

// Context Menu Event Listeners
document.addEventListener("click", (e) => {
  if (!elementContextMenu.contains(e.target)) {
    elementContextMenu.classList.remove("show");
    contextMenuOpened = false;
    contextMenuElement = null;
    if (contextMenuTimeout) {
      clearTimeout(contextMenuTimeout);
      contextMenuTimeout = null;
    }
  }
});

elementContextMenu.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Close On Scroll Or Zoom
canvas.addEventListener("wheel", (e) => {
  elementContextMenu.classList.remove("show");
  contextMenuOpened = false;

  if (isEditingText && textInput && !textInput.contains(e.target)) {
    finishTextEditing();
  }
});

canvas.addEventListener("touchmove", (e) => {
  if (isEditingText && textInput && !textInput.contains(e.target)) {
    finishTextEditing();
  }
  if (e.touches.length === 2) {
    elementContextMenu.classList.remove("show");
    contextMenuOpened = false;
  }
});

// Context Menu Options
document.getElementById("contextDelete").addEventListener("click", (e) => {
  e.preventDefault();
  elementContextMenu.classList.remove("show");
  contextMenuOpened = false;

  if (contextMenuElement && contextMenuElementIndex !== null) {
    saveStateToHistory();

    removeWiresConnectedToElement(contextMenuElementIndex);

    placedElements.splice(contextMenuElementIndex, 1);

    wires.forEach(wire => {
      if (wire.start?.type === "element" && wire.start.elementIndex > contextMenuElementIndex) {
        wire.start.elementIndex--;
      }
      if (wire.end?.type === "element" && wire.end.elementIndex > contextMenuElementIndex) {
        wire.end.elementIndex--;
      }
    });

    redraw();
    contextMenuElement = null;
    contextMenuElementIndex = null;
  }
});

document.getElementById("contextDuplicate").addEventListener("click", (e) => {
  e.preventDefault();
  elementContextMenu.classList.remove("show");
  contextMenuOpened = false;

  if (contextMenuElement) {
    saveStateToHistory();

    const duplicate = {
      type: contextMenuElement.type,
      x: contextMenuElement.x + 20,
      y: contextMenuElement.y + 20,
      rotation: contextMenuElement.rotation || 0,
      showText: contextMenuElement.showText !== false
    };

    if (getElementTypeId(contextMenuElement.type) === 39) {
      duplicate.textContent = contextMenuElement.textContent || "";
    }

    if (getElementTypeId(contextMenuElement.type) === 40) {
      duplicate.arrowEndOffset = contextMenuElement.arrowEndOffset || { x: 1, y: 0 };
    }

    placedElements.push(duplicate);
    redraw();
    contextMenuElement = null;
    contextMenuElementIndex = null;
  }
});

document.getElementById("contextRotate").addEventListener("click", (e) => {
  e.preventDefault();
  elementContextMenu.classList.remove("show");
  contextMenuOpened = false;

  if (contextMenuElement && contextMenuElementIndex !== null) {
    saveStateToHistory();

    const currentRotation = contextMenuElement.rotation;
    const newRotation = (currentRotation + 1) % 4;

    placedElements[contextMenuElementIndex].rotation = newRotation;

    redraw();
    contextMenuElement = null;
    contextMenuElementIndex = null;
  }
});

document.getElementById("contextShowText").addEventListener("click", (e) => {
  e.preventDefault();

  if (contextMenuElement && contextMenuElementIndex !== null) {
    saveStateToHistory();

    const currentShowText = placedElements[contextMenuElementIndex].showText;
    placedElements[contextMenuElementIndex].showText = !currentShowText;

    const toggle = e.target.closest(".toggle-switch");
    if (toggle) {
      toggle.classList.remove("active");
      if (placedElements[contextMenuElementIndex].showText) {
        toggle.classList.add("active");
      }
    }

    redraw();
  }
});

document.getElementById("contextEditText").addEventListener("click", (e) => {
  e.preventDefault();
  elementContextMenu.classList.remove("show");
  contextMenuOpened = false;

  if (contextMenuElement && contextMenuElementIndex !== null) {
    createTextInput(contextMenuElement, contextMenuElementIndex);
  }
});

// Show Context Menu
function showContextMenu(x, y, element, elementIndex) {
  contextMenuElement = element;
  contextMenuElementIndex = elementIndex;

  elementContextMenu.style.left = x + "px";
  elementContextMenu.style.top = y + "px";

  const elementId = getElementTypeId(element.type);

  // Text And Arrow
  const isText = elementId === 39;
  const isArrow = elementId === 40;

  const rotateButton = document.getElementById("contextRotate");
  const editTextButton = document.getElementById("contextEditText");
  const showTextToggle = document.querySelector(".toggle-item");

  if (isArrow) {
    rotateButton.style.display = "none";
  } else {
    rotateButton.style.display = "block";
  }

  if (isText) {
    editTextButton.style.display = "block";
  } else {
    editTextButton.style.display = "none";
  }

  if (isText || isArrow) {
    showTextToggle.style.display = "none";
  } else {
    showTextToggle.style.display = "flex";

    const toggle = document.querySelector(".toggle-switch");
    if (toggle) {
      toggle.classList.remove("active");
      if (element.showText !== false) {
        toggle.classList.add("active");
      }
    }
  }

  elementContextMenu.classList.add("show");
  contextMenuOpened = true;

  if (isDraggingElement && currentElement && currentElement.isExisting) {
    placedElements.push({
      type: currentElement.type,
      x: element.x,
      y: element.y,
      rotation: currentElement.rotation || 0,
      showText: currentElement.showText !== undefined ? currentElement.showText : true,
      id: getElementTypeId(currentElement.type)
    });

    isDraggingElement = false;
    currentElement = null;
    document.body.style.cursor = "default";
    canvas.style.cursor = "default";

    drawOverlay();
    redraw();
  }

  if (contextMenuTimeout) {
    clearTimeout(contextMenuTimeout);
    contextMenuTimeout = null;
  }

  if (editBtn.classList.contains("active")) {
    const active = editBtn.classList.toggle("active");
    editBtn.classList.toggle("show", active);
    dropdownContent.classList.toggle("show");
  }
}

// Create Text Input
function createTextInput(element, elementIndex) {
  if (isEditingText) return;

  isEditingText = true;
  editingElement = element;
  editingElementIndex = elementIndex;

  textInput = document.createElement("input");
  textInput.type = "text";
  textInput.value = element.textContent || "";
  textInput.style.position = "absolute";
  textInput.style.zIndex = "10000";
  textInput.style.border = "2px solid #007bff";
  textInput.style.borderRadius = "4px";
  textInput.style.padding = "4px 8px";
  textInput.style.fontSize = "16px";
  textInput.style.fontFamily = "Arial, sans-serif";
  textInput.style.backgroundColor = "white";
  textInput.style.outline = "none";
  textInput.style.minWidth = "100px";

  const screenX = element.x * scale + offsetX;
  const screenY = element.y * scale + offsetY + document.querySelector(".topbar").offsetHeight;
  
  textInput.style.left = (screenX + 10) + "px";
  textInput.style.top = (screenY + 2) + "px";
  
  document.body.appendChild(textInput);

  textInput.focus();
  textInput.setSelectionRange(textInput.value.length, textInput.value.length);

  textInput.addEventListener("keydown", handleTextInputKeydown);
  textInput.addEventListener("input", handleTextInputChange);

  textInput.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

// Text Handlers
function handleTextInputKeydown(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    finishTextEditing();
  }
}

function handleTextInputChange(e) {
  if (editingElement && editingElementIndex !== null) {
    placedElements[editingElementIndex].textContent = e.target.value || "";
    redraw();
  }
}

function finishTextEditing() {
  if (!isEditingText || !textInput) return;

  if (editingElement && editingElementIndex !== null) {
    saveStateToHistory();
    placedElements[editingElementIndex].textContent = textInput.value || "";
    redraw();
  }

  document.body.removeChild(textInput);
  textInput = null;
  isEditingText = false;
  editingElement = null;
  editingElementIndex = null;
}





// CONTROLS SECTION

// MOUSE SUB-SECTION

// Mouse Context Menu
canvas.addEventListener("contextmenu", (e) => {
  if (isStarted) return;

  e.preventDefault();
  isRightClicking = true;

  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const canvasPos = getCanvasPos(mouseX, mouseY);

  const { hitElement, hitElementIndex } = findHitElement(canvasPos.x, canvasPos.y, placedElements);

  if (hitElement) {
    showContextMenu(mouseX, mouseY, hitElement, hitElementIndex);
  } else {
    elementContextMenu.classList.remove("show");
  }

  setTimeout(() => { isRightClicking = false; }, 100);
});

// Mouse Down
canvas.addEventListener("mousedown", (e) => {
  if (e.target !== canvas) return;
  if (isRightClicking) return;
  if (isStarted) {
    dragStart = { x: e.clientX, y: e.clientY };
    isDragging = true;
    canvas.style.cursor = "move";
    return;
  }

  const mouseX = e.clientX;
  const mouseY = e.clientY;

  if (e.button === 2) return;

  const canvasPos = getCanvasPos(mouseX, mouseY);

  const existingWirePoint = findWirePointAt(canvasPos.x, canvasPos.y);
  if (existingWirePoint) {
    saveStateToHistory();
    isDraggingWirePoint = true;
    draggingWireIndex = existingWirePoint.wireIndex;
    draggingPointType = existingWirePoint.pointType;
    canvas.style.cursor = "crosshair";
    return;
  }

  const connectionPoint = findConnectionPointWithIndex(canvasPos.x, canvasPos.y);
if (connectionPoint) {
  const alreadyConnected = isPointConnected(connectionPoint.elementIndex, connectionPoint.connectionIndex, connectionPoint.type);

  if (alreadyConnected) {
    // Find the wire that's connected to this point
    for (let i = 0; i < wires.length; i++) {
      const wire = wires[i];
      if (connectionPoint.type === "input" && 
          wire.start.type === "element" && 
          wire.start.elementIndex === connectionPoint.elementIndex && 
          wire.start.connectionIndex === connectionPoint.connectionIndex) {
        saveStateToHistory();
        isDraggingWirePoint = true;
        draggingWireIndex = i;
        draggingPointType = "start";
        canvas.style.cursor = "crosshair";
        return;
      }
      if (connectionPoint.type === "output" && 
          wire.end.type === "element" && 
          wire.end.elementIndex === connectionPoint.elementIndex && 
          wire.end.connectionIndex === connectionPoint.connectionIndex) {
        saveStateToHistory();
        isDraggingWirePoint = true;
        draggingWireIndex = i;
        draggingPointType = "end";
        canvas.style.cursor = "crosshair";
        return;
      }
    }
  } else {
    // Create a new wire
    saveStateToHistory();
    isDraggingWire = true;
    wireStartPoint = connectionPoint;

    const isFromOutput = connectionPoint.type === "output";

    currentWire = {
      startX: connectionPoint.x,
      startY: connectionPoint.y,
      endX: canvasPos.x,
      endY: canvasPos.y,
      isFromOutput: isFromOutput,
      isDiagonal: false
    };
    canvas.style.cursor = "crosshair";
    return;
  }
}

  const wireIndex = findWireAt(canvasPos.x, canvasPos.y);
  if (wireIndex !== -1) {
    saveStateToHistory();
    wires.splice(wireIndex, 1);
    redraw();
    return;
  }

  const endpointHit = findArrowEndpointHit(canvasPos.x, canvasPos.y, placedElements);
  if (endpointHit) {
    saveStateToHistory();
    isDraggingArrowEndpoint = true;
    draggingArrowElement = endpointHit.element;
    draggingArrowElementIndex = endpointHit.elementIndex;
    document.body.style.cursor = "grabbing";
    canvas.style.cursor = "grabbing";
    return;
  }

  const { hitElement, hitElementIndex } = findHitElement(canvasPos.x, canvasPos.y, placedElements);

  if (hitElement) {
    saveStateToHistory();
  
    // Store connections before disconnecting
    draggedElementConnections = [];
    
    for (let i = 0; i < wires.length; i++) {
      const wire = wires[i];
      
      // Store start connections
      if (wire.start.type === "element" && wire.start.elementIndex === hitElementIndex) {
        draggedElementConnections.push({
          wireIndex: i,
          pointType: "start",
          connectionIndex: wire.start.connectionIndex
        });
      }
      
      // Store end connections
      if (wire.end.type === "element" && wire.end.elementIndex === hitElementIndex) {
        draggedElementConnections.push({
          wireIndex: i,
          pointType: "end",
          connectionIndex: wire.end.connectionIndex
        });
      }
    }
  
    // Convert wires to canvas positions
    for (let i = wires.length - 1; i >= 0; i--) {
      const wire = wires[i];
  
      if (wire.start.type === "element" && wire.start.elementIndex === hitElementIndex) {
        const coords = getWireCoordinates(wire);
        if (coords) {
          wire.start = {
            type: "canvas",
            x: coords.startX,
            y: coords.startY
          };
        }
      }
  
      if (wire.end.type === "element" && wire.end.elementIndex === hitElementIndex) {
        const coords = getWireCoordinates(wire);
        if (coords) {
          const startCoords = getWireCoordinates({ 
            start: wire.start, 
            end: { type: "canvas", xOffset: 0, yOffset: 0 } 
          });
          if (startCoords) {
            wire.end = {
              type: "canvas",
              xOffset: coords.endX - startCoords.startX,
              yOffset: coords.endY - startCoords.startY
            };
          }
        }
      }
  
      if (wire.start.type === "element" && wire.start.elementIndex > hitElementIndex) {
        wire.start.elementIndex--;
      }
      if (wire.end.type === "element" && wire.end.elementIndex > hitElementIndex) {
        wire.end.elementIndex--;
      }
    }
  
    placedElements.splice(hitElementIndex, 1);
  
    const elementScreenX = hitElement.x * scale + offsetX;
    const elementScreenY = hitElement.y * scale + offsetY + document.querySelector(".topbar").offsetHeight;
  
    currentElement = {
      type: hitElement.type,
      x: elementScreenX,
      y: elementScreenY,
      displaySize: CANVAS_ELEMENT_SIZE * scale,
      isExisting: true,
      rotation: hitElement.rotation || 0,
      showText: hitElement.showText !== false,
      arrowEndOffset: hitElement.arrowEndOffset,
      textContent: hitElement.textContent,
      draggedFromCanvas: true,
      draggedElementIndex: hitElementIndex
    };
  
    dragOffset = {
      x: mouseX - elementScreenX,
      y: mouseY - elementScreenY
    };
  
    isDraggingElement = true;
    document.body.style.cursor = "grabbing";
    canvas.style.cursor = "grabbing";
    redraw();
    drawOverlay();
    return;
  }

  dragStart = { x: e.clientX, y: e.clientY };
  isDragging = true;
  canvas.style.cursor = "move";
});

// Mouse Move
canvas.addEventListener("mousemove", (e) => {
  const canvasPos = getCanvasPos(e.clientX, e.clientY);

  if (isDraggingWirePoint && draggingWireIndex !== null) {
    const wire = wires[draggingWireIndex];
    const coords = getWireCoordinates(wire);
    if (!coords) return;

    // Check if hovering over a connection point or wire point
    const targetPoint = findConnectionPointWithIndex(canvasPos.x, canvasPos.y);
    const wirePoint = findWirePointAt(canvasPos.x, canvasPos.y);

    // Determine if we should show connecting state
    if (draggingPointType === "start") {
      if ((targetPoint && targetPoint.type === "input" && !isPointConnected(targetPoint.element, targetPoint.connectionIndex, "input")) || wirePoint) {
        isWireConnecting = true;
        hoveredConnectionPoint = targetPoint || wirePoint;

        // Snap to connection point instead of canvas grid
        if (targetPoint) {
          wire.start = {
            type: "canvas",
            x: targetPoint.x,
            y: targetPoint.y
          };
          if (wire.end.type === "canvas") {
            wire.end.xOffset = coords.endX - targetPoint.x;
            wire.end.yOffset = coords.endY - targetPoint.y;
          }
        } else if (wirePoint) {
          wire.start = {
            type: "canvas",
            x: wirePoint.x,
            y: wirePoint.y
          };
          if (wire.end.type === "canvas") {
            wire.end.xOffset = coords.endX - wirePoint.x;
            wire.end.yOffset = coords.endY - wirePoint.y;
          }
        }
      } else {
        isWireConnecting = false;
        hoveredConnectionPoint = null;

        // Normal canvas snapping
        const isDiagonal = wire.isDiagonal || false;
        const snapped = snapWireEnd(coords.endX, coords.endY, canvasPos.x, canvasPos.y, isDiagonal);

        wire.start = {
          type: "canvas",
          x: snapped.x,
          y: snapped.y
        };

        if (wire.end.type === "canvas") {
          wire.end.xOffset = coords.endX - snapped.x;
          wire.end.yOffset = coords.endY - snapped.y;
        }
      }
    } else { // dragging end point
      if ((targetPoint && targetPoint.type === "output" && !isPointConnected(targetPoint.element, targetPoint.connectionIndex, "output")) || wirePoint) {
        isWireConnecting = true;
        hoveredConnectionPoint = targetPoint || wirePoint;

        // Snap to connection point
        if (targetPoint) {
          wire.end = {
            type: "canvas",
            xOffset: targetPoint.x - coords.startX,
            yOffset: targetPoint.y - coords.startY
          };
        } else if (wirePoint) {
          wire.end = {
            type: "canvas",
            xOffset: wirePoint.x - coords.startX,
            yOffset: wirePoint.y - coords.startY
          };
        }
      } else {
        isWireConnecting = false;
        hoveredConnectionPoint = null;

        // Normal canvas snapping
        const isDiagonal = wire.isDiagonal || false;
        const snapped = snapWireEnd(coords.startX, coords.startY, canvasPos.x, canvasPos.y, isDiagonal);

        wire.end = {
          type: "canvas",
          xOffset: snapped.x - coords.startX,
          yOffset: snapped.y - coords.startY
        };
      }
    }

    redraw();
    return;
  }

  if (isDraggingWire && currentWire) {
    // Check if hovering over a valid connection point
    const targetPoint = findConnectionPointWithIndex(canvasPos.x, canvasPos.y);
    const wirePoint = findWirePointAt(canvasPos.x, canvasPos.y);

    const validConnection = currentWire.isFromOutput ? 
      (targetPoint && targetPoint.type === "input" && !isPointConnected(targetPoint.element, targetPoint.connectionIndex, "input")) :
      (targetPoint && targetPoint.type === "output" && !isPointConnected(targetPoint.element, targetPoint.connectionIndex, "output"));

    if (validConnection || wirePoint) {
      isWireConnecting = true;
      hoveredConnectionPoint = targetPoint || wirePoint;

      // Snap to connection point
      if (targetPoint) {
        currentWire.endX = targetPoint.x;
        currentWire.endY = targetPoint.y;
      } else if (wirePoint) {
        currentWire.endX = wirePoint.x;
        currentWire.endY = wirePoint.y;
      }
    } else {
      isWireConnecting = false;
      hoveredConnectionPoint = null;

      // Normal canvas snapping
      const isDiagonal = currentWire.isDiagonal || false;
      const snappedEnd = snapWireEnd(currentWire.startX, currentWire.startY, canvasPos.x, canvasPos.y, isDiagonal);
      currentWire.endX = snappedEnd.x;
      currentWire.endY = snappedEnd.y;
    }

    redraw();
    return;
  }

  if (isDraggingArrowEndpoint && draggingArrowElement) {
    const size = CANVAS_ELEMENT_SIZE;

    const startX = draggingArrowElement.x + (-0.25 * size);
    const startY = draggingArrowElement.y + (-0.25 * size);

    const rawOffsetX = canvasPos.x - startX;
    const rawOffsetY = canvasPos.y - startY;

    const snappedOffsetX = Math.round(rawOffsetX / 10) * 10 / 20;
    const snappedOffsetY = Math.round(rawOffsetY / 10) * 10 / 20;

    placedElements[draggingArrowElementIndex].arrowEndOffset = {
      x: snappedOffsetX,
      y: snappedOffsetY
    };

    redraw();
    return;
  }

  if (isDragging) {
    offsetX += e.clientX - dragStart.x;
    offsetY += e.clientY - dragStart.y;
    dragStart = { x: e.clientX, y: e.clientY };
    redraw();
  }
});

// Mouse Up
canvas.addEventListener("mouseup", (e) => {
  const canvasPos = getCanvasPos(e.clientX, e.clientY);

  if (isDraggingWirePoint && draggingWireIndex !== null) {
    const wire = wires[draggingWireIndex];

    const targetPoint = findConnectionPointWithIndex(canvasPos.x, canvasPos.y);

    if (targetPoint) {
      const otherPointType = draggingPointType === "start" ? wire.end : wire.start;
      if (otherPointType.type === "element" && otherPointType.elementIndex === targetPoint.elementIndex) {
        wires.splice(draggingWireIndex, 1);
        redraw();
        isDraggingWirePoint = false;
        draggingWireIndex = null;
        draggingPointType = null;
        canvas.style.cursor = "default";
        return;
      }

      if (isPointConnected(targetPoint.element, targetPoint.connectionIndex, targetPoint.type)) {
        isDraggingWirePoint = false;
        draggingWireIndex = null;
        draggingPointType = null;
        canvas.style.cursor = "default";
        redraw();
        return;
      }

      if (draggingPointType === "start") {
        if (targetPoint.type === "input") {
          wire.start = {
            type: "element",
            element: targetPoint.element,
            elementIndex: targetPoint.elementIndex,
            connectionIndex: targetPoint.connectionIndex
          };
        }
      } else {
        if (targetPoint.type === "output") {
          wire.end = {
            type: "element",
            element: targetPoint.element,
            elementIndex: targetPoint.elementIndex,
            connectionIndex: targetPoint.connectionIndex
          };
        }
      }
    } else {
      const wirePoint = findWirePointAt(canvasPos.x, canvasPos.y);
      if (wirePoint && wirePoint.wireIndex !== draggingWireIndex) {
        if (draggingPointType === "start") {
          wire.start = {
            type: "wire",
            wireIndex: wirePoint.wireIndex,
            wirePoint: wirePoint.pointType
          };
        } else {
          wire.end = {
            type: "wire",
            wireIndex: wirePoint.wireIndex,
            wirePoint: wirePoint.pointType
          };
        }
      }
    }

    isDraggingWirePoint = false;
    draggingWireIndex = null;
    draggingPointType = null;
    canvas.style.cursor = "default";
    redraw();
    return;
  }

  if (isDraggingWire && currentWire) {
    const targetPoint = findConnectionPointWithIndex(canvasPos.x, canvasPos.y);
    const wirePoint = findWirePointAt(canvasPos.x, canvasPos.y);

    let newWire = {
      isDiagonal: currentWire.isDiagonal || false
    };

    if (currentWire.isFromOutput) {
      newWire.end = {
        type: "element",
        element: wireStartPoint.element,
        elementIndex: wireStartPoint.elementIndex,
        connectionIndex: wireStartPoint.connectionIndex
      };

      if (targetPoint && targetPoint.type === "input") {
        if (targetPoint.elementIndex === wireStartPoint.elementIndex) {
          isDraggingWire = false;
          currentWire = null;
          wireStartPoint = null;
          canvas.style.cursor = "default";
          redraw();
          return;
        }

        if (isPointConnected(targetPoint.element, targetPoint.connectionIndex, "input")) {
          isDraggingWire = false;
          currentWire = null;
          wireStartPoint = null;
          canvas.style.cursor = "default";
          redraw();
          return;
        }

        newWire.start = {
          type: "element",
          element: targetPoint.element,
          elementIndex: targetPoint.elementIndex,
          connectionIndex: targetPoint.connectionIndex
        };
      } else if (wirePoint) {
        newWire.start = {
          type: "wire",
          wireIndex: wirePoint.wireIndex,
          wirePoint: wirePoint.pointType
        };
      } else {
        newWire.start = {
          type: "canvas",
          x: currentWire.endX,
          y: currentWire.endY
        };
      }
    } else {
      newWire.start = {
        type: "element",
        element: wireStartPoint.element,
        elementIndex: wireStartPoint.elementIndex,
        connectionIndex: wireStartPoint.connectionIndex
      };

      if (targetPoint && targetPoint.type === "output") {
        if (targetPoint.elementIndex === wireStartPoint.elementIndex) {
          isDraggingWire = false;
          currentWire = null;
          wireStartPoint = null;
          canvas.style.cursor = "default";
          redraw();
          return;
        }

        if (isPointConnected(targetPoint.element, targetPoint.connectionIndex, "output")) {
          isDraggingWire = false;
          currentWire = null;
          wireStartPoint = null;
          canvas.style.cursor = "default";
          redraw();
          return;
        }

        newWire.end = {
          type: "element",
          element: targetPoint.element,
          elementIndex: targetPoint.elementIndex,
          connectionIndex: targetPoint.connectionIndex
        };
      } else if (wirePoint) {
        newWire.end = {
          type: "wire",
          wireIndex: wirePoint.wireIndex,
          wirePoint: wirePoint.pointType
        };
      } else {
        const coords = getWireCoordinates({ 
          start: newWire.start, 
          end: { type: "canvas", xOffset: 0, yOffset: 0 } 
        });
        if (coords) {
          newWire.end = {
            type: "canvas",
            xOffset: currentWire.endX - coords.startX,
            yOffset: currentWire.endY - coords.startY
          };
        }
      }
    }

    wires.push(newWire);

    isDraggingWire = false;
    currentWire = null;
    wireStartPoint = null;
    canvas.style.cursor = "default";
    redraw();
    return;
  }

  isDragging = false;
  isDraggingArrowEndpoint = false;
  draggingArrowElement = null;
  draggingArrowElementIndex = null;
  canvas.style.cursor = "default";
  document.body.style.cursor = "default";
});

// Mouse Zoom
canvas.addEventListener("wheel", (e) => {
  if (e.target !== canvas) return;
  e.preventDefault();

  const zoomFactor = 1.05;
  const mouseX = (e.clientX - offsetX) / scale;
  const mouseY = (e.clientY - offsetY) / scale;

  const oldScale = scale;

  if (e.deltaY < 0) {
    scale = Math.min(scale * zoomFactor, 3); // Max
  } else {
    scale = Math.max(scale / zoomFactor, 0.1); // Min
  }

  if (scale !== oldScale) {
    offsetX = e.clientX - mouseX * scale;
    offsetY = e.clientY - mouseY * scale;
    redraw();
  }
}, { passive: false });

// Mouse Document Down
document.addEventListener("mousedown", (e) => {
  if (isEditingText && textInput && !textInput.contains(e.target)) {
    finishTextEditing();
  }

  if (!elementContextMenu.contains(e.target)) {
    elementContextMenu.classList.remove("show");
  }

  if (e.target.classList.contains("piece-canvas")) {
    handlePieceSelection(e);
  }
});

// Mouse Document Move
document.addEventListener("mousemove", (e) => {
  if (isDraggingElement && currentElement) {
    const topBarHeight = document.querySelector(".topbar").offsetHeight;
    const canvasRect = canvas.getBoundingClientRect();
    const bottomBar = document.querySelector(".bottom-left");
    const bottomBarRect = bottomBar.getBoundingClientRect();

    currentElement.x = e.clientX - dragOffset.x / scale;
    currentElement.y = e.clientY - dragOffset.y / scale;
    currentElement.displaySize = OVERLAY_ELEMENT_SIZE;

    if (
      currentElement.x >= canvasRect.left &&
      currentElement.x <= canvasRect.right &&
      currentElement.y >= canvasRect.top+35 &&
      currentElement.y <= canvasRect.bottom &&
      currentElement.y <= bottomBarRect.top+10
    ) {
      const targetCanvasX = (e.clientX - dragOffset.x - offsetX) / scale;
      const targetCanvasY = (e.clientY - dragOffset.y - offsetY - topBarHeight) / scale;

      const snappedCanvasPos = snapToGrid(targetCanvasX, targetCanvasY);

      currentElement.x = snappedCanvasPos.x * scale + offsetX;
      currentElement.y = snappedCanvasPos.y * scale + offsetY + topBarHeight;
      currentElement.displaySize = CANVAS_ELEMENT_SIZE * scale;
    }
    drawOverlay();
  }
});

// Mouse Document Up
document.addEventListener("mouseup", (e) => {
  document.body.style.cursor = "default";
  canvas.style.cursor = "default";
  handleDrop(e.clientX - dragOffset.x, e.clientY - dragOffset.y);
});





// TOUCH SUB-SECTION

// Touch Start
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (isStarted) {
    return;
  }

  if (e.touches.length === 1) {
    const now = Date.now();
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    touchStartTime = now;
    touchStartPos = { x: touchX, y: touchY };

    const canvasPos = getCanvasPos(touchX, touchY);
    const { hitElement, hitElementIndex } = findHitElement(canvasPos.x, canvasPos.y, placedElements);

    if (longPressTimeout) {
      clearTimeout(longPressTimeout);
    }

    const endpointHit = findArrowEndpointHit(canvasPos.x, canvasPos.y, placedElements);
    if (endpointHit) {
      if (longPressTimeout) {
        clearTimeout(longPressTimeout);
      }
      saveStateToHistory();
      isDraggingArrowEndpoint = true;
      draggingArrowElement = endpointHit.element;
      draggingArrowElementIndex = endpointHit.elementIndex;
      return;
    }

    if (hitElement) {
      longPressTimeout = setTimeout(() => {
        if (navigator.vibrate) navigator.vibrate(50);
        showContextMenu(touchX, touchY, hitElement, hitElementIndex);
      }, 500);

      saveStateToHistory();

      for (let i = wires.length - 1; i >= 0; i--) {
        const wire = wires[i];

        if (wire.start.type === "element" && wire.start.elementIndex === hitElementIndex) {
          const coords = getWireCoordinates(wire);
          if (coords) {
            wire.start = {
              type: "canvas",
              x: coords.startX,
              y: coords.startY
            };
          }
        }

        if (wire.end.type === "element" && wire.end.elementIndex === hitElementIndex) {
          const coords = getWireCoordinates(wire);
          if (coords) {
            const startCoords = getWireCoordinates({ 
              start: wire.start, 
              end: { type: "canvas", xOffset: 0, yOffset: 0 } 
            });
            if (startCoords) {
              wire.end = {
                type: "canvas",
                xOffset: coords.endX - startCoords.startX,
                yOffset: coords.endY - startCoords.startY
              };
            }
          }
        }

        if (wire.start.type === "element" && wire.start.elementIndex > hitElementIndex) {
          wire.start.elementIndex--;
        }
        if (wire.end.type === "element" && wire.end.elementIndex > hitElementIndex) {
          wire.end.elementIndex--;
        }
      }

      placedElements.splice(hitElementIndex, 1);

      const elementScreenX = hitElement.x * scale + offsetX;
      const elementScreenY = hitElement.y * scale + offsetY + document.querySelector(".topbar").offsetHeight;

      currentElement = {
        type: hitElement.type,
        x: elementScreenX,
        y: elementScreenY,
        displaySize: CANVAS_ELEMENT_SIZE * scale,
        isExisting: true,
        rotation: hitElement.rotation || 0,
        showText: hitElement.showText !== false,
        textContent: hitElement.textContent
      };

      dragOffset = {
        x: touchX - elementScreenX,
        y: touchY - elementScreenY
      };

      isDraggingElement = true;
      redraw();
      drawOverlay();
      return;
    }

    dragStart = { x: touchX, y: touchY };
    isDragging = true;
    canvas.style.cursor = "move";

    lastTapTime = now;

  } else if (e.touches.length === 2) {
    isDragging = false;

    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    lastTouchDistance = Math.hypot(dx, dy);
    lastTouchCenter = {
      x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
      y: (e.touches[0].clientY + e.touches[1].clientY) / 2
    };
  }
}, { passive: false });

// Touch Move
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();

  if (isDraggingArrowEndpoint && draggingArrowElement && e.touches.length === 1) {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const canvasPos = getCanvasPos(touchX, touchY);
    const size = CANVAS_ELEMENT_SIZE;

    const startX = draggingArrowElement.x + (-0.25 * size);
    const startY = draggingArrowElement.y + (-0.25 * size);

    const rawOffsetX = canvasPos.x - startX;
    const rawOffsetY = canvasPos.y - startY;

    const snappedOffsetX = Math.round(rawOffsetX / 10) * 10 / 20;
    const snappedOffsetY = Math.round(rawOffsetY / 10) * 10 / 20;

    placedElements[draggingArrowElementIndex].arrowEndOffset = {
        x: snappedOffsetX,
        y: snappedOffsetY
    };

    redraw();
    return;
  }

  if (e.touches.length === 1) {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const distance = Math.sqrt(
      Math.pow(touchX - touchStartPos.x, 2) + Math.pow(touchY - touchStartPos.y, 2)
    );

    if (distance > 5 && longPressTimeout) {
      clearTimeout(longPressTimeout);
    }
  }

  if (e.touches.length === 1 && isDragging) {
    offsetX += e.touches[0].clientX - dragStart.x;
    offsetY += e.touches[0].clientY - dragStart.y;
    dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    redraw();
  }

  if (e.touches.length === 2) {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const currentDistance = Math.hypot(dx, dy);
    const zoomFactor = currentDistance / lastTouchDistance;

    const newCenter = {
      x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
      y: (e.touches[0].clientY + e.touches[1].clientY) / 2
    };

    const oldScale = scale;
    const mouseX = (newCenter.x - offsetX) / oldScale;
    const mouseY = (newCenter.y - offsetY) / oldScale;

    scale *= zoomFactor;

    offsetX = newCenter.x - mouseX * scale;
    offsetY = newCenter.y - mouseY * scale;

    lastTouchDistance = currentDistance;
    lastTouchCenter = newCenter;

    redraw();
  }
}, { passive: false });

// Touch End
canvas.addEventListener("touchend", () => {
  if (longPressTimeout) {
    clearTimeout(longPressTimeout);
  }

  isDragging = false;
  isDraggingArrowEndpoint = false;
  draggingArrowElement = null;
  draggingArrowElementIndex = null;
  canvas.style.cursor = "default";
  lastTouchDistance = 0;
});

// Touch Doucument Start
document.addEventListener("touchstart", (e) => {
  if (e.target.classList.contains("piece-canvas")) {
    handlePieceSelection(e);
  }
}, { passive: true });

// Close Context Menu
document.addEventListener("touchstart", (e) => {
  const touchTarget = e.target;
  const isContextMenuTouch = elementContextMenu.contains(touchTarget);
  const isElementWithContextTouch = contextMenuElement && 
    (touchTarget.closest(".canvas") === canvas && 
      contextMenuElement === findHitElement(
        getCanvasPos(e.touches[0].clientX, e.touches[0].clientY).x,
        getCanvasPos(e.touches[0].clientX, e.touches[0].clientY).y,
        placedElements
      ).hitElement);

  if (!isContextMenuTouch && !isElementWithContextTouch) {
    elementContextMenu.classList.remove("show");
    contextMenuOpened = false;
    if (contextMenuTimeout) {
      clearTimeout(contextMenuTimeout);
      contextMenuTimeout = null;
    }
  }
}, { passive: true });

// Touch Document Move
document.addEventListener("touchmove", (e) => {
  if (isDraggingElement && currentElement && e.touches.length === 1) {
    e.preventDefault();

    const rawClientX = e.touches[0].clientX;
    const rawClientY = e.touches[0].clientY;

    const topBarHeight = document.querySelector(".topbar").offsetHeight;
    const canvasRect = canvas.getBoundingClientRect();
    const bottomBar = document.querySelector(".bottom-left");
    const bottomBarRect = bottomBar.getBoundingClientRect();

    currentElement.x = rawClientX - dragOffset.x / scale;
    currentElement.y = rawClientY - dragOffset.y / scale;
    currentElement.displaySize = OVERLAY_ELEMENT_SIZE;

    if (
      currentElement.x >= canvasRect.left &&
      currentElement.x <= canvasRect.right &&
      currentElement.y >= canvasRect.top+35 &&
      currentElement.y <= canvasRect.bottom &&
      currentElement.y <= bottomBarRect.top+10
    ) {
      const targetCanvasX = (rawClientX - dragOffset.x - offsetX) / scale;
      const targetCanvasY = (rawClientY - dragOffset.y - offsetY - topBarHeight) / scale;

      const snappedCanvasPos = snapToGrid(targetCanvasX, targetCanvasY);

      currentElement.x = snappedCanvasPos.x * scale + offsetX;
      currentElement.y = snappedCanvasPos.y * scale + offsetY + topBarHeight;
      currentElement.displaySize = CANVAS_ELEMENT_SIZE * scale;
    }
    drawOverlay();
  }
}, { passive: false });

// Prevent Scrolling While Dragging
document.addEventListener("touchmove", (e) => {
  if (isDraggingElement) {
    e.preventDefault();
  }
}, { passive: false });

// Touch Document End
document.addEventListener("touchend", (e) => {
  if (isDraggingElement && currentElement) {
    const clientX = e.changedTouches[0].clientX;
    const clientY = e.changedTouches[0].clientY;
    handleDrop(clientX - dragOffset.x, clientY - dragOffset.y);
  }
});

// Simulation State
let isStarted = false;
let isPaused = false;
let isSimulating = false;

function updateSimulationState() {
  isSimulating = isStarted && !isPaused;
}

function reset() {
  // empty
}





// BOTTOM SECTION

// Elements
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const pauseBtn = document.getElementById("pauseBtn");
const plusBtn = document.getElementById("plusBtn");
const slideBar = document.getElementById("slideBar");
const leftBar = document.querySelector(".bottom-left");
const rightBar = document.querySelector(".bottom-right");

pauseBtn.classList.add("no-cursor");

// Start
startBtn.addEventListener("click", () => {
  if (!isStarted) {
    isStarted = true;
    isPaused = false;
    plusBtn.classList.remove("active");
    plusBtn.classList.add("no-cursor");
    slideBar.classList.remove("show");
    leftBar.classList.remove("show");
    rightBar.classList.remove("show");
    startBtn.classList.add("active");
    stopBtn.classList.remove("active");
    pauseBtn.classList.remove("active");
    pauseBtn.classList.remove("no-cursor");
    updateSimulationState();
    elementContextMenu.classList.remove("show");
  }
});

// Stop
stopBtn.addEventListener("click", () => {
  if (isStarted) {
    isStarted = false;
    isPaused = false;
    reset();
    plusBtn.classList.remove("no-cursor");
    stopBtn.classList.add("active");
    startBtn.classList.remove("active");
    pauseBtn.classList.remove("active");
    pauseBtn.classList.add("no-cursor");
    updateSimulationState();
  }
});

// Pause
pauseBtn.addEventListener("click", () => {
  if (isStarted) {
    isPaused = !isPaused;
    pauseBtn.classList.toggle("active", isPaused);
    updateSimulationState();
  }
});

// Plus Toggle
plusBtn.addEventListener("click", () => {
  if (isStarted) return;
  const active = plusBtn.classList.toggle("active");
  slideBar.classList.toggle("show", active);
  leftBar.classList.toggle("show", active);
  rightBar.classList.toggle("show", active);
});

// Piece Help
const pieceInfoButtons = document.querySelectorAll(".piece-info");

pieceInfoButtons.forEach(button => {
  const pieceHelpContent = button.nextElementSibling;

  if (pieceHelpContent && pieceHelpContent.classList.contains("piece-help-content")) {
    button.addEventListener("click", () => {

      // Close other help contents
      pieceInfoButtons.forEach(otherButton => {
        const otherHelpContent = otherButton.nextElementSibling;
        if (otherButton !== button && otherHelpContent && otherHelpContent.classList.contains("show")) {
          otherButton.classList.remove("active");
          otherButton.classList.remove("show");
          otherHelpContent.classList.remove("show");
        }
      });

      // Toggle help content
      const isActive = button.classList.toggle("active");
      button.classList.toggle("show", isActive);
      pieceHelpContent.classList.toggle("show", isActive);
    });
  }
});

document.addEventListener("click", (e) => {
  pieceInfoButtons.forEach(button => {
    const pieceHelpContent = button.nextElementSibling;
    if (pieceHelpContent && pieceHelpContent.classList.contains("show") && !button.contains(e.target) && !pieceHelpContent.contains(e.target)) {
      button.classList.remove("active");
      button.classList.remove("show");
      pieceHelpContent.classList.remove("show");
    }
  });
});