(function() {

    var JC = window.JC || {};

    JC.supportWebgl = (function() {
        try {
            var canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    })();

    JC.Math = {

        generateUUID: function() {

            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = new Array(36);
            var rnd = 0,
                r;

            return function() {

                for (var i = 0; i < 36; i++) {

                    if (i === 8 || i === 13 || i === 18 || i === 23) {

                        uuid[i] = '-';

                    } else if (i === 14) {

                        uuid[i] = '4';

                    } else {

                        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                        r = rnd & 0xf;
                        rnd = rnd >> 4;
                        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];

                    }

                }

                return uuid.join('');

            };

        }(),

        clamp: function(value, min, max) {

            return Math.max(min, Math.min(max, value));

        },

        // compute euclidian modulo of m % n
        // https://en.wikipedia.org/wiki/Modulo_operation

        euclideanModulo: function(n, m) {

            return ((n % m) + m) % m;

        },

        // Linear mapping from range <a1, a2> to range <b1, b2>

        mapLinear: function(x, a1, a2, b1, b2) {

            return b1 + (x - a1) * (b2 - b1) / (a2 - a1);

        },

        // http://en.wikipedia.org/wiki/Smoothstep

        smoothstep: function(x, min, max) {

            if (x <= min) return 0;
            if (x >= max) return 1;

            x = (x - min) / (max - min);

            return x * x * (3 - 2 * x);

        },

        smootherstep: function(x, min, max) {

            if (x <= min) return 0;
            if (x >= max) return 1;

            x = (x - min) / (max - min);

            return x * x * x * (x * (x * 6 - 15) + 10);

        },

        random16: function() {

            console.warn('JC.Math.random16() has been deprecated. Use Math.random() instead.');
            return Math.random();

        },

        // Random integer from <low, high> interval

        randInt: function(low, high) {

            return low + Math.floor(Math.random() * (high - low + 1));

        },

        // Random float from <low, high> interval

        randFloat: function(low, high) {

            return low + Math.random() * (high - low);

        },

        // Random float from <-range/2, range/2> interval

        randFloatSpread: function(range) {

            return range * (0.5 - Math.random());

        },

        degToRad: function() {

            var degreeToRadiansFactor = Math.PI / 180;

            return function(degrees) {

                return degrees * degreeToRadiansFactor;

            };

        }(),

        radToDeg: function() {

            var radianToDegreesFactor = 180 / Math.PI;

            return function(radians) {

                return radians * radianToDegreesFactor;

            };

        }(),

        isPowerOfTwo: function(value) {

            return (value & (value - 1)) === 0 && value !== 0;

        },

        nearestPowerOfTwo: function(value) {

            return Math.pow(2, Math.round(Math.log(value) / Math.LN2));

        },

        nextPowerOfTwo: function(value) {

            value--;
            value |= value >> 1;
            value |= value >> 2;
            value |= value >> 4;
            value |= value >> 8;
            value |= value >> 16;
            value++;

            return value;

        }

    };




    JC.Vector3 = function(x, y, z) {

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;

    };

    JC.Vector3.prototype = {

        constructor: JC.Vector3,

        set: function(x, y, z) {

            this.x = x;
            this.y = y;
            this.z = z;

            return this;

        },

        setScalar: function(scalar) {

            this.x = scalar;
            this.y = scalar;
            this.z = scalar;

            return this;

        },

        setX: function(x) {

            this.x = x;

            return this;

        },

        setY: function(y) {

            this.y = y;

            return this;

        },

        setZ: function(z) {

            this.z = z;

            return this;

        },

        setComponent: function(index, value) {

            switch (index) {

                case 0:
                    this.x = value;
                    break;
                case 1:
                    this.y = value;
                    break;
                case 2:
                    this.z = value;
                    break;
                default:
                    throw new Error('index is out of range: ' + index);

            }

        },

        getComponent: function(index) {

            switch (index) {

                case 0:
                    return this.x;
                case 1:
                    return this.y;
                case 2:
                    return this.z;
                default:
                    throw new Error('index is out of range: ' + index);

            }

        },

        clone: function() {

            return new this.constructor(this.x, this.y, this.z);

        },

        copy: function(v) {

            this.x = v.x;
            this.y = v.y;
            this.z = v.z;

            return this;

        },

        add: function(v, w) {

            if (w !== undefined) {

                console.warn('JC.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
                return this.addVectors(v, w);

            }

            this.x += v.x;
            this.y += v.y;
            this.z += v.z;

            return this;

        },

        addScalar: function(s) {

            this.x += s;
            this.y += s;
            this.z += s;

            return this;

        },

        addVectors: function(a, b) {

            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;

            return this;

        },

        addScaledVector: function(v, s) {

            this.x += v.x * s;
            this.y += v.y * s;
            this.z += v.z * s;

            return this;

        },

        sub: function(v, w) {

            if (w !== undefined) {

                console.warn('JC.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
                return this.subVectors(v, w);

            }

            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;

            return this;

        },

        subScalar: function(s) {

            this.x -= s;
            this.y -= s;
            this.z -= s;

            return this;

        },

        subVectors: function(a, b) {

            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;

            return this;

        },

        multiply: function(v, w) {

            if (w !== undefined) {

                console.warn('JC.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.');
                return this.multiplyVectors(v, w);

            }

            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;

            return this;

        },

        multiplyScalar: function(scalar) {

            if (isFinite(scalar)) {

                this.x *= scalar;
                this.y *= scalar;
                this.z *= scalar;

            } else {

                this.x = 0;
                this.y = 0;
                this.z = 0;

            }

            return this;

        },

        multiplyVectors: function(a, b) {

            this.x = a.x * b.x;
            this.y = a.y * b.y;
            this.z = a.z * b.z;

            return this;

        },

        applyEuler: function() {

            var quaternion;

            return function applyEuler(euler) {

                if (euler instanceof JC.Euler === false) {

                    console.error('JC.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.');

                }

                if (quaternion === undefined) quaternion = new JC.Quaternion();

                this.applyQuaternion(quaternion.setFromEuler(euler));

                return this;

            };

        }(),

        applyAxisAngle: function() {

            var quaternion;

            return function applyAxisAngle(axis, angle) {

                if (quaternion === undefined) quaternion = new JC.Quaternion();

                this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));

                return this;

            };

        }(),

        applyMatrix3: function(m) {

            var x = this.x;
            var y = this.y;
            var z = this.z;

            var e = m.elements;

            this.x = e[0] * x + e[3] * y + e[6] * z;
            this.y = e[1] * x + e[4] * y + e[7] * z;
            this.z = e[2] * x + e[5] * y + e[8] * z;

            return this;

        },

        applyMatrix4: function(m) {

            // input: JC.Matrix4 affine matrix

            var x = this.x,
                y = this.y,
                z = this.z;

            var e = m.elements;

            this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
            this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
            this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

            return this;

        },

        applyProjection: function(m) {

            // input: JC.Matrix4 projection matrix

            var x = this.x,
                y = this.y,
                z = this.z;

            var e = m.elements;
            var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide

            this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
            this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
            this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;

            return this;

        },

        applyQuaternion: function(q) {

            var x = this.x;
            var y = this.y;
            var z = this.z;

            var qx = q.x;
            var qy = q.y;
            var qz = q.z;
            var qw = q.w;

            // calculate quat * vector

            var ix = qw * x + qy * z - qz * y;
            var iy = qw * y + qz * x - qx * z;
            var iz = qw * z + qx * y - qy * x;
            var iw = -qx * x - qy * y - qz * z;

            // calculate result * inverse quat

            this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

            return this;

        },

        project: function() {

            var matrix;

            return function project(camera) {

                if (matrix === undefined) matrix = new JC.Matrix4();

                matrix.multiplyMatrices(camera.projectionMatrix, matrix.getInverse(camera.matrixWorld));
                return this.applyProjection(matrix);

            };

        }(),

        unproject: function() {

            var matrix;

            return function unproject(camera) {

                if (matrix === undefined) matrix = new JC.Matrix4();

                matrix.multiplyMatrices(camera.matrixWorld, matrix.getInverse(camera.projectionMatrix));
                return this.applyProjection(matrix);

            };

        }(),

        transformDirection: function(m) {

            // input: JC.Matrix4 affine matrix
            // vector interpreted as a direction

            var x = this.x,
                y = this.y,
                z = this.z;

            var e = m.elements;

            this.x = e[0] * x + e[4] * y + e[8] * z;
            this.y = e[1] * x + e[5] * y + e[9] * z;
            this.z = e[2] * x + e[6] * y + e[10] * z;

            this.normalize();

            return this;

        },

        divide: function(v) {

            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z;

            return this;

        },

        divideScalar: function(scalar) {

            return this.multiplyScalar(1 / scalar);

        },

        min: function(v) {

            this.x = Math.min(this.x, v.x);
            this.y = Math.min(this.y, v.y);
            this.z = Math.min(this.z, v.z);

            return this;

        },

        max: function(v) {

            this.x = Math.max(this.x, v.x);
            this.y = Math.max(this.y, v.y);
            this.z = Math.max(this.z, v.z);

            return this;

        },

        clamp: function(min, max) {

            // This function assumes min < max, if this assumption isn't true it will not operate correctly

            this.x = Math.max(min.x, Math.min(max.x, this.x));
            this.y = Math.max(min.y, Math.min(max.y, this.y));
            this.z = Math.max(min.z, Math.min(max.z, this.z));

            return this;

        },

        clampScalar: function() {

            var min, max;

            return function clampScalar(minVal, maxVal) {

                if (min === undefined) {

                    min = new JC.Vector3();
                    max = new JC.Vector3();

                }

                min.set(minVal, minVal, minVal);
                max.set(maxVal, maxVal, maxVal);

                return this.clamp(min, max);

            };

        }(),

        clampLength: function(min, max) {

            var length = this.length();

            this.multiplyScalar(Math.max(min, Math.min(max, length)) / length);

            return this;

        },

        floor: function() {

            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            this.z = Math.floor(this.z);

            return this;

        },

        ceil: function() {

            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            this.z = Math.ceil(this.z);

            return this;

        },

        round: function() {

            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            this.z = Math.round(this.z);

            return this;

        },

        roundToZero: function() {

            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
            this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);

            return this;

        },

        negate: function() {

            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;

            return this;

        },

        dot: function(v) {

            return this.x * v.x + this.y * v.y + this.z * v.z;

        },

        lengthSq: function() {

            return this.x * this.x + this.y * this.y + this.z * this.z;

        },

        length: function() {

            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

        },

        lengthManhattan: function() {

            return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);

        },

        normalize: function() {

            return this.divideScalar(this.length());

        },

        setLength: function(length) {

            return this.multiplyScalar(length / this.length());

        },

        lerp: function(v, alpha) {

            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            this.z += (v.z - this.z) * alpha;

            return this;

        },

        lerpVectors: function(v1, v2, alpha) {

            this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

            return this;

        },

        cross: function(v, w) {

            if (w !== undefined) {

                console.warn('JC.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.');
                return this.crossVectors(v, w);

            }

            var x = this.x,
                y = this.y,
                z = this.z;

            this.x = y * v.z - z * v.y;
            this.y = z * v.x - x * v.z;
            this.z = x * v.y - y * v.x;

            return this;

        },

        crossVectors: function(a, b) {

            var ax = a.x,
                ay = a.y,
                az = a.z;
            var bx = b.x,
                by = b.y,
                bz = b.z;

            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;

            return this;

        },

        projectOnVector: function() {

            var v1, dot;

            return function projectOnVector(vector) {

                if (v1 === undefined) v1 = new JC.Vector3();

                v1.copy(vector).normalize();

                dot = this.dot(v1);

                return this.copy(v1).multiplyScalar(dot);

            };

        }(),

        projectOnPlane: function() {

            var v1;

            return function projectOnPlane(planeNormal) {

                if (v1 === undefined) v1 = new JC.Vector3();

                v1.copy(this).projectOnVector(planeNormal);

                return this.sub(v1);

            };

        }(),

        reflect: function() {

            // reflect incident vector off plane orthogonal to normal
            // normal is assumed to have unit length

            var v1;

            return function reflect(normal) {

                if (v1 === undefined) v1 = new JC.Vector3();

                return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));

            };

        }(),

        angleTo: function(v) {

            var theta = this.dot(v) / (Math.sqrt(this.lengthSq() * v.lengthSq()));

            // clamp, to handle numerical problems

            return Math.acos(JC.Math.clamp(theta, -1, 1));

        },

        distanceTo: function(v) {

            return Math.sqrt(this.distanceToSquared(v));

        },

        distanceToSquared: function(v) {

            var dx = this.x - v.x;
            var dy = this.y - v.y;
            var dz = this.z - v.z;

            return dx * dx + dy * dy + dz * dz;

        },

        setFromSpherical: function(s) {

            var sinPhiRadius = Math.sin(s.phi) * s.radius;

            this.x = sinPhiRadius * Math.sin(s.theta);
            this.y = Math.cos(s.phi) * s.radius;
            this.z = sinPhiRadius * Math.cos(s.theta);

            return this;

        },

        setFromMatrixPosition: function(m) {

            return this.setFromMatrixColumn(m, 3);

        },

        setFromMatrixScale: function(m) {

            var sx = this.setFromMatrixColumn(m, 0).length();
            var sy = this.setFromMatrixColumn(m, 1).length();
            var sz = this.setFromMatrixColumn(m, 2).length();

            this.x = sx;
            this.y = sy;
            this.z = sz;

            return this;

        },

        setFromMatrixColumn: function(m, index) {

            if (typeof m === 'number') {

                console.warn('JC.Vector3: setFromMatrixColumn now expects ( matrix, index ).');

                m = arguments[1];
                index = arguments[0];

            }

            return this.fromArray(m.elements, index * 4);

        },

        equals: function(v) {

            return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));

        },

        fromArray: function(array, offset) {

            if (offset === undefined) offset = 0;

            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];

            return this;

        },

        toArray: function(array, offset) {

            if (array === undefined) array = [];
            if (offset === undefined) offset = 0;

            array[offset] = this.x;
            array[offset + 1] = this.y;
            array[offset + 2] = this.z;

            return array;

        },

        fromAttribute: function(attribute, index, offset) {

            if (offset === undefined) offset = 0;

            index = index * attribute.itemSize + offset;

            this.x = attribute.array[index];
            this.y = attribute.array[index + 1];
            this.z = attribute.array[index + 2];

            return this;

        }

    };


    JC.Quaternion = function(x, y, z, w) {

        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._w = (w !== undefined) ? w : 1;

    };

    JC.Quaternion.prototype = {

        constructor: JC.Quaternion,

        get x() {

            return this._x;

        },

        set x(value) {

            this._x = value;
            this.onChangeCallback();

        },

        get y() {

            return this._y;

        },

        set y(value) {

            this._y = value;
            this.onChangeCallback();

        },

        get z() {

            return this._z;

        },

        set z(value) {

            this._z = value;
            this.onChangeCallback();

        },

        get w() {

            return this._w;

        },

        set w(value) {

            this._w = value;
            this.onChangeCallback();

        },

        set: function(x, y, z, w) {

            this._x = x;
            this._y = y;
            this._z = z;
            this._w = w;

            this.onChangeCallback();

            return this;

        },

        clone: function() {

            return new this.constructor(this._x, this._y, this._z, this._w);

        },

        copy: function(quaternion) {

            this._x = quaternion.x;
            this._y = quaternion.y;
            this._z = quaternion.z;
            this._w = quaternion.w;

            this.onChangeCallback();

            return this;

        },

        setFromEuler: function(euler, update) {

            if (euler instanceof JC.Euler === false) {

                throw new Error('Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.');

            }

            // http://www.mathworks.com/matlabcentral/fileexchange/
            //  20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
            //  content/SpinCalc.m

            var c1 = Math.cos(euler._x / 2);
            var c2 = Math.cos(euler._y / 2);
            var c3 = Math.cos(euler._z / 2);
            var s1 = Math.sin(euler._x / 2);
            var s2 = Math.sin(euler._y / 2);
            var s3 = Math.sin(euler._z / 2);

            var order = euler.order;

            if (order === 'XYZ') {

                this._x = s1 * c2 * c3 + c1 * s2 * s3;
                this._y = c1 * s2 * c3 - s1 * c2 * s3;
                this._z = c1 * c2 * s3 + s1 * s2 * c3;
                this._w = c1 * c2 * c3 - s1 * s2 * s3;

            } else if (order === 'YXZ') {

                this._x = s1 * c2 * c3 + c1 * s2 * s3;
                this._y = c1 * s2 * c3 - s1 * c2 * s3;
                this._z = c1 * c2 * s3 - s1 * s2 * c3;
                this._w = c1 * c2 * c3 + s1 * s2 * s3;

            } else if (order === 'ZXY') {

                this._x = s1 * c2 * c3 - c1 * s2 * s3;
                this._y = c1 * s2 * c3 + s1 * c2 * s3;
                this._z = c1 * c2 * s3 + s1 * s2 * c3;
                this._w = c1 * c2 * c3 - s1 * s2 * s3;

            } else if (order === 'ZYX') {

                this._x = s1 * c2 * c3 - c1 * s2 * s3;
                this._y = c1 * s2 * c3 + s1 * c2 * s3;
                this._z = c1 * c2 * s3 - s1 * s2 * c3;
                this._w = c1 * c2 * c3 + s1 * s2 * s3;

            } else if (order === 'YZX') {

                this._x = s1 * c2 * c3 + c1 * s2 * s3;
                this._y = c1 * s2 * c3 + s1 * c2 * s3;
                this._z = c1 * c2 * s3 - s1 * s2 * c3;
                this._w = c1 * c2 * c3 - s1 * s2 * s3;

            } else if (order === 'XZY') {

                this._x = s1 * c2 * c3 - c1 * s2 * s3;
                this._y = c1 * s2 * c3 - s1 * c2 * s3;
                this._z = c1 * c2 * s3 + s1 * s2 * c3;
                this._w = c1 * c2 * c3 + s1 * s2 * s3;

            }

            if (update !== false) this.onChangeCallback();

            return this;

        },

        setFromAxisAngle: function(axis, angle) {

            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

            // assumes axis is normalized

            var halfAngle = angle / 2,
                s = Math.sin(halfAngle);

            this._x = axis.x * s;
            this._y = axis.y * s;
            this._z = axis.z * s;
            this._w = Math.cos(halfAngle);

            this.onChangeCallback();

            return this;

        },

        setFromRotationMatrix: function(m) {

            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

            var te = m.elements,

                m11 = te[0],
                m12 = te[4],
                m13 = te[8],
                m21 = te[1],
                m22 = te[5],
                m23 = te[9],
                m31 = te[2],
                m32 = te[6],
                m33 = te[10],

                trace = m11 + m22 + m33,
                s;

            if (trace > 0) {

                s = 0.5 / Math.sqrt(trace + 1.0);

                this._w = 0.25 / s;
                this._x = (m32 - m23) * s;
                this._y = (m13 - m31) * s;
                this._z = (m21 - m12) * s;

            } else if (m11 > m22 && m11 > m33) {

                s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

                this._w = (m32 - m23) / s;
                this._x = 0.25 * s;
                this._y = (m12 + m21) / s;
                this._z = (m13 + m31) / s;

            } else if (m22 > m33) {

                s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

                this._w = (m13 - m31) / s;
                this._x = (m12 + m21) / s;
                this._y = 0.25 * s;
                this._z = (m23 + m32) / s;

            } else {

                s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

                this._w = (m21 - m12) / s;
                this._x = (m13 + m31) / s;
                this._y = (m23 + m32) / s;
                this._z = 0.25 * s;

            }

            this.onChangeCallback();

            return this;

        },

        setFromUnitVectors: function() {

            // http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

            // assumes direction vectors vFrom and vTo are normalized

            var v1, r;

            var EPS = 0.000001;

            return function(vFrom, vTo) {

                if (v1 === undefined) v1 = new JC.Vector3();

                r = vFrom.dot(vTo) + 1;

                if (r < EPS) {

                    r = 0;

                    if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {

                        v1.set(-vFrom.y, vFrom.x, 0);

                    } else {

                        v1.set(0, -vFrom.z, vFrom.y);

                    }

                } else {

                    v1.crossVectors(vFrom, vTo);

                }

                this._x = v1.x;
                this._y = v1.y;
                this._z = v1.z;
                this._w = r;

                this.normalize();

                return this;

            };

        }(),

        inverse: function() {

            this.conjugate().normalize();

            return this;

        },

        conjugate: function() {

            this._x *= -1;
            this._y *= -1;
            this._z *= -1;

            this.onChangeCallback();

            return this;

        },

        dot: function(v) {

            return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

        },

        lengthSq: function() {

            return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

        },

        length: function() {

            return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);

        },

        normalize: function() {

            var l = this.length();

            if (l === 0) {

                this._x = 0;
                this._y = 0;
                this._z = 0;
                this._w = 1;

            } else {

                l = 1 / l;

                this._x = this._x * l;
                this._y = this._y * l;
                this._z = this._z * l;
                this._w = this._w * l;

            }

            this.onChangeCallback();

            return this;

        },

        multiply: function(q, p) {

            if (p !== undefined) {

                console.warn('Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.');
                return this.multiplyQuaternions(q, p);

            }

            return this.multiplyQuaternions(this, q);

        },

        multiplyQuaternions: function(a, b) {

            // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

            var qax = a._x,
                qay = a._y,
                qaz = a._z,
                qaw = a._w;
            var qbx = b._x,
                qby = b._y,
                qbz = b._z,
                qbw = b._w;

            this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
            this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
            this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
            this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

            this.onChangeCallback();

            return this;

        },

        slerp: function(qb, t) {

            if (t === 0) return this;
            if (t === 1) return this.copy(qb);

            var x = this._x,
                y = this._y,
                z = this._z,
                w = this._w;

            // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

            var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

            if (cosHalfTheta < 0) {

                this._w = -qb._w;
                this._x = -qb._x;
                this._y = -qb._y;
                this._z = -qb._z;

                cosHalfTheta = -cosHalfTheta;

            } else {

                this.copy(qb);

            }

            if (cosHalfTheta >= 1.0) {

                this._w = w;
                this._x = x;
                this._y = y;
                this._z = z;

                return this;

            }

            var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

            if (Math.abs(sinHalfTheta) < 0.001) {

                this._w = 0.5 * (w + this._w);
                this._x = 0.5 * (x + this._x);
                this._y = 0.5 * (y + this._y);
                this._z = 0.5 * (z + this._z);

                return this;

            }

            var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
            var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
                ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

            this._w = (w * ratioA + this._w * ratioB);
            this._x = (x * ratioA + this._x * ratioB);
            this._y = (y * ratioA + this._y * ratioB);
            this._z = (z * ratioA + this._z * ratioB);

            this.onChangeCallback();

            return this;

        },

        equals: function(quaternion) {

            return (quaternion._x === this._x) && (quaternion._y === this._y) && (quaternion._z === this._z) && (quaternion._w === this._w);

        },

        fromArray: function(array, offset) {

            if (offset === undefined) offset = 0;

            this._x = array[offset];
            this._y = array[offset + 1];
            this._z = array[offset + 2];
            this._w = array[offset + 3];

            this.onChangeCallback();

            return this;

        },

        toArray: function(array, offset) {

            if (array === undefined) array = [];
            if (offset === undefined) offset = 0;

            array[offset] = this._x;
            array[offset + 1] = this._y;
            array[offset + 2] = this._z;
            array[offset + 3] = this._w;

            return array;

        },

        onChange: function(callback) {

            this.onChangeCallback = callback;

            return this;

        },

        onChangeCallback: function() {}

    };


    JC.Euler = function(x, y, z, order) {

        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._order = order || JC.Euler.DefaultOrder;

    };

    JC.Euler.RotationOrders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];

    JC.Euler.DefaultOrder = 'XYZ';

    JC.Euler.prototype = {

        constructor: JC.Euler,

        get x() {

            return this._x;

        },

        set x(value) {

            this._x = value;
            this.onChangeCallback();

        },

        get y() {

            return this._y;

        },

        set y(value) {

            this._y = value;
            this.onChangeCallback();

        },

        get z() {

            return this._z;

        },

        set z(value) {

            this._z = value;
            this.onChangeCallback();

        },

        get order() {

            return this._order;

        },

        set order(value) {

            this._order = value;
            this.onChangeCallback();

        },

        set: function(x, y, z, order) {

            this._x = x;
            this._y = y;
            this._z = z;
            this._order = order || this._order;

            this.onChangeCallback();

            return this;

        },

        clone: function() {

            return new this.constructor(this._x, this._y, this._z, this._order);

        },

        copy: function(euler) {

            this._x = euler._x;
            this._y = euler._y;
            this._z = euler._z;
            this._order = euler._order;

            this.onChangeCallback();

            return this;

        },

        setFromRotationMatrix: function(m, order, update) {

            var clamp = JC.Math.clamp;

            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

            var te = m.elements;
            var m11 = te[0],
                m12 = te[4],
                m13 = te[8];
            var m21 = te[1],
                m22 = te[5],
                m23 = te[9];
            var m31 = te[2],
                m32 = te[6],
                m33 = te[10];

            order = order || this._order;

            if (order === 'XYZ') {

                this._y = Math.asin(clamp(m13, -1, 1));

                if (Math.abs(m13) < 0.99999) {

                    this._x = Math.atan2(-m23, m33);
                    this._z = Math.atan2(-m12, m11);

                } else {

                    this._x = Math.atan2(m32, m22);
                    this._z = 0;

                }

            } else if (order === 'YXZ') {

                this._x = Math.asin(-clamp(m23, -1, 1));

                if (Math.abs(m23) < 0.99999) {

                    this._y = Math.atan2(m13, m33);
                    this._z = Math.atan2(m21, m22);

                } else {

                    this._y = Math.atan2(-m31, m11);
                    this._z = 0;

                }

            } else if (order === 'ZXY') {

                this._x = Math.asin(clamp(m32, -1, 1));

                if (Math.abs(m32) < 0.99999) {

                    this._y = Math.atan2(-m31, m33);
                    this._z = Math.atan2(-m12, m22);

                } else {

                    this._y = 0;
                    this._z = Math.atan2(m21, m11);

                }

            } else if (order === 'ZYX') {

                this._y = Math.asin(-clamp(m31, -1, 1));

                if (Math.abs(m31) < 0.99999) {

                    this._x = Math.atan2(m32, m33);
                    this._z = Math.atan2(m21, m11);

                } else {

                    this._x = 0;
                    this._z = Math.atan2(-m12, m22);

                }

            } else if (order === 'YZX') {

                this._z = Math.asin(clamp(m21, -1, 1));

                if (Math.abs(m21) < 0.99999) {

                    this._x = Math.atan2(-m23, m22);
                    this._y = Math.atan2(-m31, m11);

                } else {

                    this._x = 0;
                    this._y = Math.atan2(m13, m33);

                }

            } else if (order === 'XZY') {

                this._z = Math.asin(-clamp(m12, -1, 1));

                if (Math.abs(m12) < 0.99999) {

                    this._x = Math.atan2(m32, m22);
                    this._y = Math.atan2(m13, m11);

                } else {

                    this._x = Math.atan2(-m23, m33);
                    this._y = 0;

                }

            } else {

                console.warn('Euler: .setFromRotationMatrix() given unsupported order: ' + order)

            }

            this._order = order;

            if (update !== false) this.onChangeCallback();

            return this;

        },

        setFromQuaternion: function() {

            var matrix;

            return function(q, order, update) {

                if (matrix === undefined) matrix = new JC.Matrix4();
                matrix.makeRotationFromQuaternion(q);
                this.setFromRotationMatrix(matrix, order, update);

                return this;

            };

        }(),

        setFromVector3: function(v, order) {

            return this.set(v.x, v.y, v.z, order || this._order);

        },

        reorder: function() {

            var q = new JC.Quaternion();

            return function(newOrder) {

                q.setFromEuler(this);
                this.setFromQuaternion(q, newOrder);

            };

        }(),

        equals: function(euler) {

            return (euler._x === this._x) && (euler._y === this._y) && (euler._z === this._z) && (euler._order === this._order);

        },

        fromArray: function(array) {

            this._x = array[0];
            this._y = array[1];
            this._z = array[2];
            if (array[3] !== undefined) this._order = array[3];

            this.onChangeCallback();

            return this;

        },

        toArray: function(array, offset) {

            if (array === undefined) array = [];
            if (offset === undefined) offset = 0;

            array[offset] = this._x;
            array[offset + 1] = this._y;
            array[offset + 2] = this._z;
            array[offset + 3] = this._order;

            return array;

        },

        toVector3: function(optionalResult) {

            if (optionalResult) {

                return optionalResult.set(this._x, this._y, this._z);

            } else {

                return new JC.Vector3(this._x, this._y, this._z);

            }

        },

        onChange: function(callback) {

            this.onChangeCallback = callback;

            return this;

        },

        onChangeCallback: function() {}

    };

    JC.Matrix4 = function() {

        this.elements = new Float32Array([

            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1

        ]);

        if (arguments.length > 0) {

            console.error('Matrix4: the constructor no longer reads arguments. use .set() instead.');

        }

    };

    JC.Matrix4.prototype = {

        constructor: JC.Matrix4,

        set: function(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {

            var te = this.elements;

            te[0] = n11;
            te[4] = n12;
            te[8] = n13;
            te[12] = n14;
            te[1] = n21;
            te[5] = n22;
            te[9] = n23;
            te[13] = n24;
            te[2] = n31;
            te[6] = n32;
            te[10] = n33;
            te[14] = n34;
            te[3] = n41;
            te[7] = n42;
            te[11] = n43;
            te[15] = n44;

            return this;

        },

        identity: function() {

            this.set(

                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1

            );

            return this;

        },

        clone: function() {

            return new JC.Matrix4().fromArray(this.elements);

        },

        copy: function(m) {

            this.elements.set(m.elements);

            return this;

        },

        copyPosition: function(m) {

            var te = this.elements;
            var me = m.elements;

            te[12] = me[12];
            te[13] = me[13];
            te[14] = me[14];

            return this;

        },

        extractBasis: function(xAxis, yAxis, zAxis) {

            xAxis.setFromMatrixColumn(this, 0);
            yAxis.setFromMatrixColumn(this, 1);
            zAxis.setFromMatrixColumn(this, 2);

            return this;

        },

        makeBasis: function(xAxis, yAxis, zAxis) {

            this.set(
                xAxis.x, yAxis.x, zAxis.x, 0,
                xAxis.y, yAxis.y, zAxis.y, 0,
                xAxis.z, yAxis.z, zAxis.z, 0,
                0, 0, 0, 1
            );

            return this;

        },

        extractRotation: function() {

            var v1;

            return function(m) {

                if (v1 === undefined) v1 = new JC.Vector3();

                var te = this.elements;
                var me = m.elements;

                var scaleX = 1 / v1.setFromMatrixColumn(m, 0).length();
                var scaleY = 1 / v1.setFromMatrixColumn(m, 1).length();
                var scaleZ = 1 / v1.setFromMatrixColumn(m, 2).length();

                te[0] = me[0] * scaleX;
                te[1] = me[1] * scaleX;
                te[2] = me[2] * scaleX;

                te[4] = me[4] * scaleY;
                te[5] = me[5] * scaleY;
                te[6] = me[6] * scaleY;

                te[8] = me[8] * scaleZ;
                te[9] = me[9] * scaleZ;
                te[10] = me[10] * scaleZ;

                return this;

            };

        }(),

        makeRotationFromEuler: function(euler) {

            if (euler instanceof JC.Euler === false) {

                console.error('Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.');

            }

            var te = this.elements;

            var x = euler.x,
                y = euler.y,
                z = euler.z;
            var a = Math.cos(x),
                b = Math.sin(x);
            var c = Math.cos(y),
                d = Math.sin(y);
            var e = Math.cos(z),
                f = Math.sin(z);

            if (euler.order === 'XYZ') {

                var ae = a * e,
                    af = a * f,
                    be = b * e,
                    bf = b * f;

                te[0] = c * e;
                te[4] = -c * f;
                te[8] = d;

                te[1] = af + be * d;
                te[5] = ae - bf * d;
                te[9] = -b * c;

                te[2] = bf - ae * d;
                te[6] = be + af * d;
                te[10] = a * c;

            } else if (euler.order === 'YXZ') {

                var ce = c * e,
                    cf = c * f,
                    de = d * e,
                    df = d * f;

                te[0] = ce + df * b;
                te[4] = de * b - cf;
                te[8] = a * d;

                te[1] = a * f;
                te[5] = a * e;
                te[9] = -b;

                te[2] = cf * b - de;
                te[6] = df + ce * b;
                te[10] = a * c;

            } else if (euler.order === 'ZXY') {

                var ce = c * e,
                    cf = c * f,
                    de = d * e,
                    df = d * f;

                te[0] = ce - df * b;
                te[4] = -a * f;
                te[8] = de + cf * b;

                te[1] = cf + de * b;
                te[5] = a * e;
                te[9] = df - ce * b;

                te[2] = -a * d;
                te[6] = b;
                te[10] = a * c;

            } else if (euler.order === 'ZYX') {

                var ae = a * e,
                    af = a * f,
                    be = b * e,
                    bf = b * f;

                te[0] = c * e;
                te[4] = be * d - af;
                te[8] = ae * d + bf;

                te[1] = c * f;
                te[5] = bf * d + ae;
                te[9] = af * d - be;

                te[2] = -d;
                te[6] = b * c;
                te[10] = a * c;

            } else if (euler.order === 'YZX') {

                var ac = a * c,
                    ad = a * d,
                    bc = b * c,
                    bd = b * d;

                te[0] = c * e;
                te[4] = bd - ac * f;
                te[8] = bc * f + ad;

                te[1] = f;
                te[5] = a * e;
                te[9] = -b * e;

                te[2] = -d * e;
                te[6] = ad * f + bc;
                te[10] = ac - bd * f;

            } else if (euler.order === 'XZY') {

                var ac = a * c,
                    ad = a * d,
                    bc = b * c,
                    bd = b * d;

                te[0] = c * e;
                te[4] = -f;
                te[8] = d * e;

                te[1] = ac * f + bd;
                te[5] = a * e;
                te[9] = ad * f - bc;

                te[2] = bc * f - ad;
                te[6] = b * e;
                te[10] = bd * f + ac;

            }

            // last column
            te[3] = 0;
            te[7] = 0;
            te[11] = 0;

            // bottom row
            te[12] = 0;
            te[13] = 0;
            te[14] = 0;
            te[15] = 1;

            return this;

        },

        makeRotationFromQuaternion: function(q) {

            var te = this.elements;

            var x = q.x,
                y = q.y,
                z = q.z,
                w = q.w;
            var x2 = x + x,
                y2 = y + y,
                z2 = z + z;
            var xx = x * x2,
                xy = x * y2,
                xz = x * z2;
            var yy = y * y2,
                yz = y * z2,
                zz = z * z2;
            var wx = w * x2,
                wy = w * y2,
                wz = w * z2;

            te[0] = 1 - (yy + zz);
            te[4] = xy - wz;
            te[8] = xz + wy;

            te[1] = xy + wz;
            te[5] = 1 - (xx + zz);
            te[9] = yz - wx;

            te[2] = xz - wy;
            te[6] = yz + wx;
            te[10] = 1 - (xx + yy);

            // last column
            te[3] = 0;
            te[7] = 0;
            te[11] = 0;

            // bottom row
            te[12] = 0;
            te[13] = 0;
            te[14] = 0;
            te[15] = 1;

            return this;

        },

        lookAt: function() {

            var x, y, z;

            return function(eye, target, up) {

                if (x === undefined) x = new JC.Vector3();
                if (y === undefined) y = new JC.Vector3();
                if (z === undefined) z = new JC.Vector3();

                var te = this.elements;

                z.subVectors(eye, target).normalize();

                if (z.lengthSq() === 0) {

                    z.z = 1;

                }

                x.crossVectors(up, z).normalize();

                if (x.lengthSq() === 0) {

                    z.x += 0.0001;
                    x.crossVectors(up, z).normalize();

                }

                y.crossVectors(z, x);


                te[0] = x.x;
                te[4] = y.x;
                te[8] = z.x;
                te[1] = x.y;
                te[5] = y.y;
                te[9] = z.y;
                te[2] = x.z;
                te[6] = y.z;
                te[10] = z.z;

                return this;

            };

        }(),

        multiply: function(m, n) {

            if (n !== undefined) {

                console.warn('Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.');
                return this.multiplyMatrices(m, n);

            }

            return this.multiplyMatrices(this, m);

        },

        multiplyMatrices: function(a, b) {

            var ae = a.elements;
            var be = b.elements;
            var te = this.elements;

            var a11 = ae[0],
                a12 = ae[4],
                a13 = ae[8],
                a14 = ae[12];
            var a21 = ae[1],
                a22 = ae[5],
                a23 = ae[9],
                a24 = ae[13];
            var a31 = ae[2],
                a32 = ae[6],
                a33 = ae[10],
                a34 = ae[14];
            var a41 = ae[3],
                a42 = ae[7],
                a43 = ae[11],
                a44 = ae[15];

            var b11 = be[0],
                b12 = be[4],
                b13 = be[8],
                b14 = be[12];
            var b21 = be[1],
                b22 = be[5],
                b23 = be[9],
                b24 = be[13];
            var b31 = be[2],
                b32 = be[6],
                b33 = be[10],
                b34 = be[14];
            var b41 = be[3],
                b42 = be[7],
                b43 = be[11],
                b44 = be[15];

            te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
            te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
            te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
            te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

            te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
            te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
            te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
            te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

            te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
            te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
            te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
            te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

            te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
            te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
            te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
            te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

            return this;

        },

        multiplyToArray: function(a, b, r) {

            var te = this.elements;

            this.multiplyMatrices(a, b);

            r[0] = te[0];
            r[1] = te[1];
            r[2] = te[2];
            r[3] = te[3];
            r[4] = te[4];
            r[5] = te[5];
            r[6] = te[6];
            r[7] = te[7];
            r[8] = te[8];
            r[9] = te[9];
            r[10] = te[10];
            r[11] = te[11];
            r[12] = te[12];
            r[13] = te[13];
            r[14] = te[14];
            r[15] = te[15];

            return this;

        },

        multiplyScalar: function(s) {

            var te = this.elements;

            te[0] *= s;
            te[4] *= s;
            te[8] *= s;
            te[12] *= s;
            te[1] *= s;
            te[5] *= s;
            te[9] *= s;
            te[13] *= s;
            te[2] *= s;
            te[6] *= s;
            te[10] *= s;
            te[14] *= s;
            te[3] *= s;
            te[7] *= s;
            te[11] *= s;
            te[15] *= s;

            return this;

        },

        applyToVector3Array: function() {

            var v1;

            return function(array, offset, length) {

                if (v1 === undefined) v1 = new JC.Vector3();
                if (offset === undefined) offset = 0;
                if (length === undefined) length = array.length;

                for (var i = 0, j = offset; i < length; i += 3, j += 3) {

                    v1.fromArray(array, j);
                    v1.applyMatrix4(this);
                    v1.toArray(array, j);

                }

                return array;

            };

        }(),

        applyToBuffer: function() {

            var v1;

            return function applyToBuffer(buffer, offset, length) {

                if (v1 === undefined) v1 = new JC.Vector3();
                if (offset === undefined) offset = 0;
                if (length === undefined) length = buffer.length / buffer.itemSize;

                for (var i = 0, j = offset; i < length; i++, j++) {

                    v1.x = buffer.getX(j);
                    v1.y = buffer.getY(j);
                    v1.z = buffer.getZ(j);

                    v1.applyMatrix4(this);

                    buffer.setXYZ(v1.x, v1.y, v1.z);

                }

                return buffer;

            };

        }(),

        determinant: function() {

            var te = this.elements;

            var n11 = te[0],
                n12 = te[4],
                n13 = te[8],
                n14 = te[12];
            var n21 = te[1],
                n22 = te[5],
                n23 = te[9],
                n24 = te[13];
            var n31 = te[2],
                n32 = te[6],
                n33 = te[10],
                n34 = te[14];
            var n41 = te[3],
                n42 = te[7],
                n43 = te[11],
                n44 = te[15];

            return (
                n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) +
                n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) +
                n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) +
                n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31)

            );

        },

        transpose: function() {

            var te = this.elements;
            var tmp;

            tmp = te[1];
            te[1] = te[4];
            te[4] = tmp;
            tmp = te[2];
            te[2] = te[8];
            te[8] = tmp;
            tmp = te[6];
            te[6] = te[9];
            te[9] = tmp;

            tmp = te[3];
            te[3] = te[12];
            te[12] = tmp;
            tmp = te[7];
            te[7] = te[13];
            te[13] = tmp;
            tmp = te[11];
            te[11] = te[14];
            te[14] = tmp;

            return this;

        },

        flattenToArrayOffset: function(array, offset) {

            var te = this.elements;

            array[offset] = te[0];
            array[offset + 1] = te[1];
            array[offset + 2] = te[2];
            array[offset + 3] = te[3];

            array[offset + 4] = te[4];
            array[offset + 5] = te[5];
            array[offset + 6] = te[6];
            array[offset + 7] = te[7];

            array[offset + 8] = te[8];
            array[offset + 9] = te[9];
            array[offset + 10] = te[10];
            array[offset + 11] = te[11];

            array[offset + 12] = te[12];
            array[offset + 13] = te[13];
            array[offset + 14] = te[14];
            array[offset + 15] = te[15];

            return array;

        },

        getPosition: function() {

            var v1;

            return function() {

                if (v1 === undefined) v1 = new JC.Vector3();
                console.warn('Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.');

                return v1.setFromMatrixColumn(this, 3);

            };

        }(),

        setPosition: function(v) {

            var te = this.elements;

            te[12] = v.x;
            te[13] = v.y;
            te[14] = v.z;

            return this;

        },

        getInverse: function(m, throwOnDegenerate) {

            // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
            var te = this.elements,
                me = m.elements,

                n11 = me[0],
                n21 = me[1],
                n31 = me[2],
                n41 = me[3],
                n12 = me[4],
                n22 = me[5],
                n32 = me[6],
                n42 = me[7],
                n13 = me[8],
                n23 = me[9],
                n33 = me[10],
                n43 = me[11],
                n14 = me[12],
                n24 = me[13],
                n34 = me[14],
                n44 = me[15],

                t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
                t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
                t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
                t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

            var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

            if (det === 0) {

                var msg = "Matrix4.getInverse(): can't invert matrix, determinant is 0";

                if (throwOnDegenerate || false) {

                    throw new Error(msg);

                } else {

                    console.warn(msg);

                }

                return this.identity();

            }

            te[0] = t11;
            te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
            te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
            te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;

            te[4] = t12;
            te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
            te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
            te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;

            te[8] = t13;
            te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
            te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
            te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;

            te[12] = t14;
            te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
            te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
            te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

            return this.multiplyScalar(1 / det);

        },

        scale: function(v) {

            var te = this.elements;
            var x = v.x,
                y = v.y,
                z = v.z;

            te[0] *= x;
            te[4] *= y;
            te[8] *= z;
            te[1] *= x;
            te[5] *= y;
            te[9] *= z;
            te[2] *= x;
            te[6] *= y;
            te[10] *= z;
            te[3] *= x;
            te[7] *= y;
            te[11] *= z;

            return this;

        },

        getMaxScaleOnAxis: function() {

            var te = this.elements;

            var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
            var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
            var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

            return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));

        },

        makeTranslation: function(x, y, z) {

            this.set(

                1, 0, 0, x,
                0, 1, 0, y,
                0, 0, 1, z,
                0, 0, 0, 1

            );

            return this;

        },

        makeRotationX: function(theta) {

            var c = Math.cos(theta),
                s = Math.sin(theta);

            this.set(

                1, 0, 0, 0,
                0, c, -s, 0,
                0, s, c, 0,
                0, 0, 0, 1

            );

            return this;

        },

        makeRotationY: function(theta) {

            var c = Math.cos(theta),
                s = Math.sin(theta);

            this.set(

                c, 0, s, 0,
                0, 1, 0, 0, -s, 0, c, 0,
                0, 0, 0, 1

            );

            return this;

        },

        makeRotationZ: function(theta) {

            var c = Math.cos(theta),
                s = Math.sin(theta);

            this.set(

                c, -s, 0, 0,
                s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1

            );

            return this;

        },

        makeRotationAxis: function(axis, angle) {

            // Based on http://www.gamedev.net/reference/articles/article1199.asp

            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var t = 1 - c;
            var x = axis.x,
                y = axis.y,
                z = axis.z;
            var tx = t * x,
                ty = t * y;

            this.set(

                tx * x + c, tx * y - s * z, tx * z + s * y, 0,
                tx * y + s * z, ty * y + c, ty * z - s * x, 0,
                tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
                0, 0, 0, 1

            );

            return this;

        },

        makeScale: function(x, y, z) {

            this.set(

                x, 0, 0, 0,
                0, y, 0, 0,
                0, 0, z, 0,
                0, 0, 0, 1

            );

            return this;

        },

        compose: function(position, quaternion, scale) {

            this.makeRotationFromQuaternion(quaternion);
            this.scale(scale);
            this.setPosition(position);

            return this;

        },

        decompose: function() {

            var vector, matrix;

            return function(position, quaternion, scale) {

                if (vector === undefined) vector = new JC.Vector3();
                if (matrix === undefined) matrix = new JC.Matrix4();

                var te = this.elements;

                var sx = vector.set(te[0], te[1], te[2]).length();
                var sy = vector.set(te[4], te[5], te[6]).length();
                var sz = vector.set(te[8], te[9], te[10]).length();

                // if determine is negative, we need to invert one scale
                var det = this.determinant();
                if (det < 0) {

                    sx = -sx;

                }

                position.x = te[12];
                position.y = te[13];
                position.z = te[14];

                // scale the rotation part

                matrix.elements.set(this.elements); // at this point matrix is incomplete so we can't use .copy()

                var invSX = 1 / sx;
                var invSY = 1 / sy;
                var invSZ = 1 / sz;

                matrix.elements[0] *= invSX;
                matrix.elements[1] *= invSX;
                matrix.elements[2] *= invSX;

                matrix.elements[4] *= invSY;
                matrix.elements[5] *= invSY;
                matrix.elements[6] *= invSY;

                matrix.elements[8] *= invSZ;
                matrix.elements[9] *= invSZ;
                matrix.elements[10] *= invSZ;

                quaternion.setFromRotationMatrix(matrix);

                scale.x = sx;
                scale.y = sy;
                scale.z = sz;

                return this;

            };

        }(),

        makeFrustum: function(left, right, bottom, top, near, far) {

            var te = this.elements;
            var x = 2 * near / (right - left);
            var y = 2 * near / (top - bottom);

            var a = (right + left) / (right - left);
            var b = (top + bottom) / (top - bottom);
            var c = -(far + near) / (far - near);
            var d = -2 * far * near / (far - near);

            te[0] = x;
            te[4] = 0;
            te[8] = a;
            te[12] = 0;
            te[1] = 0;
            te[5] = y;
            te[9] = b;
            te[13] = 0;
            te[2] = 0;
            te[6] = 0;
            te[10] = c;
            te[14] = d;
            te[3] = 0;
            te[7] = 0;
            te[11] = -1;
            te[15] = 0;

            return this;

        },

        makePerspective: function(fov, aspect, near, far) {

            var ymax = near * Math.tan(JC.Math.degToRad(fov * 0.5));
            var ymin = -ymax;
            var xmin = ymin * aspect;
            var xmax = ymax * aspect;

            return this.makeFrustum(xmin, xmax, ymin, ymax, near, far);

        },

        makeOrthographic: function(left, right, top, bottom, near, far) {

            var te = this.elements;
            var w = 1.0 / (right - left);
            var h = 1.0 / (top - bottom);
            var p = 1.0 / (far - near);

            var x = (right + left) * w;
            var y = (top + bottom) * h;
            var z = (far + near) * p;

            te[0] = 2 * w;
            te[4] = 0;
            te[8] = 0;
            te[12] = -x;
            te[1] = 0;
            te[5] = 2 * h;
            te[9] = 0;
            te[13] = -y;
            te[2] = 0;
            te[6] = 0;
            te[10] = -2 * p;
            te[14] = -z;
            te[3] = 0;
            te[7] = 0;
            te[11] = 0;
            te[15] = 1;

            return this;

        },

        equals: function(matrix) {

            var te = this.elements;
            var me = matrix.elements;

            for (var i = 0; i < 16; i++) {

                if (te[i] !== me[i]) return false;

            }

            return true;

        },

        fromArray: function(array) {

            this.elements.set(array);

            return this;

        },

        toArray: function() {

            var te = this.elements;

            return [
                te[0], te[1], te[2], te[3],
                te[4], te[5], te[6], te[7],
                te[8], te[9], te[10], te[11],
                te[12], te[13], te[14], te[15]
            ];

        }

    };




    JC.Object3D = function() {

        Object.defineProperty(this, 'id', { value: Object3DIdCount++ });

        this.name = '';
        this.type = 'Object3D';

        this.parent = null;
        this.children = [];

        this.up = JC.Object3D.DefaultUp.clone();

        var position = new JC.Vector3();
        var rotation = new JC.Euler();
        var quaternion = new JC.Quaternion();
        var scale = new JC.Vector3(1, 1, 1);

        function onRotationChange() {

            quaternion.setFromEuler(rotation, false);

        }

        function onQuaternionChange() {

            rotation.setFromQuaternion(quaternion, undefined, false);

        }

        rotation.onChange(onRotationChange);
        quaternion.onChange(onQuaternionChange);

        Object.defineProperties(this, {
            position: {
                enumerable: true,
                value: position
            },
            rotation: {
                enumerable: true,
                value: rotation
            },
            quaternion: {
                enumerable: true,
                value: quaternion
            },
            scale: {
                enumerable: true,
                value: scale
            },
            modelViewMatrix: {
                value: new JC.Matrix4()
            }
        });

        this.rotationAutoUpdate = true;

        this.matrix = new JC.Matrix4();
        this.matrixWorld = new JC.Matrix4();

        this.matrixAutoUpdate = JC.Object3D.DefaultMatrixAutoUpdate;
        this.matrixWorldNeedsUpdate = false;

        this.visible = true;

    };

    JC.Object3D.DefaultUp = new JC.Vector3(0, 1, 0);
    JC.Object3D.DefaultMatrixAutoUpdate = true;

    JC.Object3D.prototype = {

        constructor: JC.Object3D,

        applyMatrix: function(matrix) {

            this.matrix.multiplyMatrices(matrix, this.matrix);

            this.matrix.decompose(this.position, this.quaternion, this.scale);

        },

        setRotationFromAxisAngle: function(axis, angle) {

            // assumes axis is normalized

            this.quaternion.setFromAxisAngle(axis, angle);

        },

        setRotationFromEuler: function(euler) {

            this.quaternion.setFromEuler(euler, true);

        },

        setRotationFromMatrix: function(m) {

            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

            this.quaternion.setFromRotationMatrix(m);

        },

        setRotationFromQuaternion: function(q) {

            // assumes q is normalized

            this.quaternion.copy(q);

        },

        rotateOnAxis: function() {

            // rotate object on axis in object space
            // axis is assumed to be normalized

            var q1 = new JC.Quaternion();

            return function(axis, angle) {

                q1.setFromAxisAngle(axis, angle);

                this.quaternion.multiply(q1);

                return this;

            };

        }(),

        rotateX: function() {

            var v1 = new JC.Vector3(1, 0, 0);

            return function(angle) {

                return this.rotateOnAxis(v1, angle);

            };

        }(),

        rotateY: function() {

            var v1 = new JC.Vector3(0, 1, 0);

            return function(angle) {

                return this.rotateOnAxis(v1, angle);

            };

        }(),

        rotateZ: function() {

            var v1 = new JC.Vector3(0, 0, 1);

            return function(angle) {

                return this.rotateOnAxis(v1, angle);

            };

        }(),

        translateOnAxis: function() {

            // translate object by distance along axis in object space
            // axis is assumed to be normalized

            var v1 = new JC.Vector3();

            return function(axis, distance) {

                v1.copy(axis).applyQuaternion(this.quaternion);

                this.position.add(v1.multiplyScalar(distance));

                return this;

            };

        }(),

        translateX: function() {

            var v1 = new JC.Vector3(1, 0, 0);

            return function(distance) {

                return this.translateOnAxis(v1, distance);

            };

        }(),

        translateY: function() {

            var v1 = new JC.Vector3(0, 1, 0);

            return function(distance) {

                return this.translateOnAxis(v1, distance);

            };

        }(),

        translateZ: function() {

            var v1 = new JC.Vector3(0, 0, 1);

            return function(distance) {

                return this.translateOnAxis(v1, distance);

            };

        }(),

        localToWorld: function(vector) {

            return vector.applyMatrix4(this.matrixWorld);

        },

        worldToLocal: function() {

            var m1 = new JC.Matrix4();

            return function(vector) {

                return vector.applyMatrix4(m1.getInverse(this.matrixWorld));

            };

        }(),

        lookAt: function() {

            // This routine does not support objects with rotated and/or translated parent(s)

            var m1 = new JC.Matrix4();

            return function(vector) {

                m1.lookAt(vector, this.position, this.up);

                this.quaternion.setFromRotationMatrix(m1);

            };

        }(),

        add: function(object) {

            if (arguments.length > 1) {

                for (var i = 0; i < arguments.length; i++) {

                    this.add(arguments[i]);

                }

                return this;

            }

            if (object === this) {

                console.error("Object3D.add: object can't be added as a child of itself.", object);
                return this;

            }

            if (object instanceof JC.Object3D) {

                if (object.parent !== null) {

                    object.parent.remove(object);

                }

                object.parent = this;
                // object.dispatchEvent( { type: 'added' } );

                this.children.push(object);

            } else {

                console.error("Object3D.add: object not an instance of Object3D.", object);

            }

            return this;

        },

        remove: function(object) {

            if (arguments.length > 1) {

                for (var i = 0; i < arguments.length; i++) {

                    this.remove(arguments[i]);

                }

            }

            var index = this.children.indexOf(object);

            if (index !== -1) {

                object.parent = null;

                object.dispatchEvent({ type: 'removed' });

                this.children.splice(index, 1);

            }

        },

        getWorldPosition: function(optionalTarget) {

            var result = optionalTarget || new JC.Vector3();

            this.updateMatrixWorld(true);

            return result.setFromMatrixPosition(this.matrixWorld);

        },

        getWorldQuaternion: function() {

            var position = new JC.Vector3();
            var scale = new JC.Vector3();

            return function(optionalTarget) {

                var result = optionalTarget || new JC.Quaternion();

                this.updateMatrixWorld(true);

                this.matrixWorld.decompose(position, result, scale);

                return result;

            };

        }(),

        getWorldRotation: function() {

            var quaternion = new JC.Quaternion();

            return function(optionalTarget) {

                var result = optionalTarget || new JC.Euler();

                this.getWorldQuaternion(quaternion);

                return result.setFromQuaternion(quaternion, this.rotation.order, false);

            };

        }(),

        getWorldScale: function() {

            var position = new JC.Vector3();
            var quaternion = new JC.Quaternion();

            return function(optionalTarget) {

                var result = optionalTarget || new JC.Vector3();

                this.updateMatrixWorld(true);

                this.matrixWorld.decompose(position, quaternion, result);

                return result;

            };

        }(),

        getWorldDirection: function() {

            var quaternion = new JC.Quaternion();

            return function(optionalTarget) {

                var result = optionalTarget || new JC.Vector3();

                this.getWorldQuaternion(quaternion);

                return result.set(0, 0, 1).applyQuaternion(quaternion);

            };

        }(),

        raycast: function() {},

        updateMatrix: function() {

            this.matrix.compose(this.position, this.quaternion, this.scale);

            this.matrixWorldNeedsUpdate = true;

        },

        updateMatrixWorld: function(force) {

            if (this.matrixAutoUpdate === true) this.updateMatrix();

            if (this.matrixWorldNeedsUpdate === true || force === true) {

                if (this.parent === null) {

                    this.matrixWorld.copy(this.matrix);

                } else {

                    this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);

                }

                this.matrixWorldNeedsUpdate = false;

                force = true;

            }

            // update children

            for (var i = 0, l = this.children.length; i < l; i++) {

                this.children[i].updateMatrixWorld(force);

            }

        },

        render: function(gl, session) {
            this.renderMe(gl, session);
            for (var i = 0; i < this.children.length; i++) {

                var child = this.children[i];
                child.render(gl, session);

            }
        },

        renderMe: function() {}

    };

    Object3DIdCount = 0;


    JC.Scene = function() {

        JC.Object3D.call(this);

        this.fog = null;
        this.overrideMaterial = null;

        this.matrixAutoUpdate = false;

        this.autoUpdate = true;

    };

    JC.Scene.prototype = Object.create(JC.Object3D.prototype);
    JC.Scene.prototype.constructor = JC.Scene;


    JC.Camera = function() {

        JC.Object3D.call(this);

        this.type = 'Camera';

        this.matrixWorldInverse = new JC.Matrix4();
        this.projectionMatrix = new JC.Matrix4();

    };

    JC.Camera.prototype = Object.create(JC.Object3D.prototype);
    JC.Camera.prototype.constructor = JC.Camera;

    JC.Camera.prototype.getWorldDirection = function() {

        var quaternion = new JC.Quaternion();

        return function(optionalTarget) {

            var result = optionalTarget || new JC.Vector3();

            this.getWorldQuaternion(quaternion);

            return result.set(0, 0, -1).applyQuaternion(quaternion);

        };

    }();

    JC.Camera.prototype.lookAt = function() {

        // This routine does not support cameras with rotated and/or translated parent(s)

        var m1 = new JC.Matrix4();

        return function(vector) {

            m1.lookAt(this.position, vector, this.up);

            this.quaternion.setFromRotationMatrix(m1);

        };

    }();


    JC.PerspectiveCamera = function(fov, aspect, near, far) {

        JC.Camera.call(this);

        this.type = 'JC.PerspectiveCamera';

        this.zoom = 1;

        this.fov = fov !== undefined ? fov : 50;
        this.aspect = aspect !== undefined ? aspect : 1;
        this.near = near !== undefined ? near : 0.1;
        this.far = far !== undefined ? far : 2000;

        this.updateProjectionMatrix();

    };

    JC.PerspectiveCamera.prototype = Object.create(JC.Camera.prototype);

    JC.PerspectiveCamera.prototype.constructor = JC.PerspectiveCamera;

    JC.PerspectiveCamera.prototype.updateProjectionMatrix = function() {

        var fov = JC.Math.radToDeg(2 * Math.atan(Math.tan(JC.Math.degToRad(this.fov) * 0.5) / this.zoom));

        this.projectionMatrix.makePerspective(fov, this.aspect, this.near, this.far);

    };


    JC.Renderer = function(dom, parameters) {
        this.domElement = typeof dom === 'string' ? document.getElementById(dom) : dom;
        var This = this,
            _alpha = parameters.alpha !== undefined ? parameters.alpha : true,
            _depth = parameters.depth !== undefined ? parameters.depth : true,
            _stencil = parameters.stencil !== undefined ? parameters.stencil : true,
            _antialias = parameters.antialias !== undefined ? parameters.antialias : false,
            _premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
            _preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;


        this.gl = initGL();
        this.shaderManager = new JC.ShaderManager(this.gl);
        this.autoUpdateScene = true;

        function initGL() {
            var gl,
                attributes = {
                    alpha: _alpha,
                    depth: _depth,
                    stencil: _stencil,
                    antialias: _antialias,
                    premultipliedAlpha: _premultipliedAlpha,
                    preserveDrawingBuffer: _preserveDrawingBuffer
                };

            try {

                if (!(gl = This.domElement.getContext('webgl', attributes) || This.domElement.getContext('experimental-webgl', attributes))) {

                    throw 'Error creating WebGL context.';

                }

                console.log(
                    navigator.userAgent + " | " +
                    gl.getParameter(gl.VERSION) + " | " +
                    gl.getParameter(gl.VENDOR) + " | " +
                    gl.getParameter(gl.RENDERER) + " | " +
                    gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
                );

            } catch (error) {

                console.error(error);

            }

            return gl;

        }
    };
    JC.Renderer.prototype.render = function(scene, camera) {

        if (scene.autoUpdate === true) scene.updateMatrixWorld();

        // update camera matrices and frustum

        if (camera.parent === null) camera.updateMatrixWorld();

        camera.matrixWorldInverse.getInverse(camera.matrixWorld);

        // _projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
        // _frustum.setFromMatrix( _projScreenMatrix );

        // _projScreenMatrix.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
        // _frustum.setFromMatrix( _projScreenMatrix );

        var session = {
            camera: camera,
            shaderManager: this.shaderManager
        };

        for (var i = 0; i < scene.children.length; i++) {
            scene.children[i].render(this.gl, session);
        }
    };



    CompileVertexShader = function(gl, shaderSrc) {
        return _CompileShader(gl, shaderSrc, gl.VERTEX_SHADER);
    };
    CompileFragmentShader = function(gl, shaderSrc) {
        return _CompileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
    };
    _CompileShader = function(gl, shaderSrc, shaderType) {
        var src = shaderSrc;
        var shader = gl.createShader(shaderType);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            window.console.log(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    };
    compileProgram = function(gl, vertexSrc, fragmentSrc) {
        var fragmentShader = CompileFragmentShader(gl, fragmentSrc);
        var vertexShader = CompileVertexShader(gl, vertexSrc);

        var shaderProgram = gl.createProgram();

        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            window.console.log("Could not initialise shaders");
        }

        return shaderProgram;
    };
    getAttribLocation = function(gl, prg, attributes) {
        var loc = {};
        for (var attr in attributes) {
            loc[attr] = gl.getAttribLocation(prg, attributes[attr]);
        }
        return loc;
    };
    getUniformLocation = function(gl, prg, uniforms) {
        var loc = {};
        for (var attr in uniforms) {
            loc[attr] = gl.getUniformLocation(prg, uniforms[attr]);
        }
        return loc;
    };

    JC.Material = function() {

        Object.defineProperty(this, 'id', { value: JC.MaterialIdCount++ });

        this.uuid = JC.Math.generateUUID();

        this.name = '';
        this.type = 'Material';

        this.side = JC.FrontSide;

        this.opacity = 1;
        this.transparent = false;

        this.blending = JC.NormalBlending;

        this.blendSrc = JC.SrcAlphaFactor;
        this.blendDst = JC.OneMinusSrcAlphaFactor;
        this.blendEquation = JC.AddEquation;
        this.blendSrcAlpha = null;
        this.blendDstAlpha = null;
        this.blendEquationAlpha = null;

        this.depthFunc = JC.LessEqualDepth;
        this.depthTest = true;
        this.depthWrite = true;

        this.colorWrite = true;

        this.precision = null; // override the renderer's default precision for this material

        this.polygonOffset = false;
        this.polygonOffsetFactor = 0;
        this.polygonOffsetUnits = 0;

        this.alphaTest = 0;
        this.premultipliedAlpha = false;

        this.overdraw = 0; // Overdrawn pixels (typically between 0 and 1) for fixing antialiasing gaps in CanvasRenderer

        this.visible = true;

        this._needsUpdate = true;

    };

    JC.Material.prototype = {

        constructor: JC.Material,

        get needsUpdate() {

            return this._needsUpdate;

        },

        set needsUpdate(value) {

            if (value === true) this.update();

            this._needsUpdate = value;

        },

        setValues: function(values) {

            if (values === undefined) return;

            for (var key in values) {

                var newValue = values[key];

                if (newValue === undefined) {

                    console.warn("JC.Material: '" + key + "' parameter is undefined.");
                    continue;

                }

                var currentValue = this[key];

                if (currentValue === undefined) {

                    console.warn("JC." + this.type + ": '" + key + "' is not a property of this material.");
                    continue;

                }

                if (currentValue instanceof JC.Color) {

                    currentValue.set(newValue);

                } else if (currentValue instanceof JC.Vector3 && newValue instanceof JC.Vector3) {

                    currentValue.copy(newValue);

                } else if (key === 'overdraw') {

                    // ensure overdraw is backwards-compatible with legacy boolean type
                    this[key] = Number(newValue);

                } else {

                    this[key] = newValue;

                }

            }

        }

    };

    JC.MaterialIdCount = 0;



    JC.Geometry = function() {

        Object.defineProperty(this, 'id', { value: JC.GeometryIdCount++ });

        this.uuid = JC.Math.generateUUID();

        this.name = '';
        this.type = 'Geometry';

        this.vertices = [];
        this.colors = [];
        this.faces = [];
        this.faceVertexUvs = [
            []
        ];

        this.morphTargets = [];
        this.morphNormals = [];

        this.skinWeights = [];
        this.skinIndices = [];

        this.lineDistances = [];

        this.boundingBox = null;
        this.boundingSphere = null;

        // update flags

        this.verticesNeedUpdate = false;
        this.elementsNeedUpdate = false;
        this.uvsNeedUpdate = false;
        this.normalsNeedUpdate = false;
        this.colorsNeedUpdate = false;
        this.lineDistancesNeedUpdate = false;
        this.groupsNeedUpdate = false;

    };

    JC.Geometry.prototype = {

        constructor: JC.Geometry,

        applyMatrix: function(matrix) {

            var normalMatrix = new JC.Matrix3().getNormalMatrix(matrix);

            for (var i = 0, il = this.vertices.length; i < il; i++) {

                var vertex = this.vertices[i];
                vertex.applyMatrix4(matrix);

            }

            for (var i = 0, il = this.faces.length; i < il; i++) {

                var face = this.faces[i];
                face.normal.applyMatrix3(normalMatrix).normalize();

                for (var j = 0, jl = face.vertexNormals.length; j < jl; j++) {

                    face.vertexNormals[j].applyMatrix3(normalMatrix).normalize();

                }

            }

            if (this.boundingBox !== null) {

                this.computeBoundingBox();

            }

            if (this.boundingSphere !== null) {

                this.computeBoundingSphere();

            }

            this.verticesNeedUpdate = true;
            this.normalsNeedUpdate = true;

            return this;

        },

        rotateX: function() {

            // rotate geometry around world x-axis

            var m1;

            return function rotateX(angle) {

                if (m1 === undefined) m1 = new JC.Matrix4();

                m1.makeRotationX(angle);

                this.applyMatrix(m1);

                return this;

            };

        }(),

        rotateY: function() {

            // rotate geometry around world y-axis

            var m1;

            return function rotateY(angle) {

                if (m1 === undefined) m1 = new JC.Matrix4();

                m1.makeRotationY(angle);

                this.applyMatrix(m1);

                return this;

            };

        }(),

        rotateZ: function() {

            // rotate geometry around world z-axis

            var m1;

            return function rotateZ(angle) {

                if (m1 === undefined) m1 = new JC.Matrix4();

                m1.makeRotationZ(angle);

                this.applyMatrix(m1);

                return this;

            };

        }(),

        translate: function() {

            // translate geometry

            var m1;

            return function translate(x, y, z) {

                if (m1 === undefined) m1 = new JC.Matrix4();

                m1.makeTranslation(x, y, z);

                this.applyMatrix(m1);

                return this;

            };

        }(),

        scale: function() {

            // scale geometry

            var m1;

            return function scale(x, y, z) {

                if (m1 === undefined) m1 = new JC.Matrix4();

                m1.makeScale(x, y, z);

                this.applyMatrix(m1);

                return this;

            };

        }(),

        lookAt: function() {

            var obj;

            return function lookAt(vector) {

                if (obj === undefined) obj = new JC.Object3D();

                obj.lookAt(vector);

                obj.updateMatrix();

                this.applyMatrix(obj.matrix);

            };

        }(),

        fromBufferGeometry: function(geometry) {

            var scope = this;

            var indices = geometry.index !== null ? geometry.index.array : undefined;
            var attributes = geometry.attributes;

            var positions = attributes.position.array;
            var normals = attributes.normal !== undefined ? attributes.normal.array : undefined;
            var colors = attributes.color !== undefined ? attributes.color.array : undefined;
            var uvs = attributes.uv !== undefined ? attributes.uv.array : undefined;
            var uvs2 = attributes.uv2 !== undefined ? attributes.uv2.array : undefined;

            if (uvs2 !== undefined) this.faceVertexUvs[1] = [];

            var tempNormals = [];
            var tempUVs = [];
            var tempUVs2 = [];

            for (var i = 0, j = 0; i < positions.length; i += 3, j += 2) {

                scope.vertices.push(new JC.Vector3(positions[i], positions[i + 1], positions[i + 2]));

                if (normals !== undefined) {

                    tempNormals.push(new JC.Vector3(normals[i], normals[i + 1], normals[i + 2]));

                }

                if (colors !== undefined) {

                    scope.colors.push(new JC.Color(colors[i], colors[i + 1], colors[i + 2]));

                }

                if (uvs !== undefined) {

                    tempUVs.push(new JC.Vector2(uvs[j], uvs[j + 1]));

                }

                if (uvs2 !== undefined) {

                    tempUVs2.push(new JC.Vector2(uvs2[j], uvs2[j + 1]));

                }

            }

            function addFace(a, b, c, materialIndex) {

                var vertexNormals = normals !== undefined ? [tempNormals[a].clone(), tempNormals[b].clone(), tempNormals[c].clone()] : [];
                var vertexColors = colors !== undefined ? [scope.colors[a].clone(), scope.colors[b].clone(), scope.colors[c].clone()] : [];

                var face = new JC.Face3(a, b, c, vertexNormals, vertexColors, materialIndex);

                scope.faces.push(face);

                if (uvs !== undefined) {

                    scope.faceVertexUvs[0].push([tempUVs[a].clone(), tempUVs[b].clone(), tempUVs[c].clone()]);

                }

                if (uvs2 !== undefined) {

                    scope.faceVertexUvs[1].push([tempUVs2[a].clone(), tempUVs2[b].clone(), tempUVs2[c].clone()]);

                }

            }

            if (indices !== undefined) {

                var groups = geometry.groups;

                if (groups.length > 0) {

                    for (var i = 0; i < groups.length; i++) {

                        var group = groups[i];

                        var start = group.start;
                        var count = group.count;

                        for (var j = start, jl = start + count; j < jl; j += 3) {

                            addFace(indices[j], indices[j + 1], indices[j + 2], group.materialIndex);

                        }

                    }

                } else {

                    for (var i = 0; i < indices.length; i += 3) {

                        addFace(indices[i], indices[i + 1], indices[i + 2]);

                    }

                }

            } else {

                for (var i = 0; i < positions.length / 3; i += 3) {

                    addFace(i, i + 1, i + 2);

                }

            }

            this.computeFaceNormals();

            if (geometry.boundingBox !== null) {

                this.boundingBox = geometry.boundingBox.clone();

            }

            if (geometry.boundingSphere !== null) {

                this.boundingSphere = geometry.boundingSphere.clone();

            }

            return this;

        },

        center: function() {

            this.computeBoundingBox();

            var offset = this.boundingBox.center().negate();

            this.translate(offset.x, offset.y, offset.z);

            return offset;

        },

        normalize: function() {

            this.computeBoundingSphere();

            var center = this.boundingSphere.center;
            var radius = this.boundingSphere.radius;

            var s = radius === 0 ? 1 : 1.0 / radius;

            var matrix = new JC.Matrix4();
            matrix.set(
                s, 0, 0, -s * center.x,
                0, s, 0, -s * center.y,
                0, 0, s, -s * center.z,
                0, 0, 0, 1
            );

            this.applyMatrix(matrix);

            return this;

        },

        computeFaceNormals: function() {

            var cb = new JC.Vector3(),
                ab = new JC.Vector3();

            for (var f = 0, fl = this.faces.length; f < fl; f++) {

                var face = this.faces[f];

                var vA = this.vertices[face.a];
                var vB = this.vertices[face.b];
                var vC = this.vertices[face.c];

                cb.subVectors(vC, vB);
                ab.subVectors(vA, vB);
                cb.cross(ab);

                cb.normalize();

                face.normal.copy(cb);

            }

        },

        computeVertexNormals: function(areaWeighted) {

            if (areaWeighted === undefined) areaWeighted = true;

            var v, vl, f, fl, face, vertices;

            vertices = new Array(this.vertices.length);

            for (v = 0, vl = this.vertices.length; v < vl; v++) {

                vertices[v] = new JC.Vector3();

            }

            if (areaWeighted) {

                // vertex normals weighted by triangle areas
                // http://www.iquilezles.org/www/articles/normals/normals.htm

                var vA, vB, vC;
                var cb = new JC.Vector3(),
                    ab = new JC.Vector3();

                for (f = 0, fl = this.faces.length; f < fl; f++) {

                    face = this.faces[f];

                    vA = this.vertices[face.a];
                    vB = this.vertices[face.b];
                    vC = this.vertices[face.c];

                    cb.subVectors(vC, vB);
                    ab.subVectors(vA, vB);
                    cb.cross(ab);

                    vertices[face.a].add(cb);
                    vertices[face.b].add(cb);
                    vertices[face.c].add(cb);

                }

            } else {

                for (f = 0, fl = this.faces.length; f < fl; f++) {

                    face = this.faces[f];

                    vertices[face.a].add(face.normal);
                    vertices[face.b].add(face.normal);
                    vertices[face.c].add(face.normal);

                }

            }

            for (v = 0, vl = this.vertices.length; v < vl; v++) {

                vertices[v].normalize();

            }

            for (f = 0, fl = this.faces.length; f < fl; f++) {

                face = this.faces[f];

                var vertexNormals = face.vertexNormals;

                if (vertexNormals.length === 3) {

                    vertexNormals[0].copy(vertices[face.a]);
                    vertexNormals[1].copy(vertices[face.b]);
                    vertexNormals[2].copy(vertices[face.c]);

                } else {

                    vertexNormals[0] = vertices[face.a].clone();
                    vertexNormals[1] = vertices[face.b].clone();
                    vertexNormals[2] = vertices[face.c].clone();

                }

            }

            if (this.faces.length > 0) {

                this.normalsNeedUpdate = true;

            }

        },

        computeMorphNormals: function() {

            var i, il, f, fl, face;

            // save original normals
            // - create temp variables on first access
            //   otherwise just copy (for faster repeated calls)

            for (f = 0, fl = this.faces.length; f < fl; f++) {

                face = this.faces[f];

                if (!face.__originalFaceNormal) {

                    face.__originalFaceNormal = face.normal.clone();

                } else {

                    face.__originalFaceNormal.copy(face.normal);

                }

                if (!face.__originalVertexNormals) face.__originalVertexNormals = [];

                for (i = 0, il = face.vertexNormals.length; i < il; i++) {

                    if (!face.__originalVertexNormals[i]) {

                        face.__originalVertexNormals[i] = face.vertexNormals[i].clone();

                    } else {

                        face.__originalVertexNormals[i].copy(face.vertexNormals[i]);

                    }

                }

            }

            // use temp geometry to compute face and vertex normals for each morph

            var tmpGeo = new JC.Geometry();
            tmpGeo.faces = this.faces;

            for (i = 0, il = this.morphTargets.length; i < il; i++) {

                // create on first access

                if (!this.morphNormals[i]) {

                    this.morphNormals[i] = {};
                    this.morphNormals[i].faceNormals = [];
                    this.morphNormals[i].vertexNormals = [];

                    var dstNormalsFace = this.morphNormals[i].faceNormals;
                    var dstNormalsVertex = this.morphNormals[i].vertexNormals;

                    var faceNormal, vertexNormals;

                    for (f = 0, fl = this.faces.length; f < fl; f++) {

                        faceNormal = new JC.Vector3();
                        vertexNormals = { a: new JC.Vector3(), b: new JC.Vector3(), c: new JC.Vector3() };

                        dstNormalsFace.push(faceNormal);
                        dstNormalsVertex.push(vertexNormals);

                    }

                }

                var morphNormals = this.morphNormals[i];

                // set vertices to morph target

                tmpGeo.vertices = this.morphTargets[i].vertices;

                // compute morph normals

                tmpGeo.computeFaceNormals();
                tmpGeo.computeVertexNormals();

                // store morph normals

                var faceNormal, vertexNormals;

                for (f = 0, fl = this.faces.length; f < fl; f++) {

                    face = this.faces[f];

                    faceNormal = morphNormals.faceNormals[f];
                    vertexNormals = morphNormals.vertexNormals[f];

                    faceNormal.copy(face.normal);

                    vertexNormals.a.copy(face.vertexNormals[0]);
                    vertexNormals.b.copy(face.vertexNormals[1]);
                    vertexNormals.c.copy(face.vertexNormals[2]);

                }

            }

            // restore original normals

            for (f = 0, fl = this.faces.length; f < fl; f++) {

                face = this.faces[f];

                face.normal = face.__originalFaceNormal;
                face.vertexNormals = face.__originalVertexNormals;

            }

        },

        computeTangents: function() {

            console.warn('JC.Geometry: .computeTangents() has been removed.');

        },

        computeLineDistances: function() {

            var d = 0;
            var vertices = this.vertices;

            for (var i = 0, il = vertices.length; i < il; i++) {

                if (i > 0) {

                    d += vertices[i].distanceTo(vertices[i - 1]);

                }

                this.lineDistances[i] = d;

            }

        },

        computeBoundingBox: function() {

            if (this.boundingBox === null) {

                this.boundingBox = new JC.Box3();

            }

            this.boundingBox.setFromPoints(this.vertices);

        },

        computeBoundingSphere: function() {

            if (this.boundingSphere === null) {

                this.boundingSphere = new JC.Sphere();

            }

            this.boundingSphere.setFromPoints(this.vertices);

        },

        merge: function(geometry, matrix, materialIndexOffset) {

            if (geometry instanceof JC.Geometry === false) {

                console.error('JC.Geometry.merge(): geometry not an instance of JC.Geometry.', geometry);
                return;

            }

            var normalMatrix,
                vertexOffset = this.vertices.length,
                vertices1 = this.vertices,
                vertices2 = geometry.vertices,
                faces1 = this.faces,
                faces2 = geometry.faces,
                uvs1 = this.faceVertexUvs[0],
                uvs2 = geometry.faceVertexUvs[0];

            if (materialIndexOffset === undefined) materialIndexOffset = 0;

            if (matrix !== undefined) {

                normalMatrix = new JC.Matrix3().getNormalMatrix(matrix);

            }

            // vertices

            for (var i = 0, il = vertices2.length; i < il; i++) {

                var vertex = vertices2[i];

                var vertexCopy = vertex.clone();

                if (matrix !== undefined) vertexCopy.applyMatrix4(matrix);

                vertices1.push(vertexCopy);

            }

            // faces

            for (i = 0, il = faces2.length; i < il; i++) {

                var face = faces2[i],
                    faceCopy, normal, color,
                    faceVertexNormals = face.vertexNormals,
                    faceVertexColors = face.vertexColors;

                faceCopy = new JC.Face3(face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset);
                faceCopy.normal.copy(face.normal);

                if (normalMatrix !== undefined) {

                    faceCopy.normal.applyMatrix3(normalMatrix).normalize();

                }

                for (var j = 0, jl = faceVertexNormals.length; j < jl; j++) {

                    normal = faceVertexNormals[j].clone();

                    if (normalMatrix !== undefined) {

                        normal.applyMatrix3(normalMatrix).normalize();

                    }

                    faceCopy.vertexNormals.push(normal);

                }

                faceCopy.color.copy(face.color);

                for (var j = 0, jl = faceVertexColors.length; j < jl; j++) {

                    color = faceVertexColors[j];
                    faceCopy.vertexColors.push(color.clone());

                }

                faceCopy.materialIndex = face.materialIndex + materialIndexOffset;

                faces1.push(faceCopy);

            }

            // uvs

            for (i = 0, il = uvs2.length; i < il; i++) {

                var uv = uvs2[i],
                    uvCopy = [];

                if (uv === undefined) {

                    continue;

                }

                for (var j = 0, jl = uv.length; j < jl; j++) {

                    uvCopy.push(uv[j].clone());

                }

                uvs1.push(uvCopy);

            }

        },

        mergeMesh: function(mesh) {

            if (mesh instanceof JC.Mesh === false) {

                console.error('JC.Geometry.mergeMesh(): mesh not an instance of JC.Mesh.', mesh);
                return;

            }

            mesh.matrixAutoUpdate && mesh.updateMatrix();

            this.merge(mesh.geometry, mesh.matrix);

        },

        /*
         * Checks for duplicate vertices with hashmap.
         * Duplicated vertices are removed
         * and faces' vertices are updated.
         */

        mergeVertices: function() {

            var verticesMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
            var unique = [],
                changes = [];

            var v, key;
            var precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
            var precision = Math.pow(10, precisionPoints);
            var i, il, face;
            var indices, j, jl;

            for (i = 0, il = this.vertices.length; i < il; i++) {

                v = this.vertices[i];
                key = Math.round(v.x * precision) + '_' + Math.round(v.y * precision) + '_' + Math.round(v.z * precision);

                if (verticesMap[key] === undefined) {

                    verticesMap[key] = i;
                    unique.push(this.vertices[i]);
                    changes[i] = unique.length - 1;

                } else {

                    //console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
                    changes[i] = changes[verticesMap[key]];

                }

            }


            // if faces are completely degenerate after merging vertices, we
            // have to remove them from the geometry.
            var faceIndicesToRemove = [];

            for (i = 0, il = this.faces.length; i < il; i++) {

                face = this.faces[i];

                face.a = changes[face.a];
                face.b = changes[face.b];
                face.c = changes[face.c];

                indices = [face.a, face.b, face.c];

                var dupIndex = -1;

                // if any duplicate vertices are found in a Face3
                // we have to remove the face as nothing can be saved
                for (var n = 0; n < 3; n++) {

                    if (indices[n] === indices[(n + 1) % 3]) {

                        dupIndex = n;
                        faceIndicesToRemove.push(i);
                        break;

                    }

                }

            }

            for (i = faceIndicesToRemove.length - 1; i >= 0; i--) {

                var idx = faceIndicesToRemove[i];

                this.faces.splice(idx, 1);

                for (j = 0, jl = this.faceVertexUvs.length; j < jl; j++) {

                    this.faceVertexUvs[j].splice(idx, 1);

                }

            }

            // Use unique set of vertices

            var diff = this.vertices.length - unique.length;
            this.vertices = unique;
            return diff;

        },

        sortFacesByMaterialIndex: function() {

            var faces = this.faces;
            var length = faces.length;

            // tag faces

            for (var i = 0; i < length; i++) {

                faces[i]._id = i;

            }

            // sort faces

            function materialIndexSort(a, b) {

                return a.materialIndex - b.materialIndex;

            }

            faces.sort(materialIndexSort);

            // sort uvs

            var uvs1 = this.faceVertexUvs[0];
            var uvs2 = this.faceVertexUvs[1];

            var newUvs1, newUvs2;

            if (uvs1 && uvs1.length === length) newUvs1 = [];
            if (uvs2 && uvs2.length === length) newUvs2 = [];

            for (var i = 0; i < length; i++) {

                var id = faces[i]._id;

                if (newUvs1) newUvs1.push(uvs1[id]);
                if (newUvs2) newUvs2.push(uvs2[id]);

            }

            if (newUvs1) this.faceVertexUvs[0] = newUvs1;
            if (newUvs2) this.faceVertexUvs[1] = newUvs2;

        }

    };


    JC.ShaderManager = function(gl) {
        this.pool = {};
        this.gl = gl;
        this.curPRG = null;
        this.PRG = null;
    };

    JC.ShaderManager.prototype.register = function(opts) {
        if (this.pool[opts.id]) return;
        var prg = compileProgram(this.gl, opts.vertexSrc, opts.fragmentSrc);
        this.gl.useProgram(prg);
        this.pool[opts.id] = {
            program: prg,
            attributes: getAttribLocation(this.gl, prg, opts.attributes),
            uniforms: getUniformLocation(this.gl, prg, opts.uniforms)
        };
    };

    JC.ShaderManager.prototype.upload = function(id) {
        if (id === this.curPRG) return;
        this.gl.useProgram(this.pool[id].program);
        this.PRG = this.pool[id];
    };


    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = JC;
        }
        exports.JC = JC;
    } else if (typeof define !== 'undefined' && define.amd) {
        define(JC);
    } else {
        window.JC = JC;
    }

})();