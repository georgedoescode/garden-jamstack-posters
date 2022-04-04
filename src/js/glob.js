const arcToBezier = require('svg-arc-to-cubic-bezier');
const { Bezier } = require('bezier-js');
const { Vector2D } = require('@georgedoescode/vector2d');

// Thanks Steve Ruiz for these little helpers! https://github.com/steveruizok/globs
function shortAngleDist(a0, a1) {
  const max = Math.PI * 2;
  const da = (a1 - a0) % max;

  return ((2 * da) % max) - da;
}

function angleDelta(a0, a1) {
  return shortAngleDist(a0, a1);
}

function getSweep(c, a, b) {
  return angleDelta(Vector2D.angle(c, a), Vector2D.angle(c, b));
}

// You should totally check out the original paper on globs https://jcgt.org/published/0004/03/01/paper.pdf
class Glob {
  constructor(opts) {
    if (!opts.start || !opts.end) {
      console.warn('Warning: Glob must have a start and end node');

      return;
    }

    if (!opts.d) {
      opts.d = Vector2D.lerp(
        opts.start.point.copy(),
        opts.end.point.copy(),
        0.25
      );
    } else {
      opts.d = new Vector2D(opts.d.x, opts.d.y);
    }

    if (!opts.dP) {
      opts.dP = Vector2D.lerp(
        opts.start.point.copy(),
        opts.end.point.copy(),
        0.25
      );
    } else {
      opts.dP = new Vector2D(opts.dP.x, opts.dP.y);
    }

    const defaults = {
      a: 0.5,
      b: 0.5,
      aP: 0.5,
      bP: 0.5,
    };

    const { start, end, d, dP, a, b, aP, bP } = Object.assign(defaults, opts);

    this.start = start;
    this.end = end;

    this.isValid = true;

    this._SIDE_RIGHT = 1;
    this._SIDE_LEFT = -1;

    this._parameters = {};
    this._geometry = {};

    this.setParameters(this.start, this.end, d, dP, a, b, aP, bP);
    this.buildGeometry();
  }

  // Convert whole shape to bezier curves for easy collision detection/offsetting etc
  get bezierCurves() {
    const arc1 = arcToBezier({
      px: this._geometry.e0.x,
      py: this._geometry.e0.y,
      cx: this._geometry.e0P.x,
      cy: this._geometry.e0P.y,
      rx: this._parameters.r0,
      ry: this._parameters.r0,
      xAxisRotation: 0,
      largeArcFlag:
        getSweep(this._parameters.c0, this._geometry.e0, this._geometry.e0P) > 0
          ? 0
          : 1,
      sweepFlag: 1,
    });

    const arc2 = {
      x1: this._geometry.f0P.x,
      y1: this._geometry.f0P.y,
      x2: this._geometry.f1P.x,
      y2: this._geometry.f1P.y,
      x: this._geometry.e1P.x,
      y: this._geometry.e1P.y,
    };

    const arc3 = arcToBezier({
      px: this._geometry.e1P.x,
      py: this._geometry.e1P.y,
      cx: this._geometry.e1.x,
      cy: this._geometry.e1.y,
      rx: this._parameters.r1,
      ry: this._parameters.r1,
      xAxisRotation: 0,
      largeArcFlag:
        getSweep(this._parameters.c1, this._geometry.e1P, this._geometry.e1) > 0
          ? 0
          : 1,
      sweepFlag: 1,
    });

    const arc4 = {
      x1: this._geometry.f1.x,
      y1: this._geometry.f1.y,
      x2: this._geometry.f0.x,
      y2: this._geometry.f0.y,
      x: this._geometry.e0.x,
      y: this._geometry.e0.y,
    };

    return [arc1, arc2, arc3, arc4];
  }

  get _pomaxCurves() {
    const allCurves = this.bezierCurves.flat();
    const allCurvesFormatted = [];

    for (let i = 0; i < allCurves.length; i++) {
      const origin =
        i === 0
          ? this._geometry.e0
          : { x: allCurves[i - 1].x, y: allCurves[i - 1].y };

      const curve = allCurves[i];

      const bezier = new Bezier(
        origin.x,
        origin.y,
        curve.x1,
        curve.y1,
        curve.x2,
        curve.y2,
        curve.x,
        curve.y
      );

      allCurvesFormatted.push(bezier);
    }

    return allCurvesFormatted;
  }

  get hasSelfIntersection() {
    let interresects = false;

    for (let i = 0; i < this._pomaxCurves.length; i++) {
      const base = this._pomaxCurves[i];

      for (let j = 0; j < this._pomaxCurves.length; j++) {
        const current = this._pomaxCurves[j];

        if (
          !this._isSameBezier(base.points, current.points) &&
          base.intersects(current).length > 0
        ) {
          return true;
        }
      }
    }

    return false;
  }

