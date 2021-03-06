/**
 * @param {number} x
 * @param {number} y
 * @constructor
 */
var ddr_d3_geometry_point = function (x, y) {

    var _x = x;
    var _y = y;

    this.getDistance = function (other) {
        return Math.sqrt(
            (this.getX() - other.getX()) * (this.getX() - other.getX())
            + (this.getY() - other.getY()) * (this.getY() - other.getY())
        );
    };

    this.getX = function () {
        return _x;
    };

    this.setX = function (x) {
        _x = x;
    };

    this.getY = function () {
        return _y;
    };

    this.setY = function (y) {
        _y = y;
    };
};

export default ddr_d3_geometry_point;
