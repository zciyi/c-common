/*
 * @lastTime: 2022-06-28 16:59:20
 * @LastAuthor: ciyi
 * @Description:
 */
import { util } from "./tools"
const { date,moneyZero } = util
var formatter = {
    date: function(val) {
        if (!val) return '-'
        if (val < 0) val = Math.abs(val)
        return date(val, 'Y-M-D');
    },
    dateM: function(val) {
        if (!val) return '-'
        if (val < 0) val = Math.abs(val)
        return date(val, 'Y-M');
    },
    dateYmdText:function(value) {
        return date(value, 'Y年M月D日');
    },
    dateH: function(value) {
        return date(value, 'Y-M-D h:m:s');
    },
    dateHm: function(value) {
        return date(value, 'Y-M-D h:m');
    },
    dateW: function(value) {
        return date(value, 'Y-M-D w')
    },
    dateS: function(val) {
        if (val < 0) val = Math.abs(val)
        return date(val, 'Y年M月')
    },
    time: function(val) {
        if (!val) return '-'
        if (val < 0) val = Math.abs(val)
        return date(val, 'h:m:s')
    },
    phoneSplit: function(str) {
        if (!str) {
            return '-';
        }
        return str.replace(/(\d{3})(\d{4})/, "$1 $2 ");
    
    },
    numberdot2: function(val) {
        let value = Number(val || 0) || 0
        return value.toFixed(2)
    },
    accountSplit: function(money) {
        if (money && money != null) {
            if (money == '-') {
                return money
            }
            money = String(money);
            var left = money.split('.')[0], right = money.split('.')[1];
            right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
            var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
            return (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
        } else if (money === 0) {   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
            return '0.00';
        } else {
            return "";
        }
    },
    // 千分位 没有值-
    moneyZeroUnit:function moneyZeroUnit(value,def) {
        if (!value && value!==0){
            return def || "-"
        } else {
            value = value + ""
            if (value.includes(",")) {
                return "CNY " + value
            } else {
                return "CNY " + moneyZero(value)
            }
        }
    }

}
export default formatter
