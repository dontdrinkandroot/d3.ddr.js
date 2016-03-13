var test = require("tape");
var Point = require('../../src/geometry/space.js');

test('Space.Inheritance', function (t) {
    var space;

    space = new Ddr.Space(1, 2, 3, 4);
    t.ok(space instanceof Ddr.Space);
    t.ok(space instanceof Ddr.Rectangle);
    t.ok(space.getY(), 2);

    t.end();
});
