var Rectangle = require('./rectangle.js');
var Point = require('./point.js');

var Space = function (x, y, width, height) {
    Rectangle.call(this, x, y, width, height);

    this.getDistanceToOrigin = function () {
        return this.getDistanceToOtherPoint(new Point(0, 0));
    };

    this.getDistanceToOtherPoint = function (other) {
        var closestPoint = this.getClosestPointToOtherPoint(other);
        return closestPoint.getDistance(other);
    };

    this.getClosestPointToOtherPoint = function (other) {
        var x = other.getX();
        var y = other.getY();
        if (other.getX() < this.getLeftX()) {
            x = this.getX();
        }
        if (other.getX() > this.getRightX()) {
            x = this.getRightX();
        }
        if (other.getY() < this.getY()) {
            y = this.getY();
        }
        if (other.getY() > this.getBottomY()) {
            y = this.getBottomY();
        }

        return new Point(x, y);
    };
};
Space.prototype = Object.create(Rectangle.prototype);
Space.prototype.constructor = Space;

var exports = module.exports = Space;
