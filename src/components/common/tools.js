var utiltpm = {};

function isType(type) {
    return function(el) {
        return Object.prototype.toString.call(el) === "[object " + type + "]";
    };
}
var isArray = isType("Array");
var isObject = isType("Object");
var isFunction = isType("Function");
var isString = isType("String");
var isNumber = isType("Number");

function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, {
                        [key]: {}
                    });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {
                    [key]: source[key]
                });
            }
        }
    }
    return mergeDeep(target, ...sources);
}

function insertionSort(arr, key) {
    var len = arr.length,
        i,
        j,
        temp; // 储存未排序部分第一个元素，即要插入的元素
    // 遍历未排序部分
    for (i = 1; i < len; i++) {
        temp = arr[i];
        // 已排序部分最后一个元素
        j = i - 1;
        while (j >= 0 && Number(temp[key]) < Number(arr[j][key])) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = temp;
    }
    return arr;
}
utiltpm = {
    isArray: isArray,
    isObject: isObject,
    isFunction: isFunction,
    isString: isString,
    isUndefined: isUndefined,
    isNumber: isNumber,
    merge: mergeDeep,
    insertionSort: insertionSort
};

function checkNumber(n, t) {
    n = n + "";
    n = n && n.replace(/\s+/g, "");
    var filter = t ? /^([1-9]\d*|0)?(\.(\d{1,2})?)?$/ : /^([1-9]\d*|0)?$/;
    return filter.test(n);
}
utiltpm.numberChange = function(val, num, fix2, int) {
    val = val + "";
    if (checkNumber(val, fix2)) {
        let hasDot = val.indexOf(".");
        if (num) {
            if (hasDot > -1) {
                let tpm = val.split(".");
                val = tpm[0].slice(0, num) + "." + tpm[1].slice(0, fix2);
            } else if (val.length > num) {
                val = val.slice(0, num);
            }
        }
        if (int && hasDot > -1) {
            val = val.slice(0, hasDot);
        }
    } else {
        let tpm = val.split("");
        for (let i = 0; i < tpm.length; i++) {
            if (tpm[i] !== ".") {
                tpm[i] = tpm[i].replace(/\D/g, "");
            }
        }
        val = tpm.join("");
        if (val.indexOf(".") > -1) {
            let tpm1 = val.split(".");
            let tpm2 = tpm1[1].substring(0, 2);
            val = tpm1[0] + "." + tpm2;
        }
    }
    return val;
};

function fix0(val, length) {
    return ("000000000" + val).slice(-(length || 2));
}

function dateTpm(value, format) {
    // console.log("dateTpm -> value", value)
    if (value) {
        // if (value < 0) value = parseInt(Math.abs(value))
        // console.log("dateTpm2424 -> value", value)
        format = format || "Y-M-D ";
        if (
            value.length > 4 &&
            value.indexOf("/") === -1 &&
            value.indexOf("-") === -1
        ) {
            value = Number(value);
        }
        if (!value) return "";
        let week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        var date = new Date(value);
        var Y = date.getFullYear();
        var M =
            date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1;
        var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var m =
            date.getMinutes() < 10
                ? "0" + date.getMinutes()
                : date.getMinutes();
        var s =
            date.getSeconds() < 10
                ? "0" + date.getSeconds()
                : date.getSeconds();
        var w = week[date.getDay()];
        var forma = format.split("");
        if (forma.length) {
            var dateVal = [];
            forma.forEach(function(f) {
                switch (f) {
                    case "Y":
                        dateVal.push(Y);
                        break;
                    case "M":
                        dateVal.push(M);
                        break;
                    case "D":
                        dateVal.push(D);
                        break;
                    case "h":
                        dateVal.push(h);
                        break;
                    case "m":
                        dateVal.push(m);
                        break;
                    case "s":
                        dateVal.push(s);
                        break;
                    case "w":
                        dateVal.push(w);
                        break;
                    default:
                        dateVal.push(f);
                        break;
                }
            });
            return dateVal.join("");
        }
        return "";
    } else {
        return "";
    }
}

/**
 * 是否 undefined
 * @param  {Mix} subject 待判断的数据
 */
function isUndefined(subject) {
    return isType(subject, "undefined");
}

// 判断是不是pormise函数
utiltpm.isPromise = value => {
    return (
        value && Object.prototype.toString.call(value) === "[object Promise]"
    );
};


// 获取计算值
const getCountNumber = (i, j) => {
    if (i === "NaN" || !i) i = 0;
    if (j === "NaN" || !j) j = 0;
    return { i, j };
};

// 获取浮点对应的转换数值
const getCountFixed = fixed => {
    return !fixed || fixed < 3 ? 100 : Math.pow(10, fixed);
};

// 计算处理 （加减乘除）
utiltpm.count = {
    //加
    add(arg1, arg2, fixed) {
        const { i, j } = getCountNumber(arg1, arg2);
        const num = getCountFixed(fixed);
        return ((Math.round(i * num) + Math.round(j * num)) / num).toFixed(fixed);
    },
    //减
    reduce(arg1, arg2, fixed) {
        const { i, j } = getCountNumber(arg1, arg2);
        const num = getCountFixed(fixed);
        return ((Math.round(i * num) - Math.round(j * num)) / num).toFixed(fixed);
    },
    //乘
    multiply(arg1, arg2, fixed) {
        const { i, j } = getCountNumber(arg1, arg2);
        const num = getCountFixed(fixed);
        return (Math.round(i * num * (j * num)) / num / num).toFixed(fixed);
    },
    //除
    divide(arg1, arg2, fixed) {
        const { i, j } = getCountNumber(arg1, arg2);
        return ((i * 1) / (j * 1)).toFixed(fixed);
    }
};

// 判断是否不是空
utiltpm.isEmpty = value => {
    if (
        value === null ||
        value === "" ||
        value === "undefined" ||
        value === undefined ||
        value === "null" ||
        JSON.stringify(value) == "{}" ||
        JSON.stringify(value) == "[]"
    ) {
        return true;
    } else {
        value =
            value !== 0
                ? JSON.parse(JSON.stringify(value).replace(/\s+/g, ""))
                : value;
        if (value === "") {
            return true;
        }
        return false;
    }
};

utiltpm.isUndefined = isUndefined;
utiltpm.fix0 = fix0;
utiltpm.date = dateTpm;


utiltpm.hasGetSelected = function() {
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.getSelection) {
        return document.getSelection().toString();
    } else {
        var selection = document.selection && document.selection.createRange();
        if (selection.text) {
            return selection.text.toString();
        }
        return "";
    }
}


utiltpm.moneyZero = function (value) {
    if (value && value.includes(",")) {
        return value
    }
    let money = parseFloat(value);
    if (!value) {
        return '0.00';
    }
    if (String(value).indexOf('.') == -1) {
        money = money + '.00'
    }

    if (money && money != null) {
        money = String(money);
        var left = money.split('.')[0],
            right = money.split('.')[1];
        right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
        var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
        if (temp) {
            return (Number(money) < 0 ? '-' : '') + temp.join(',').split('').reverse().join('') + right;
        } else {
            return '0.00'
        }
    } else if (money === 0) { // 注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
        return '0.00';
    } else {
        return '';
    }
}
export var util = utiltpm;
