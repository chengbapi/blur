Blur = function(image, n, method) {
    var width = image.width;
    var height = image.height;

    //count = 0;

    if (width * height > 150 * 150) {
        if (width > height) {
            width = 150;
            height = Math.ceil(height * (200 / image.width));
        } else {
            height = 150;
            width = Math.ceil(width * (200 / image.height));
        }
    }

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);

    var imageData = ctx.getImageData(0, 0 , width, height);
    var originData = imageData.data;
    var tempData = Array.prototype.slice(originData, 0);

    var blurFuncs = {
        Linear : Linear
    };

    var blurFunc = Linear;

    var Enum = {};

    calculate(n);

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            blur(x, y);
        }
    }

    for (var i = 0; i < tempData.length; i++) {
        imageData.data[i] = tempData[i];
    }

    canvas.getContext('2d').putImageData(imageData, 0 , 0);

    var _canvas = document.createElement('canvas');
    _canvas.width = image.width;
    _canvas.height = image.height;
    _canvas.getContext('2d').drawImage(canvas, 0, 0, _canvas.width, _canvas.height);
    return _canvas.toDataURL();

    function blur(x, y) {
        var currPoint = getPoint(x, y);
        var point;
        var dx, dy;
        var distanceSquare, p;

        var r, g ,b ,a;
        r = g = b = a = 0;
        for (dy = -n + 1; dy < n; dy++) {
            for (dx = -n + 1; dx < n; dx++) {

                distanceSquare = dx * dx + dy * dy;
                p = Enum[distanceSquare];

                point = getPoint(x, y, dx, dy);
                r += originData[point] * p;
                g += originData[point + 1] * p;
                b += originData[point + 2] * p;
                a += originData[point + 3] * p;
            }
        }

        tempData[currPoint] = r;
        tempData[currPoint + 1] = g;
        tempData[currPoint + 2] = b;
        tempData[currPoint + 3] = a;
    }


    function getPoint(x, y, dx, dy) {
        dx = dx || 0;
        dy = dy || 0;
        x = x + dx;
        y = y + dy;
        while (x < 0) x++;
        while (x >= width) x--;
        while (y < 0) y++;
        while (y >= height) y--;

        return x * 4 + y * width * 4;
    }


    function calculate(n) {
        var i, j;
        var tempEnum = {};
        var total = 0;

        for (i = -n + 1; i < n; i++) {
            for (j = -n + 1; j < n; j++) {
                var distanceSquare = i * i + j * j;
                if (tempEnum[distanceSquare]) {
                    tempEnum[distanceSquare].sum += blurFunc(distanceSquare);
                    tempEnum[distanceSquare].count++;
                } else {
                    tempEnum[distanceSquare] = { sum: blurFunc(distanceSquare), count :1 };
                }
            }
        }

        var keys = Object.keys(tempEnum);
        for (i = 0; i < keys.length; i++) {
            total += tempEnum[keys[i]].sum;
        }
        for (i = 0; i < keys.length; i++) {
            Enum[keys[i]] = tempEnum[keys[i]].sum / (total * tempEnum[keys[i]].count);
        }
    }

    function Linear(distanceSquare) {
        var x = Math.sqrt(distanceSquare) / (n + 1);
        return 1 - x;
    }

    //function no(distanceSquare) {
        //var x = Math.sqrt(distanceSquare) / (n + 1);
        //return 1;
    //}
};
