var test = require("tape");
var ddr_d3 = require("../../ddr-d3");

test('Point.Distance', function (t) {
    var p1, p2;

    p1 = new ddr_d3.geometry.Point(0, 0);
    p2 = new ddr_d3.geometry.Point(3, 4);
    t.equal(p1.getDistance(p2), 5);

    p1 = new ddr_d3.geometry.Point(-1, -2);
    p2 = new ddr_d3.geometry.Point(2, 2);
    t.equal(p1.getDistance(p2), 5);

    t.end();
});
