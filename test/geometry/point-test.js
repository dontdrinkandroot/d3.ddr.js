var test = require("tape");
var Point = require('../../src/geometry/point.js');

test('Point.Distance', function (t) {
    var p1, p2;

    p1 = new Point(0, 0);
    p2 = new Point(3, 4);
    t.equal(p1.getDistance(p2), 5);

    p1 = new Point(-1, -2);
    p2 = new Point(2, 2);
    t.equal(p1.getDistance(p2), 5);

    t.end();
});
