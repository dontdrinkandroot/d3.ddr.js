import ddr_d3_geometry_point from '../geometry/point';
import ddr_d3_geometry_rectangle from '../geometry/rectangle';
import ddr_d3_geometry_space from '../geometry/space';
import ddr_d3_util_font_metrics_calculator from '../util/fontmetricscalculator';

var ddr_d3_layout_wordcloud = function (words) {

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

    function functor(d) {
        return typeof d === "function" ? d : function() { return d; };
    }

    function fontSize(d) {
        return Math.sqrt(d.size);
    }

    function fontFamily(d) {
        return "sans-serif";
    }

    function fontWeight(d) {
        return "normal";
    }

    function rotate(d, i) {
        return false;
    }

    function marginH(d,i) {
        return d.size / 2;
    }

    function marginV(d,i) {
        return d.size / 4;
    }

    function ratio() {
        return [1, 1];
    }

    function text(d) {
        return d.text;
    }

    function draw(data) {
        throw "You need to define the wordcloud.draw(function(data))";
    }

    this.text = function(args) {
        return arguments.length ? (text = functor(args), this) : text;
    };

    this.fontSize = function(args) {
        return arguments.length ? (fontSize = functor(args), this) : fontSize;
    };

    this.fontWeight = function(args) {
        return arguments.length ? (fontWeight = functor(args), this) : fontWeight;
    };

    this.fontFamily = function(args) {
        return arguments.length ? (fontFamily = functor(args), this) : fontFamily;
    };

    this.marginV = function(args) {
        return arguments.length ? (marginV = functor(args), this) : marginV;
    };

    this.marginH = function(args) {
        return arguments.length ? (marginH = functor(args), this) : marginH;
    };

    this.rotate = function(args) {
        return arguments.length ? (rotate = functor(args), this) : rotate;
    };

    this.ratio = function(args) {
        return arguments.length ? (ratio = functor(args), this) : ratio;
    };

    this.draw = function(args) {
        if (arguments.length == 0) {
            throw "You need to define the wordcloud.draw(function(data))";
        }
        return (draw = functor(args), this);
    };

    this.xPlacement = function() {
        return function (d) {
            return d.boundingBox.getCenter().getX() - (d.originalBoundingBox.getWidth() / 2) - d.originalBoundingBox.getX();
        }
    };

    this.yPlacement = function() {
        return function (d) {
            return d.boundingBox.getCenter().getY() - (d.originalBoundingBox.getHeight() / 2) - d.originalBoundingBox.getY();
        }
    };


    this.familyAccessor = function() {
        return function(d) {
            return d.family;
        }
    };

    this.weightAccessor = function() {
        return function(d) {
            return d.weight;
        }
    };

    this.layout = function(input) {

        var startDate = new Date();

        var data = input.map(function(d, i) {
            d.size = fontSize.call(this, d, i);
            d.family = fontFamily.call(this, d, i);
            d.weight = fontWeight.call(this, d, i);
            d.rotate = rotate.call(this, d, i);
            d.marginV = marginV.call(this, d, i);
            d.marginH = marginH.call(this, d, i);
            d.text = text.call(this, d, i);
            return d;
        }).sort(function(a, b) { return b.size - a.size; });

        /* Init spaces */
        var spaces = [];
        spaces.push(new ddr_d3_geometry_rectangle(-Number.MAX_VALUE / 2, -Number.MAX_VALUE / 2, Number.MAX_VALUE, Number.MAX_VALUE));

        var fontMetricsCalculator = new ddr_d3_util_font_metrics_calculator();

        for (var i = 0; i < data.length; i++) {
            var minHeight = Number.MAX_VALUE;
            var minWidth = Number.MAX_VALUE;
            var word = data[i];
            word.originalBoundingBox = fontMetricsCalculator.getBoundingBoxFromCanvas(word.text, word.size + 'px', word.family, word.weight);
            word.boundingBox = new ddr_d3_geometry_rectangle(0, 0, word.originalBoundingBox.getWidth() + word.marginH, word.originalBoundingBox.getHeight() + word.marginV);
            if (word.rotate) {
                word.boundingBox = new ddr_d3_geometry_rectangle(0, 0, word.originalBoundingBox.getHeight() + word.marginV, word.originalBoundingBox.getWidth() + word.marginH);
            }
            minWidth = Math.min(minWidth, word.boundingBox.getWidth());
            minHeight = Math.min(minHeight, word.boundingBox.getHeight());

            var found = false;
            for (var j = 0; j < spaces.length; j++) {
                var space = spaces[j];
                if (space.getWidth() >= word.boundingBox.getWidth() && space.getHeight() >= word.boundingBox.getHeight()) {
                    word.boundingBox = alignBoundsToSpace(space, word.boundingBox);
                    found = true;
                    break;
                }
            }

            var tempSpaces = [];
            for (j = 0; j < spaces.length; j++) {
                space = spaces[j];
                if (space.intersectsRectangle(word.boundingBox)) {
                    var newSpaces = intersect(space, word.boundingBox);
                    for (var k = 0; k < newSpaces.length; k++) {
                        var newSpace = newSpaces[k];
                        if (newSpace.getWidth() >= minWidth && newSpace.getHeight() >= minHeight) {
                            tempSpaces.push(newSpace);
                        }
                    }
                } else {
                    tempSpaces.push(space);
                }
            }
            spaces = tempSpaces;
            spaces.sort(function (a, b) {
                return a.getDistanceToOrigin(ratio.call(this)) - b.getDistanceToOrigin(ratio.call(this));
            });
        }

        var endDate = new Date();
        console.log('Layouting took ' + (endDate.getMilliseconds() - startDate.getMilliseconds()));

        draw.call(this, data);
    };
};

export default ddr_d3_layout_wordcloud;
