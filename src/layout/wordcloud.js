import ddr_d3_geometry_point from '../geometry/point';
import ddr_d3_geometry_rectangle from '../geometry/rectangle';
import ddr_d3_geometry_space from '../geometry/space';
import ddr_d3_util_font_metrics_calculator from '../util/fontmetricscalculator';
import ddr_d3_layout_rectangle_packer from './rectanglepacker';

var ddr_d3_layout_wordcloud = function (words) {

    function functor(d) {
        return typeof d === "function" ? d : function () {
            return d;
        };
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

    function margin(d, i) {
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

    this.text = function (args) {
        return arguments.length ? (text = functor(args), this) : text;
    };

    this.fontSize = function (args) {
        return arguments.length ? (fontSize = functor(args), this) : fontSize;
    };

    this.fontWeight = function (args) {
        return arguments.length ? (fontWeight = functor(args), this) : fontWeight;
    };

    this.fontFamily = function (args) {
        return arguments.length ? (fontFamily = functor(args), this) : fontFamily;
    };

    this.margin = function (args) {
        return arguments.length ? (margin = functor(args), this) : margin;
    };

    this.rotate = function (args) {
        return arguments.length ? (rotate = functor(args), this) : rotate;
    };

    this.ratio = function (args) {
        return arguments.length ? (ratio = functor(args), this) : ratio;
    };

    this.draw = function (args) {
        if (arguments.length == 0) {
            throw "You need to define the wordcloud.draw(function(data))";
        }
        return (draw = functor(args), this);
    };

    this.xPlacement = function () {
        return function (d) {
            return d.boundingBox.getCenter().getX() - (d.originalBoundingBox.getWidth() / 2) - d.originalBoundingBox.getX();
        }
    };

    this.yPlacement = function () {
        return function (d) {
            return d.boundingBox.getCenter().getY() - (d.originalBoundingBox.getHeight() / 2) - d.originalBoundingBox.getY();
        }
    };


    this.familyAccessor = function () {
        return function (d) {
            return d.family;
        }
    };

    this.weightAccessor = function () {
        return function (d) {
            return d.weight;
        }
    };

    this.layout = function (input) {

        var startTime = Date.now();

        var fontMetricsCalculator = new ddr_d3_util_font_metrics_calculator();

        var minWidth = Number.MAX_VALUE;
        var minHeight = Number.MAX_VALUE;
        var data = input.map(function (d, i) {
            d.size = fontSize.call(this, d, i);
            d.family = fontFamily.call(this, d, i);
            d.weight = fontWeight.call(this, d, i);
            d.rotate = rotate.call(this, d, i);
            d.margin = margin.call(this, d, i);
            d.text = text.call(this, d, i);
            d.originalBoundingBox = fontMetricsCalculator.getBoundingBoxFromCanvas(d.text, d.size + 'px', d.family, d.weight);
            //d.boundingBox = new ddr_d3_geometry_rectangle(0, 0, d.originalBoundingBox.getWidth() + d.marginH, d.originalBoundingBox.getHeight() + d.marginV);
            d.boundingBox = new ddr_d3_geometry_rectangle(0, 0, d.originalBoundingBox.getWidth(), d.originalBoundingBox.getHeight());
            if (d.rotate) {
                //d.boundingBox = new ddr_d3_geometry_rectangle(0, 0, d.originalBoundingBox.getHeight() + d.marginV, d.originalBoundingBox.getWidth() + d.marginH);
                d.boundingBox = new ddr_d3_geometry_rectangle(0, 0, d.originalBoundingBox.getHeight(), d.originalBoundingBox.getWidth());
            }
            return d;
        }).sort(function (a, b) {
            minWidth = Math.min(minWidth, a.boundingBox.getWidth(), b.boundingBox.getWidth());
            minHeight = Math.min(minHeight, a.boundingBox.getHeight(), b.boundingBox.getHeight());
            return b.size - a.size;
        });

        var rectanglePacker = new ddr_d3_layout_rectangle_packer();
        rectanglePacker.setMinWidth(minWidth).setMinHeight(minHeight).ratio(ratio.call(this));

        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            var rect = rectanglePacker.findPosition(d.boundingBox);
            /* Apply margin before placing */
            rect.setX(rect.getX() - d.margin).setY(rect.getY() - d.margin).setWidth(rect.getWidth() + 2 * d.margin).setHeight(rect.getHeight() + 2 * d.margin);
            rectanglePacker.place(rect);
            d.boundingBox = rect;
        }

        draw.call(this, data);
    };
};

export default ddr_d3_layout_wordcloud;
