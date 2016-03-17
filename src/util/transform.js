var ddr_d3_util_transform = function() {
  var _transformString = '';

  this.translate = function(x, y) {
    var translateString = 'translate(';
    translateString += x;
    if (y !== undefined) {
      translateString += ' ' + y
    }
    translateString += ')';
    _transformString += translateString;

    return this;
  };

  this.rotate = function(alpha, x, y) {
    var rotateString = 'rotate(';
    rotateString += alpha;
    if (x !== undefined) {
      rotateString += ' ' + x;
    }
    if (y !== undefined) {
      rotateString += ' ' + y;
    }
    rotateString += ')';
    _transformString += rotateString;

    return this;
  }

  this.getTransformString = function() {
    return _transformString;
  }

  return this;
};
ddr_d3_util_transform.prototype.toString = function() {
  return this.getTransformString();
};

export default ddr_d3_util_transform;
