import point from './point';
import rectangle from './rectangle';

var space = function (x, y, width, height) {
    rectangle.call(this, x, y, width, height);

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

        return new point(x, y);
    };
};
space.prototype = Object.create(rectangle.prototype);
space.prototype.constructor = space;

export default space;