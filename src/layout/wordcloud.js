import ddr_d3_geometry_point from '../geometry/point';
import ddr_d3_geometry_rectangle from '../geometry/rectangle';
import ddr_d3_geometry_space from '../geometry/space';

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

    function wordSize(d) {
        return Math.sqrt(d.size);
    }

    function wordFontFamily(d) {
        return "sans-serif";
    }

    function wordFontWeight(d) {
        return "normal";
    }

    function wordText(d) {
        return d.text;
    }

    function draw(data) {
        console.log(data);
    }

    this.text = function(args) {
        return arguments.length ? (wordText = functor(args), this) : wordText;
    };

    this.size = function(args) {
        return arguments.length ? (wordSize = functor(args), this) : wordSize;
    };

    this.weight = function(args) {
        return arguments.length ? (wordFontWeight = functor(args), this) : wordFontWeight;
    };

    this.family = function(args) {
        return arguments.length ? (wordFontFamily = functor(args), this) : wordFontFamily;
    };

    this.draw = function(args) {
        if (arguments.length == 0) {
            throw "You need to define the wordcloud.draw(function(data))";
        }
        return (draw = functor(args), this);
    };


    this.layout = function(input) {

        var startDate = new Date();

        console.log(input);
        var data = input.map(function(d, i) {
            d.size = wordSize.call(this, d, i);
            d.family = wordFontFamily.call(this, d, i);
            d.weight = wordFontWeight.call(this, d, i);
            d.text = wordText.call(this, d, i);
            return d;
        }).sort(function(a, b) { return b.size - a.size; });
        console.log(data);

        var drawingBox = d3.select('body').append('svg');

        /* Init spaces */
        var spaces = [];
        spaces.push(new ddr_d3_geometry_rectangle(-Number.MAX_VALUE / 2, -Number.MAX_VALUE / 2, Number.MAX_VALUE, Number.MAX_VALUE));

        for (var i = 0; i < data.length; i++) {
            var minHeight = Number.MAX_VALUE;
            var minWidth = Number.MAX_VALUE;
            var word = data[i];
            var wordElement = drawingBox.append("text")
                .attr("x", 0)
                .attr("y", 0)
                .style('font-family', word.family)
                .style('font-weight', word.weight)
                .style('font-size', word.size + 'px')
                .text(word.text);
            var bbox = wordElement.node().getBBox();
            word.originalBoundingBox = new ddr_d3_geometry_rectangle(bbox.x, bbox.y, bbox.width, bbox.height);
            word.boundingBox = new ddr_d3_geometry_rectangle(0, 0, word.originalBoundingBox.getWidth(), word.originalBoundingBox.getHeight());
            if (i % 2 == 1) {
                console.log('rotate');
                word.boundingBox = new ddr_d3_geometry_rectangle(0, 0, word.originalBoundingBox.getHeight(), word.originalBoundingBox.getWidth());
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
                return a.getDistanceToOrigin() - b.getDistanceToOrigin();
            });
        }

        drawingBox.remove();

        var endDate = new Date();
        console.log('Layouting took ' + (endDate.getMilliseconds() - startDate.getMilliseconds()));

        draw.call(this, data);
    };

    return;

    var element = d3.select('body');
    var width = element[0][0].offsetWidth;

    var svg = element.append("svg");
    var overallBounds = new ddr_d3_geometry_rectangle(0, 0, 0, 0);

    var wordElements = [];

    var spaces = [];
    spaces.push(new ddr_d3_geometry_rectangle(-Number.MAX_VALUE / 2, -Number.MAX_VALUE / 2, Number.MAX_VALUE, Number.MAX_VALUE));

    var container = svg.append('g');


    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        var wordElement = container.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .style('font-family', '"Ubuntu Mono",monospace')
            .style('font-size', word.size + 'px')
            .style('font-weight', word.weight)
            .style('fill', 'black')
            .text(word.text.toUpperCase());
        //.attr('transform', 'rotate(90)');

        var bbox = wordElement.node().getBBox();
        //console.log('bbox', bbox);

        //word.normalizationFactor = Math.sqrt(3000 / (bbox.width * bbox.height));

        //wordElement.style('font-size', (20 * word.normalizationFactor) + 'px');

        bbox = wordElement.node().getBBox();
        word.originalBoundingBox = new ddr_d3_geometry_rectangle(bbox.x, bbox.y, bbox.width, bbox.height);


        var found = false;
        for (var j = 0; j < spaces.length; j++) {
            var space = spaces[j];
            if (space.getWidth() >= word.boundingBox.getWidth() && space.getHeight() >= word.boundingBox.getHeight()) {
                word.boundingBox = alignBoundsToSpace(space, word.boundingBox);
                overallBounds.merge(word.boundingBox);
                found = true;
                break;
            }
        }

        if (!found) {
            throw 'No Space Found' + word.boundingBox.toString()
        }

        wordElement.attr('transform', 'translate(' + (word.boundingBox.getLeftX() - word.originalBoundingBox.getLeftX() + (word.size / 4)) + ',' + (word.boundingBox.getTopY() - word.originalBoundingBox.getTopY()) + ')');

        var tempSpaces = [];

        for (j = 0; j < spaces.length; j++) {
            space = spaces[j];
            if (space.intersectsRectangle(word.boundingBox)) {
                var newSpaces = intersect(space, word.boundingBox);
                for (var k = 0; k < newSpaces.length; k++) {
                    var newSpace = newSpaces[k];
                    if (newSpace.getWidth() >= 10 && newSpace.getHeight() >= 10) {
                        tempSpaces.push(newSpace);
                    }
                }
            } else {
                tempSpaces.push(space);
            }
        }


        spaces = tempSpaces;
        spaces.sort(function (a, b) {
            return a.getDistanceToOrigin() - b.getDistanceToOrigin();
        });
        //console.log('Recomputed spaces', spaces);

        /*container.append('rect')
         .attr('x', word.boundingBox.getX())
         .attr('y', word.boundingBox.getY())
         .attr('width', word.boundingBox.getWidth())
         .attr('height', word.boundingBox.getHeight())
         .attr('stroke', 'green')
         .attr('fill', 'none');*/

        wordElements.push(wordElement);
    }

    /*container.append('rect')
     .attr('x', overallBounds.getX())
     .attr('y', overallBounds.getY())
     .attr('width', overallBounds.getWidth())
     .attr('height', overallBounds.getHeight())
     .attr('stroke', 'red')
     .attr('fill', 'none');

     container.append('circle')
     .attr('cx', overallBounds.getCenter().getX())
     .attr('cy', overallBounds.getCenter().getY())
     .attr('r', 5)
     .attr('stroke', 'red');*/

    //console.log('Overall Bounds', overallBounds.toString());

    var scaleFactor = width / overallBounds.getWidth();
    //console.log('Scale Factor', scaleFactor);

    var height = overallBounds.getHeight() * scaleFactor;

    svg
        .attr('width', width)
        .attr('height', height);

    svg.attr('viewBox', overallBounds.getX() + ' ' + overallBounds.getY() + ' ' + overallBounds.getWidth() + ' ' + overallBounds.getHeight());


};

export default ddr_d3_layout_wordcloud;
