var width = document.documentElement.clientWidth;
var height = 529;


var points = [];

var bounds = d3.geom.polygon([
  [-width / 1, -height / 1],
  [-width / 1, +height / 1],
  [+width / 1, +height / 1],
  [+width / 1, -height / 1]
]);

circle(0, 0, 250, 30, .01);
circle(0, 0, 70, 1, .13);

var line = d3.svg.line()
    .interpolate("basis-closed");

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

var path = svg.selectAll("path")
    .data(points)
  .enter().append("path");

d3.timer(function() {
  var voronoi = d3.geom.voronoi(points).map(function(cell) { return bounds.clip(cell); });
  path.attr("d", function(point, i) { return line(resample(voronoi[i])); });
});

function circle(cx, cy, r, n, δθ) {
  d3.range(1e-6, 2 * Math.PI, 2 * Math.PI / n).map(function(θ) {
    var point = [cx + Math.cos(θ) * r, cy + Math.sin(θ) * r];
    d3.timer(function() {
      θ += δθ;
      point[0] = cx + Math.cos(θ) * r;
   
    });
    points.push(point);
    return point;
  });
}

function resample(points) {
  var i = -1,
      n = points.length,
      p0 = points[n - 1], x0 = p0[0], y0 = p0[1], p1, x1, y1,
      points2 = [];
  while (++i < n) {
    p1 = points[i], x1 = p1[0], y1 = p1[1];
    points2.push(
 
      [(x0 + x1 * 2) / 3, (y0 + y1 * 2) / 3],
      p1
    );
    p0 = p1, x0 = x1, y0 = y1;
  }
  return points2;
}