var test = require("tape");
var ddr_d3 = require("../../ddr-d3");

test('Space.Inheritance', function (t) {
    var space;

    space = new ddr_d3.geometry.Space(1, 2, 3, 4);
    t.ok(space instanceof ddr_d3.geometry.Space);
    t.ok(space instanceof ddr_d3.geometry.Rectangle);
    t.ok(space.getY(), 2);

    t.end();
});
