var test = require("tape");
var geometry = require("../../build/ddr-geometry");

test('Point.Distance', function (t) {
    var p1, p2;

    p1 = new geometry.point(0, 0);
    p2 = new geometry.point(3, 4);
    t.equal(p1.getDistance(p2), 5);

    p1 = new geometry.point(-1, -2);
    p2 = new geometry.point(2, 2);
    t.equal(p1.getDistance(p2), 5);

    t.end();
});
