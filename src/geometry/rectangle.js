import ddr_d3_geometry_point from './point';

/**
 * @param {ddr_d3_geometry_point|number} xOrP1
 * @param {ddr_d3_geometry_point|number} yOrP2
 * @param {number} width
 * @param {number} height
 * @constructor
 */
var ddr_d3_geometry_rectangle = function (xOrP1, yOrP2, width, height) {

    var _p1, _p2;

    if (typeof xOrP1 === 'number' && typeof yOrP2 === 'number' && typeof width === 'number' && typeof height === 'number') {
        _p1 = new ddr_d3_geometry_point(xOrP1, yOrP2);
        _p2 = new ddr_d3_geometry_point(xOrP1 + width, yOrP2 + height);
    } else {
        _p1 = xOrP1;
        _p2 = yOrP2;
    }

    this.getArea = function () {
        return this.getWidth() * this.getHeight();
    };

    this.containsRectangle = function (other) {
        return other.getLeftX() >= this.getLeftX()
            && other.getTopY() >= this.getTopY()
            && other.getRightX() <= this.getRightX()
            && other.getBottomY() <= this.getBottomY();
    };

    this.intersectsRectangle = function (other) {
        return other.getRightX() > this.getLeftX()
            && other.getBottomY() > this.getTopY()
            && other.getLeftX() < this.getRightX()
            && other.getTopY() < this.getBottomY();
    };

    this.setCenterX = function (centerX) {
        var width = this.getWidth();
        _p1.setX(centerX - (width / 2));
        _p2.setX(centerX + (width / 2));
    };

    this.setCenterY = function (centerY) {
        var height = this.getHeight();
        _p1.setY(centerY - (height / 2));
        _p2.setY(centerY + (height / 2));
    };

    /**
     * @param {ddr_d3_geometry_rectangle} other
     */
    this.merge = function (other) {
        _p1.setX(Math.min(_p1.getX(), other.getP1().getX()));
        _p1.setY(Math.min(_p1.getY(), other.getP1().getY()));
        _p2.setX(Math.max(_p2.getX(), other.getP2().getX()));
        _p2.setY(Math.max(_p2.getY(), other.getP2().getY()));
    };

    this.getCenter = function () {
        return new ddr_d3_geometry_point((this.getLeftX() + this.getRightX()) / 2, (this.getTopY() + this.getBottomY()) / 2);
    };

    this.getP1 = function () {
        return _p1;
    };

    this.getP2 = function () {
        return _p2;
    };

    this.getTopLeftPoint = function () {
        return _p1;
    };

    this.getBottomRightPoint = function () {
        return _p2;
    };

    this.getX = function () {
        return _p1.getX();
    };

    this.setX = function (x) {
        var oldWidth = this.getWidth();
        _p1.setX(x);
        this.setWidth(oldWidth);
        return this;
    };

    this.getY = function () {
        return _p1.getY();
    };

    this.setY = function (y) {
        var oldHeight = this.getHeight();
        _p1.setY(y);
        this.setHeight(oldHeight);
        return this;
    };

    this.getLeftX = function () {
        return _p1.getX();
    };

    this.getRightX = function () {
        return _p2.getX();
    };

    this.getTopY = function () {
        return _p1.getY();
    };

    this.getBottomY = function () {
        return _p2.getY();
    };

    this.getWidth = function () {
        return _p2.getX() - _p1.getX();
    };

    this.setWidth = function (width) {
        _p2.setX(_p1.getX() + width);
        return this;
    };

    this.getHeight = function () {
        return _p2.getY() - _p1.getY();
    };

    this.setHeight = function (height) {
        _p2.setY(_p1.getY() + height);
        return this;
    };
};
ddr_d3_geometry_rectangle.prototype.toString = function () {
    return '[Rectangle x1=' + this.getLeftX() + ',y1=' + this.getTopY() + ',x2=' + this.getRightX() + ',y2=' + this.getBottomY() + ',w=' + this.getWidth() + ',h=' + this.getHeight() + ']';
};

export default ddr_d3_geometry_rectangle;