var test = require("tape");
var ddr_d3 = require("../../build/ddr-d3");

test('Space.Inheritance', function (t) {
    var space;

    space = new ddr_d3.geometry.space(1, 2, 3, 4);
    t.ok(space instanceof ddr_d3.geometry.space);
    t.ok(space instanceof ddr_d3.geometry.rectangle);
    t.ok(space.getY(), 2);

    t.end();
});
