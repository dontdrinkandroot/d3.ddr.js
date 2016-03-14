var test = require("tape");
var Space = require('../../src/geometry/space.js');

test('Space.Inheritance', function (t) {
    var space;

    space = new Space(1, 2, 3, 4);
    t.ok(space instanceof Space);
    t.ok(space instanceof Rectangle);
    t.ok(space.getY(), 2);

    t.end();
});
