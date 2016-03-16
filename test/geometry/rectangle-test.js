var test = require("tape");
var ddr_d3 = require("../../build/ddr-d3");

test('Rectangle.Construction', function (t) {
    var rect;

    rect = new ddr_d3.geometry.rectangle(10, 20, 30, 40);
    t.ok(rect.getLeftX(), 10);
    t.ok(rect.getRightX(), 40);
    t.ok(rect.getTopY(), 20);
    t.ok(rect.getBottomY(), 60);
    t.ok(rect.getWidth(), 30);
    t.ok(rect.getHeight(), 40);

    rect = new ddr_d3.geometry.rectangle(new ddr_d3.geometry.point(10, 20), new ddr_d3.geometry.point(40, 60));
    t.ok(rect.getLeftX(), 10);
    t.ok(rect.getRightX(), 40);
    t.ok(rect.getTopY(), 20);
    t.ok(rect.getBottomY(), 60);
    t.ok(rect.getWidth(), 30);
    t.ok(rect.getHeight(), 40);

    t.end();
});

test('Rectangle.Area', function (t) {
    var rect = new ddr_d3.geometry.rectangle(10, 20, 30, 40);
    t.equal(rect.getArea(), 1200);
    t.end();
});

test('Rectangle.Contains', function (t) {
    var rect, rect2;
    rect = new ddr_d3.geometry.rectangle(10, 20, 30, 40);

    rect2 = new ddr_d3.geometry.rectangle(10, 20, 30, 40);
    t.ok(rect.containsRectangle(rect2));
    t.ok(rect2.containsRectangle(rect));

    rect2 = new ddr_d3.geometry.rectangle(0, 0, 20, 30);
    t.notOk(rect.containsRectangle(rect2));
    t.notOk(rect2.containsRectangle(rect));

    rect2 = new ddr_d3.geometry.rectangle(20, 30, 10, 20);
    t.ok(rect.containsRectangle(rect2));
    t.notOk(rect2.containsRectangle(rect));
    t.end();
});

test('Rectangle.Merge', function (t) {
    var rect1, rect2;

    rect1 = new ddr_d3.geometry.rectangle(10, 20, 30, 40);
    rect2 = new ddr_d3.geometry.rectangle(-10, -30, 20, 20);
    rect1.merge(rect2);
    t.ok(rect1.getLeftX(), -10);
    t.ok(rect1.getRightX(), 40);
    t.ok(rect1.getTopY(), -30);
    t.ok(rect1.getBottomY(), 60);
    t.end();
});

test('Rectangle.Intersects', function (t) {
    var rect, rect2;
    rect = new ddr_d3.geometry.rectangle(10, 20, 30, 40);

    /* On left */
    rect2 = new ddr_d3.geometry.rectangle(0, 20, 10, 40);
    t.notOk(rect.intersectsRectangle(rect2));
    t.notOk(rect2.intersectsRectangle(rect));

    /* On bottom */
    rect2 = new ddr_d3.geometry.rectangle(10, 0, 30, 20);
    t.notOk(rect.intersectsRectangle(rect2));
    t.notOk(rect2.intersectsRectangle(rect));

    /* On right */
    rect2 = new ddr_d3.geometry.rectangle(40, 20, 10, 40);
    t.notOk(rect.intersectsRectangle(rect2));
    t.notOk(rect2.intersectsRectangle(rect));

    /* On top */
    rect2 = new ddr_d3.geometry.rectangle(10, 60, 30, 10);
    t.notOk(rect.intersectsRectangle(rect2));
    t.notOk(rect2.intersectsRectangle(rect));

    /* Intersects bottom left */
    rect2 = new ddr_d3.geometry.rectangle(0, 0, 20, 30);
    t.ok(rect.intersectsRectangle(rect2));
    t.ok(rect2.intersectsRectangle(rect));

    /* Intersects bottom */
    rect2 = new ddr_d3.geometry.rectangle(20, 0, 10, 30);
    t.ok(rect.intersectsRectangle(rect2));
    t.ok(rect2.intersectsRectangle(rect));

    // TODO: continue remaining cases

    t.end();
});
