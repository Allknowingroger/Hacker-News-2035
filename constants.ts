import React from 'react';

// Helper functions to avoid JSX in .ts file
const createSvg = (width: string, height: string, ...children: React.ReactNode[]) => 
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    width,
    height,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, ...children);

const createPath = (d: string) => React.createElement('path', { d });
const createPolygon = (points: string) => React.createElement('polygon', { points });
const createPolyline = (points: string) => React.createElement('polyline', { points });
const createLine = (x1: string, y1: string, x2: string, y2: string) => React.createElement('line', { x1, y1, x2, y2 });
const createRect = (props: any) => React.createElement('rect', props);
const createCircle = (cx: string, cy: string, r: string) => React.createElement('circle', { cx, cy, r });

// SVG Icons as components for easy usage
export const Icons = {
  Refresh: () => createSvg("16", "16",
    createPath("M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"),
    createPath("M3 3v5h5"),
    createPath("M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"),
    createPath("M16 21h5v-5")
  ),
  MessageSquare: () => createSvg("14", "14",
    createPath("M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z")
  ),
  ArrowUp: () => createSvg("14", "14",
    createPath("m18 15-6-6-6 6")
  ),
  Zap: () => createSvg("14", "14",
    createPolygon("13 2 3 14 12 14 11 22 21 10 12 10 13 2")
  ),
  Terminal: () => createSvg("20", "20",
    createPolyline("4 17 10 11 4 5"),
    createLine("12", "19", "20", "19")
  ),
  Cpu: () => createSvg("16", "16",
    createRect({x: "4", y: "4", width: "16", height: "16", rx: "2", ry: "2"}),
    createRect({x: "9", y: "9", width: "6", height: "6"}),
    createLine("9", "1", "9", "4"),
    createLine("15", "1", "15", "4"),
    createLine("9", "20", "9", "23"),
    createLine("15", "20", "15", "23"),
    createLine("20", "9", "23", "9"),
    createLine("20", "14", "23", "14"),
    createLine("1", "9", "4", "9"),
    createLine("1", "14", "4", "14")
  ),
  Search: () => createSvg("16", "16",
    createCircle("11", "11", "8"),
    createLine("21", "21", "16.65", "16.65")
  ),
  X: () => createSvg("20", "20",
    createLine("18", "6", "6", "18"),
    createLine("6", "6", "18", "18")
  ),
  Grid: () => createSvg("16", "16",
    createRect({x: "3", y: "3", width: "7", height: "7"}),
    createRect({x: "14", y: "3", width: "7", height: "7"}),
    createRect({x: "14", y: "14", width: "7", height: "7"}),
    createRect({x: "3", y: "14", width: "7", height: "7")
  ),
  List: () => createSvg("16", "16",
    createLine("8", "6", "21", "6"),
    createLine("8", "12", "21", "12"),
    createLine("8", "18", "21", "18"),
    createLine("3", "6", "3.01", "6"),
    createLine("3", "12", "3.01", "12"),
    createLine("3", "18", "3.01", "18")
  ),
  Bot: () => createSvg("14", "14",
    createPath("M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"),
    createPath("M4 11v2a6 6 0 0 0 6 6l1 2h2l1-2a6 6 0 0 0 6-6v-2"),
    createPath("M15 11h.01"),
    createPath("M9 11h.01")
  )
};