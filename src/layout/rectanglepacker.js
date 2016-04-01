import ddr_d3_geometry_point from '../geometry/point';
import ddr_d3_geometry_rectangle from '../geometry/rectangle';
import ddr_d3_geometry_space from '../geometry/space';

var ddr_d3_layout_rectangle_packer = function () {

    var _spaces = [];
    var _minHeight = 0;
    var _minWidth = 0;

    _spaces.push(new ddr_d3_geometry_rectangle(-100000, -100000, 200000, 200000));

    function ratio() {
        return [1, 1];
    }

    function removeRedundantSpaces(spaces) {
        /* Remove spaces that are contained within another space */
        var removeIndizes = [];
        for (var l = 0; l < spaces.length; l++) {
            var space1 = spaces[l];
            for (var m = l + 1; m < spaces.length; m++) {
                var space2 = spaces[m];
                if (space1.containsRectangle(space2)) {
                    if (removeIndizes.indexOf(m) === -1) {
                        removeIndizes.push(m);
                    }
                } else if (space2.containsRectangle(space1)) {
                    if (removeIndizes.indexOf(l) === -1) {
                        removeIndizes.push(l);
                    }
                }
            }
        }
        removeIndizes.sort(function (a, b) {
            return a - b;
        });
        for (var removeIndizesIdx = removeIndizes.length - 1; removeIndizesIdx >= 0; removeIndizesIdx--) {
            spaces.splice(removeIndizes[removeIndizesIdx], 1);
        }

        return spaces;
    }

    /**
     * @param {ddr_d3_geometry_space} space
     * @param {ddr_d3_geometry_rectangle} rect
     * @returns {ddr_d3_geometry_rectangle}
     */
    function alignBoundsToSpace(space, rect) {
        var x, y;

        if (space.getLeftX() >= 0) {
            x = space.getLeftX();
        } else if (space.getRightX() <= 0) {
            x = space.getRightX() - rect.getWidth();
        } else {
            if (space.getLeftX() > (-rect.getWidth() / 2)) {
                x = space.getLeftX();
            } else if (space.getRightX() < (rect.getWidth() / 2)) {
                x = space.getRightX() - (rect.getWidth());
            } else {
                x = -rect.getWidth() / 2;
            }
        }

        if (space.getTopY() >= 0) {
            y = space.getTopY();
        } else if (space.getBottomY() <= 0) {
            y = space.getBottomY() - rect.getHeight();
        } else {
            if (space.getTopY() > (-rect.getHeight() / 2)) {
                y = space.getTopY();
            } else if (space.getBottomY() < (rect.getHeight() / 2)) {
                y = space.getBottomY() - (rect.getHeight());
            } else {
                y = -rect.getHeight() / 2;
            }
        }

        return new ddr_d3_geometry_rectangle(x, y, rect.getWidth(), rect.getHeight());
    }

    /**
     * @param {ddr_d3_geometry_space} space
     * @param {ddr_d3_geometry_rectangle} rect
     */
    function intersect(space, rect) {
        var newSpaces = [];

        /* Left cut */
        if (rect.getX() > space.getLeftX()) {
            var left = new ddr_d3_geometry_space(
                new ddr_d3_geometry_point(space.getLeftX(), space.getTopY()),
                new ddr_d3_geometry_point(rect.getX(), space.getBottomY())
            );
            newSpaces.push(left);
        }

        /* Right cut */
        if (rect.getRightX() < space.getRightX()) {
            var right = new ddr_d3_geometry_space(
                new ddr_d3_geometry_point(rect.getRightX(), space.getTopY()),
                new ddr_d3_geometry_point(space.getRightX(), space.getBottomY())
            );
            newSpaces.push(right);
        }

        /* Top cut */
        if (rect.getY() > space.getTopY()) {
            var top = new ddr_d3_geometry_space(
                new ddr_d3_geometry_point(space.getLeftX(), space.getTopY()),
                new ddr_d3_geometry_point(space.getRightX(), rect.getY())
            );
            newSpaces.push(top);
        }

        /* Bottom cut */
        if (rect.getBottomY() < space.getBottomY()) {
            var bottom = new ddr_d3_geometry_space(
                new ddr_d3_geometry_point(space.getLeftX(), rect.getBottomY()),
                new ddr_d3_geometry_point(space.getRightX(), space.getBottomY())
            );
            newSpaces.push(bottom);
        }

        return newSpaces;
    }

    this.findPosition = function(rect) {
        for (var i = 0; i < _spaces.length; i++) {
            var space = _spaces[i];
            if (space.getWidth() >= rect.getWidth() && space.getHeight() >= rect.getHeight()) {
                return alignBoundsToSpace(space, rect);
            }
        }
        throw 'No suitable space found';
    };

    this.place = function(rect) {
        var untouchedSpaces = [];
        var newSpaces = [];
        for (var j = 0; j < _spaces.length; j++) {
            var space = _spaces[j];
            if (space.intersectsRectangle(rect)) {
                var intersectedSpaces = intersect(space, rect);
                for (var k = 0; k < intersectedSpaces.length; k++) {
                    var intersectedSpace = intersectedSpaces[k];
                    if (intersectedSpace.getWidth() >= _minWidth && intersectedSpace.getHeight() >= _minHeight) {
                        newSpaces.push(intersectedSpace);
                    }
                }
            } else {
                untouchedSpaces.push(space);
            }
        }

        newSpaces = removeRedundantSpaces(newSpaces);

        _spaces = untouchedSpaces.concat(newSpaces);
        _spaces.sort(function (a, b) {
            return a.getDistanceToOrigin(ratio.call(this)) - b.getDistanceToOrigin(ratio.call(this));
        });
    };

    this.ratio = function (arg) {
        if (arg.length) {
            if (typeof(arg) === 'function') {
                ratio = arg;
                return this;
            } else {
                ratio = function (d) {
                    return arg;
                };
                return this;
            }
        } else {
            return ratio;
        }
    };

    this.setMinHeight = function(minHeight) {
        _minHeight = minHeight;
        return this;
    };

    this.setMinWidth = function(minWidth) {
        _minWidth = minWidth;
        return this;
    };

    return this;
};

export default ddr_d3_layout_rectangle_packer;
