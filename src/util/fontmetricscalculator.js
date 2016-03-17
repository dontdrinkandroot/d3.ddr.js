import ddr_d3_geometry_rectangle from '../geometry/rectangle';

var ddr_d3_util_font_metrics_calculator = function() {

    var _canvas;
    var _context;
    var _svg;
    var _scanStartX = -100;
    var _scanStartY = -100;
    var _scanWidth = 1600;
    var _scanHeight = 300;

    function drawCircle(context, x, y, r, fill, stroke) {
        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI, false);
        if (null !== fill) {
            context.fillStyle = fill;
            context.fill();
        }
        context.lineWidth = 1;
        if (null !== stroke) {
            context.strokeStyle = stroke;
            context.stroke();
        }
    }

    function getContext() {
        if (undefined === _context) {
            createContext();
        }
        return _context;
    }

    function createContext() {
        _canvas = document.createElement("canvas");
        _canvas.width = _scanWidth;
        _canvas.height = _scanHeight;
        _context = _canvas.getContext("2d");
    }

    this.setContext = function(context) {
      _context = context;
    };

    /**
     * @param {string} text
     * @param {size} size
     * @param {string} fontFamily
     * @param {string} style
     * @return {ddr_d3_geometry_rectangle}
     */
    this.getBoundingBoxFromCanvas = function(text, size, fontFamily, style) {

        var context = getContext();

        context.translate(-_scanStartX, -_scanStartY);

        context.fillStyle = 'white';
        context.fillRect(_scanStartX, _scanStartY, _scanWidth, _scanHeight);

        context.fillStyle = 'red';
        context.font = style + ' ' + size + ' ' + fontFamily;
        context.fillText(text, 0, 0);

        var imageData = context.getImageData(_scanStartX, _scanStartY, _scanWidth, _scanHeight);

        var minX = Number.MAX_VALUE;
        var minY = Number.MAX_VALUE;
        var maxX = -Number.MAX_VALUE;
        var maxY = -Number.MAX_VALUE;

        for (var y = 0; y < _scanHeight; y++) {
            for (var x = 0; x < _scanWidth; x++) {
                var offset= (y * _scanWidth * 4) + (x * 4);
                var idx = offset;
                var red = imageData.data[idx];
                idx = offset + 1;
                var green = imageData.data[idx];
                idx = offset + 2;
                var blue = imageData.data[idx];
                idx = offset + 3;
                var alpha = imageData.data[idx];
                if (red == 255 && green != 255 && blue != 255) {

                    var actualX = x + _scanStartX;
                    var actualY = y + _scanStartY;

                    if (minX > actualX) {
                        minX = actualX;
                        //console.log(actualX, actualY);
                    }

                    if (minY > actualY) {
                        minY = actualY;
                        //console.log(actualX, actualY);
                    }

                    if (maxX < actualX) {
                        maxX = actualX;
                        //console.log(actualX, actualY);
                    }

                    if (maxY < actualY) {
                        maxY = actualY;
                        //console.log(actualX, actualY);
                    }

                    //console.log(x + scanStartX, y + scanStartY, red, green, blue, alpha);
                }
            }
        }

        //context.strokeStyle = 'blue';
        //context.strokeRect(_scanStartX, _scanStartY, _scanWidth, _scanHeight);

        //context.strokeStyle = 'green';
        //context.strokeRect(minX + _scanStartX, minY + _scanStartY, maxX - minX, maxY - minY);

        context.translate(_scanStartX, _scanStartY);

        return new ddr_d3_geometry_rectangle(minX + _scanStartX, minY + _scanStartY, maxX - minX, maxY - minY);
    };
    
    function createSvg() {

    }

    function destroyCanvas() {
    }

    function destroySvg() {
    }

};

export default ddr_d3_util_font_metrics_calculator;
