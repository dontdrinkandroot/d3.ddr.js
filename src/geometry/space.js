import ddr_d3_geometry_point from './point';
import ddr_d3_geometry_rectangle from './rectangle';

var ddr_d3_geometry_space = function (x, y, width, height) {
    ddr_d3_geometry_rectangle.call(this, x, y, width, height);

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

        return new ddr_d3_geometry_point(x, y);
    };
};
ddr_d3_geometry_space.prototype = Object.create(ddr_d3_geometry_rectangle.prototype);
ddr_d3_geometry_space.prototype.constructor = ddr_d3_geometry_space;

export default ddr_d3_geometry_space;
