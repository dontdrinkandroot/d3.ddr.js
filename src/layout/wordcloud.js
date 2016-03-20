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

    function marginH(d, i) {
        return d.size / 2;
    }

    function marginV(d, i) {
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

    this.marginV = function (args) {
        return arguments.length ? (marginV = functor(args), this) : marginV;
    };

    this.marginH = function (args) {
        return arguments.length ? (marginH = functor(args), this) : marginH;
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

        var data = input.map(function (d, i) {
            d.size = fontSize.call(this, d, i);
            d.family = fontFamily.call(this, d, i);
            d.weight = fontWeight.call(this, d, i);
            d.rotate = rotate.call(this, d, i);
            d.marginV = marginV.call(this, d, i);
            d.marginH = marginH.call(this, d, i);
            d.text = text.call(this, d, i);
            d.originalBoundingBox = fontMetricsCalculator.getBoundingBoxFromCanvas(d.text, d.size + 'px', d.family, d.weight);
            d.boundingBox = new ddr_d3_geometry_rectangle(0, 0, d.originalBoundingBox.getWidth() + d.marginH, d.originalBoundingBox.getHeight() + d.marginV);
            if (d.rotate) {
                d.boundingBox = new ddr_d3_geometry_rectangle(0, 0, d.originalBoundingBox.getHeight() + d.marginV, d.originalBoundingBox.getWidth() + d.marginH);
            }
            return d;
        }).sort(function (a, b) {
            return b.size - a.size;
        });

        var rectanglePacker = new ddr_d3_layout_rectangle_packer()
            .getRectangle(function (d) {
                return d.boundingBox
            })
            .setRectangle(function (d, rect) {
                d.boundingBox = rect
            })
            .ratio(ratio.call(this))
            .pack(data);

        draw.call(this, data);
    };
};

export default ddr_d3_layout_wordcloud;
