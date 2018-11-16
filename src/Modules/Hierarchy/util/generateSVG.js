import React from 'react';
import SVG from 'react-inlinesvg';
import base64 from 'base-64';
import sanitizeHtml from 'sanitize-html';

const options = {
  allowedTags: ['svg', 'path', 'g', 'class', 'style', 'polygon', 'circle', 'clip-path', 'rect', 'ellipse', 'line', 'polyline'],
  allowedAttributes: {
    '*': ['xmlns', 'viewbox', 'height', 'width', 'class', 'style', 'd', 'fill', 'stroke', 'stroke-width', 'points', 'x', 'y', 'rx', 'ry', 'cx', 'cy', 'r', 'rx', 'ry', 'x1', 'x2', 'y1', 'y2'],
  },

};

/**
 * generateSVG
 * @param {*} encodedSVG - base64 encoded svg element
 */
export default function generateSVG(encodedSVG) {
  const svgClean = base64.encode(sanitizeHtml(base64.decode(encodedSVG), options));

  return (
    <SVG
      className="md-icon"
      src={`data:image/svg+xml;base64,${svgClean}`}
    />
  );
}