  // I should make this much nicer...
  _isSameBezier(b1, b2) {
    return JSON.stringify(b1) === JSON.stringify(b2);
  }

  // JS adapted from https://imaginary-institute.com/resources/TechNote11/TechNote11.html
  _getTangentPoint(a, b, r, side) {
    const s = Vector2D.sub(b, a);
    s.normalize();

    const t = new Vector2D(s.y, -s.x);

    const ab = a.dist(b);
    const pb = Math.sqrt(ab * ab - r * r);
    const beta = Math.atan2(pb, r);
    const uscl = r * Math.cos(beta);
    const vscl = r * Math.sin(beta);

    const p0 = new Vector2D(
      a.x + uscl * s.x + vscl * t.x,
      a.y + uscl * s.y + vscl * t.y
    );
    const p1 = new Vector2D(
      a.x + uscl * s.x - vscl * t.x,
      a.y + uscl * s.y - vscl * t.y
    );

    const dP0 = Vector2D.sub(p0, a);
    const dP1 = Vector2D.sub(p1, a);

    const p0sgn = s.cross(dP0).z;
    const p1sgn = s.cross(dP1).z;

    if (p0sgn * p1sgn > 0) {
      console.warn('getTangentPoint: both points on same side of line!');

      return p0;
    }

    if (side === this._SIDE_RIGHT) {
      if (p0sgn > 0) return p0;

      return p1;
    }

    if (p0sgn < 0) return p0;

    return p1;
  }

  setParameters(start, end, d, dP, a, b, aP, bP) {
    this._parameters = {
      c0: this.start.point.copy(),
      c1: this.end.point.copy(),
      r0: start.radius,
      r1: end.radius,
      d: d.copy(),
      dP: dP.copy(),
      a: a,
      b: b,
      aP: aP,
      bP: bP,
    };
  }

  buildGeometry() {
    this._geometry.e0 = this._getTangentPoint(
      this._parameters.c0,
      this._parameters.d,
      this._parameters.r0,
      this._SIDE_RIGHT
    );

    this._geometry.e1 = this._getTangentPoint(
      this._parameters.c1,
      this._parameters.d,
      this._parameters.r1,
      this._SIDE_LEFT
    );

    this._geometry.e0P = this._getTangentPoint(
      this._parameters.c0,
      this._parameters.dP,
      this._parameters.r0,
      this._SIDE_LEFT,
      true
    );

    this._geometry.e1P = this._getTangentPoint(
      this._parameters.c1,
      this._parameters.dP,
      this._parameters.r1,
      this._SIDE_RIGHT
    );

    this._geometry.f0 = Vector2D.lerp(
      this._geometry.e0,
      this._parameters.d,
      this._parameters.a
    );

    this._geometry.f1 = Vector2D.lerp(
      this._geometry.e1,
      this._parameters.d,
      this._parameters.b
    );

    this._geometry.f0P = Vector2D.lerp(
      this._geometry.e0P,
      this._parameters.dP,
      this._parameters.aP
    );

    this._geometry.f1P = Vector2D.lerp(
      this._geometry.e1P,
      this._parameters.dP,
      this._parameters.bP
    );

    Object.keys(this._geometry).forEach((k) => {
      if (!this._geometry[k].x || !this._geometry[k].y) {
        this.isValid = false;
      }
    });
  }

  checkIntersection(target) {
    return this._pomaxCurves.some((c) => {
      let yes = false;

      target._pomaxCurves.forEach((c1) => {
        if (c1.intersects(c).length > 0) {
          yes = true;
        }
      });

      console.log(yes);

      return yes;
    });
  }

  buildPath() {
    if (!this.isValid) {
      console.warn('Glob is not valid, returning an empty path string.');

      return '';
    }

    const [arc1, arc2, arc3, arc4] = this.bezierCurves;

    let pathString = `M ${this._geometry.e0.x} ${this._geometry.e0.y} `;

    arc1.forEach((c) => {
      pathString += `C ${c.x1} ${c.y1} ${c.x2} ${c.y2} ${c.x} ${c.y} `;
    });

    pathString += `C ${arc2.x1} ${arc2.y1} ${arc2.x2} ${arc2.y2} ${arc2.x} ${arc2.y} `;

    arc3.forEach((c) => {
      pathString += `C ${c.x1} ${c.y1} ${c.x2} ${c.y2} ${c.x} ${c.y} `;
    });

    pathString += `C ${arc4.x1} ${arc4.y1} ${arc4.x2} ${arc4.y2} ${arc4.x} ${arc4.y} `;

    pathString += 'Z';

    return pathString;
  }
}

class Node {
  constructor(opts) {
    const defaults = {
      x: 0,
      y: 0,
      radius: 24,
      cap: 'round',
    };

    const { x, y, radius, cap } = Object.assign(defaults, opts);

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.cap = cap;
    this.point = new Vector2D(this.x, this.y);
  }
}

module.exports = {
  Glob,
  Node,
};
