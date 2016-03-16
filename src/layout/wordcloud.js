Ddr.Wordcloud = function (words) {

    /**
     * @param {Ddr.Space} space
     * @param {Ddr.Rectangle} rect
     * @returns {Ddr.Rectangle}
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

        return new Ddr.Rectangle(x, y, rect.getWidth(), rect.getHeight());
    }

    /**
     * @param {Ddr.Space} space
     * @param {Ddr.Rectangle} rect
     */
    function intersect(space, rect) {
        var newSpaces = [];

        /* Left cut */
        if (rect.getX() > space.getLeftX()) {
            var left = new Ddr.Space(
                new Ddr.Point(space.getLeftX(),
                    space.getTopY()),
                new Ddr.Point(rect.getX(),
                    space.getBottomY())
            );
            newSpaces.push(left);
        }

        /* Right cut */
        if (rect.getRightX() < space.getRightX()) {
            var right = new Ddr.Space(
                new Ddr.Point(rect.getRightX(),
                    space.getTopY()),
                new Ddr.Point(space.getRightX(),
                    space.getBottomY())
            );
            newSpaces.push(right);
        }

        /* Top cut */
        if (rect.getY() > space.getTopY()) {
            var top = new Ddr.Space(
                new Ddr.Point(space.getLeftX(),
                    space.getTopY()),
                new Ddr.Point(space.getRightX(),
                    rect.getY())
            );
            newSpaces.push(top);
        }

        /* Bottom cut */
        if (rect.getBottomY() < space.getBottomY()) {
            var bottom = new Ddr.Space(
                new Ddr.Point(space.getLeftX(),
                    rect.getBottomY()),
                new Ddr.Point(space.getRightX(),
                    space.getBottomY())
            );
            newSpaces.push(bottom);
        }

        return newSpaces;
    }

    //words = words.splice(0, 3);

    var width = $('.cloud').width();

    var svg = d3.select(".cloud").append("svg");
    var overallBounds = new Ddr.Rectangle(0, 0, 0, 0);

    var wordElements = [];

    var spaces = [];
    spaces.push(new Ddr.Rectangle(-Number.MAX_VALUE / 2, -Number.MAX_VALUE / 2, Number.MAX_VALUE, Number.MAX_VALUE));

    var container = svg.append('g');


    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        var wordElement = container.append("text")
            .attr("x", 0)
            .attr("y", 0)
            .style('font-family', '"Ubuntu Mono",monospace')
            .style('font-size', word.size + 'px')
            .style('fill', 'white')
            .text(word.text.toUpperCase());
        //.attr('transform', 'rotate(90)');

        var bbox = wordElement.node().getBBox();
        //console.log('bbox', bbox);

        //word.normalizationFactor = Math.sqrt(3000 / (bbox.width * bbox.height));

        //wordElement.style('font-size', (20 * word.normalizationFactor) + 'px');

        bbox = wordElement.node().getBBox();
        word.originalBoundingBox = new Ddr.Rectangle(bbox.x, bbox.y, bbox.width, bbox.height);
        word.boundingBox = new Ddr.Rectangle(bbox.x, bbox.y, bbox.width + (word.size / 2), bbox.height);

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
