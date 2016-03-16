var test = require("tape");
var geometry = require("../../build/ddr-geometry");

test('Space.Inheritance', function (t) {
    var space;

    space = new geometry.space(1, 2, 3, 4);
    t.ok(space instanceof geometry.space);
    t.ok(space instanceof geometry.rectangle);
    t.ok(space.getY(), 2);

    t.end();
});
