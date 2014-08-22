(function(undefined) {
    function padToken(func, count) {
        return function(a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function(a) {
            return this.lang().ordinal(func.call(this, a), period);
        };
    }
    function Language() {}
    function Moment(config) {
        extend(this, config);
    }
    function Duration(duration) {
        var years = duration.years || duration.year || duration.y || 0, months = duration.months || duration.month || duration.M || 0, weeks = duration.weeks || duration.week || duration.w || 0, days = duration.days || duration.day || duration.d || 0, hours = duration.hours || duration.hour || duration.h || 0, minutes = duration.minutes || duration.minute || duration.m || 0, seconds = duration.seconds || duration.second || duration.s || 0, milliseconds = duration.milliseconds || duration.millisecond || duration.ms || 0;
        this._input = duration;
        this._milliseconds = milliseconds + 1e3 * seconds + 6e4 * minutes + 36e5 * hours;
        this._days = days + 7 * weeks;
        this._months = months + 12 * years;
        this._data = {};
        this._bubble();
    }
    function extend(a, b) {
        for (var i in b) b.hasOwnProperty(i) && (a[i] = b[i]);
        return a;
    }
    function absRound(number) {
        return 0 > number ? Math.ceil(number) : Math.floor(number);
    }
    function leftZeroFill(number, targetLength) {
        var output = number + "";
        while (targetLength > output.length) output = "0" + output;
        return output;
    }
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, ignoreUpdateOffset) {
        var minutes, hours, milliseconds = duration._milliseconds, days = duration._days, months = duration._months;
        milliseconds && mom._d.setTime(+mom._d + milliseconds * isAdding);
        if (days || months) {
            minutes = mom.minute();
            hours = mom.hour();
        }
        days && mom.date(mom.date() + days * isAdding);
        months && mom.month(mom.month() + months * isAdding);
        milliseconds && !ignoreUpdateOffset && moment.updateOffset(mom);
        if (days || months) {
            mom.minute(minutes);
            mom.hour(hours);
        }
    }
    function isArray(input) {
        return "[object Array]" === Object.prototype.toString.call(input);
    }
    function compareArrays(array1, array2) {
        var i, len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0;
        for (i = 0; len > i; i++) ~~array1[i] !== ~~array2[i] && diffs++;
        return diffs + lengthDiff;
    }
    function normalizeUnits(units) {
        return units ? unitAliases[units] || units.toLowerCase().replace(/(.)s$/, "$1") : units;
    }
    function loadLang(key, values) {
        values.abbr = key;
        languages[key] || (languages[key] = new Language());
        languages[key].set(values);
        return languages[key];
    }
    function getLangDefinition(key) {
        if (!key) return moment.fn._lang;
        if (!languages[key] && hasModule) try {
            loadLang(key, require("alloy/moment/lang/" + key));
        } catch (e) {
            return moment.fn._lang;
        }
        return languages[key];
    }
    function removeFormattingTokens(input) {
        if (input.match(/\[.*\]/)) return input.replace(/^\[|\]$/g, "");
        return input.replace(/\\/g, "");
    }
    function makeFormatFunction(format) {
        var i, length, array = format.match(formattingTokens);
        for (i = 0, length = array.length; length > i; i++) array[i] = formatTokenFunctions[array[i]] ? formatTokenFunctions[array[i]] : removeFormattingTokens(array[i]);
        return function(mom) {
            var output = "";
            for (i = 0; length > i; i++) output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            return output;
        };
    }
    function formatMoment(m, format) {
        function replaceLongDateFormatTokens(input) {
            return m.lang().longDateFormat(input) || input;
        }
        var i = 5;
        while (i-- && localFormattingTokens.test(format)) format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        formatFunctions[format] || (formatFunctions[format] = makeFormatFunction(format));
        return formatFunctions[format](m);
    }
    function getParseRegexForToken(token, config) {
        switch (token) {
          case "DDDD":
            return parseTokenThreeDigits;

          case "YYYY":
            return parseTokenFourDigits;

          case "YYYYY":
            return parseTokenSixDigits;

          case "S":
          case "SS":
          case "SSS":
          case "DDD":
            return parseTokenOneToThreeDigits;

          case "MMM":
          case "MMMM":
          case "dd":
          case "ddd":
          case "dddd":
            return parseTokenWord;

          case "a":
          case "A":
            return getLangDefinition(config._l)._meridiemParse;

          case "X":
            return parseTokenTimestampMs;

          case "Z":
          case "ZZ":
            return parseTokenTimezone;

          case "T":
            return parseTokenT;

          case "MM":
          case "DD":
          case "YY":
          case "HH":
          case "hh":
          case "mm":
          case "ss":
          case "M":
          case "D":
          case "d":
          case "H":
          case "h":
          case "m":
          case "s":
            return parseTokenOneOrTwoDigits;

          default:
            return new RegExp(token.replace("\\", ""));
        }
    }
    function timezoneMinutesFromString(string) {
        var tzchunk = (parseTokenTimezone.exec(string) || [])[0], parts = (tzchunk + "").match(parseTimezoneChunker) || [ "-", 0, 0 ], minutes = +(60 * parts[1]) + ~~parts[2];
        return "+" === parts[0] ? -minutes : minutes;
    }
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;
        switch (token) {
          case "M":
          case "MM":
            datePartArray[1] = null == input ? 0 : ~~input - 1;
            break;

          case "MMM":
          case "MMMM":
            a = getLangDefinition(config._l).monthsParse(input);
            null != a ? datePartArray[1] = a : config._isValid = false;
            break;

          case "D":
          case "DD":
          case "DDD":
          case "DDDD":
            null != input && (datePartArray[2] = ~~input);
            break;

          case "YY":
            datePartArray[0] = ~~input + (~~input > 68 ? 1900 : 2e3);
            break;

          case "YYYY":
          case "YYYYY":
            datePartArray[0] = ~~input;
            break;

          case "a":
          case "A":
            config._isPm = getLangDefinition(config._l).isPM(input);
            break;

          case "H":
          case "HH":
          case "h":
          case "hh":
            datePartArray[3] = ~~input;
            break;

          case "m":
          case "mm":
            datePartArray[4] = ~~input;
            break;

          case "s":
          case "ss":
            datePartArray[5] = ~~input;
            break;

          case "S":
          case "SS":
          case "SSS":
            datePartArray[6] = ~~(1e3 * ("0." + input));
            break;

          case "X":
            config._d = new Date(1e3 * parseFloat(input));
            break;

          case "Z":
          case "ZZ":
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
        }
        null == input && (config._isValid = false);
    }
    function dateFromArray(config) {
        var i, date, input = [];
        if (config._d) return;
        for (i = 0; 7 > i; i++) config._a[i] = input[i] = null == config._a[i] ? 2 === i ? 1 : 0 : config._a[i];
        input[3] += ~~((config._tzm || 0) / 60);
        input[4] += ~~((config._tzm || 0) % 60);
        date = new Date(0);
        if (config._useUTC) {
            date.setUTCFullYear(input[0], input[1], input[2]);
            date.setUTCHours(input[3], input[4], input[5], input[6]);
        } else {
            date.setFullYear(input[0], input[1], input[2]);
            date.setHours(input[3], input[4], input[5], input[6]);
        }
        config._d = date;
    }
    function makeDateFromStringAndFormat(config) {
        var i, parsedInput, tokens = config._f.match(formattingTokens), string = config._i;
        config._a = [];
        for (i = 0; tokens.length > i; i++) {
            parsedInput = (getParseRegexForToken(tokens[i], config).exec(string) || [])[0];
            parsedInput && (string = string.slice(string.indexOf(parsedInput) + parsedInput.length));
            formatTokenFunctions[tokens[i]] && addTimeToArrayFromToken(tokens[i], parsedInput, config);
        }
        string && (config._il = string);
        config._isPm && 12 > config._a[3] && (config._a[3] += 12);
        false === config._isPm && 12 === config._a[3] && (config._a[3] = 0);
        dateFromArray(config);
    }
    function makeDateFromStringAndArray(config) {
        var tempConfig, tempMoment, bestMoment, i, currentScore, scoreToBeat = 99;
        for (i = 0; config._f.length > i; i++) {
            tempConfig = extend({}, config);
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);
            tempMoment = new Moment(tempConfig);
            currentScore = compareArrays(tempConfig._a, tempMoment.toArray());
            tempMoment._il && (currentScore += tempMoment._il.length);
            if (scoreToBeat > currentScore) {
                scoreToBeat = currentScore;
                bestMoment = tempMoment;
            }
        }
        extend(config, bestMoment);
    }
    function makeDateFromString(config) {
        var i, string = config._i, match = isoRegex.exec(string);
        if (match) {
            config._f = "YYYY-MM-DD" + (match[2] || " ");
            for (i = 0; 4 > i; i++) if (isoTimes[i][1].exec(string)) {
                config._f += isoTimes[i][0];
                break;
            }
            parseTokenTimezone.exec(string) && (config._f += " Z");
            makeDateFromStringAndFormat(config);
        } else config._d = new Date(string);
    }
    function makeDateFromInput(config) {
        var input = config._i, matched = aspNetJsonRegex.exec(input);
        if (input === undefined) config._d = new Date(); else if (matched) config._d = new Date(+matched[1]); else if ("string" == typeof input) makeDateFromString(config); else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromArray(config);
        } else config._d = input instanceof Date ? new Date(+input) : new Date(input);
    }
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }
    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1e3), minutes = round(seconds / 60), hours = round(minutes / 60), days = round(hours / 24), years = round(days / 365), args = 45 > seconds && [ "s", seconds ] || 1 === minutes && [ "m" ] || 45 > minutes && [ "mm", minutes ] || 1 === hours && [ "h" ] || 22 > hours && [ "hh", hours ] || 1 === days && [ "d" ] || 25 >= days && [ "dd", days ] || 45 >= days && [ "M" ] || 345 > days && [ "MM", round(days / 30) ] || 1 === years && [ "y" ] || [ "yy", years ];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var adjustedMoment, end = firstDayOfWeekOfYear - firstDayOfWeek, daysToDayOfWeek = firstDayOfWeekOfYear - mom.day();
        daysToDayOfWeek > end && (daysToDayOfWeek -= 7);
        end - 7 > daysToDayOfWeek && (daysToDayOfWeek += 7);
        adjustedMoment = moment(mom).add("d", daysToDayOfWeek);
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }
    function makeMoment(config) {
        var input = config._i, format = config._f;
        if (null === input || "" === input) return null;
        "string" == typeof input && (config._i = input = getLangDefinition().preparse(input));
        if (moment.isMoment(input)) {
            config = extend({}, input);
            config._d = new Date(+input._d);
        } else format ? isArray(format) ? makeDateFromStringAndArray(config) : makeDateFromStringAndFormat(config) : makeDateFromInput(config);
        return new Moment(config);
    }
    function makeGetterAndSetter(name, key) {
        moment.fn[name] = moment.fn[name + "s"] = function(input) {
            var utc = this._isUTC ? "UTC" : "";
            if (null != input) {
                this._d["set" + utc + key](input);
                moment.updateOffset(this);
                return this;
            }
            return this._d["get" + utc + key]();
        };
    }
    function makeDurationGetter(name) {
        moment.duration.fn[name] = function() {
            return this._data[name];
        };
    }
    function makeDurationAsGetter(name, factor) {
        moment.duration.fn["as" + name] = function() {
            return +this / factor;
        };
    }
    var moment, i, VERSION = "2.1.0", round = Math.round, languages = {}, hasModule = "undefined" != typeof module && module.exports, aspNetJsonRegex = /^\/?Date\((\-?\d+)/i, aspNetTimeSpanJsonRegex = /(\-)?(\d*)?\.?(\d+)\:(\d+)\:(\d+)\.?(\d{3})?/, formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, parseTokenOneOrTwoDigits = /\d\d?/, parseTokenOneToThreeDigits = /\d{1,3}/, parseTokenThreeDigits = /\d{3}/, parseTokenFourDigits = /\d{1,4}/, parseTokenSixDigits = /[+\-]?\d{1,6}/, parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i, parseTokenT = /T/i, parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, isoRegex = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/, isoFormat = "YYYY-MM-DDTHH:mm:ssZ", isoTimes = [ [ "HH:mm:ss.S", /(T| )\d\d:\d\d:\d\d\.\d{1,3}/ ], [ "HH:mm:ss", /(T| )\d\d:\d\d:\d\d/ ], [ "HH:mm", /(T| )\d\d:\d\d/ ], [ "HH", /(T| )\d\d/ ] ], parseTimezoneChunker = /([\+\-]|\d\d)/gi, proxyGettersAndSetters = "Date|Hours|Minutes|Seconds|Milliseconds".split("|"), unitMillisecondFactors = {
        Milliseconds: 1,
        Seconds: 1e3,
        Minutes: 6e4,
        Hours: 36e5,
        Days: 864e5,
        Months: 2592e6,
        Years: 31536e6
    }, unitAliases = {
        ms: "millisecond",
        s: "second",
        m: "minute",
        h: "hour",
        d: "day",
        w: "week",
        M: "month",
        y: "year"
    }, formatFunctions = {}, ordinalizeTokens = "DDD w W M D d".split(" "), paddedTokens = "M D H h m s w W".split(" "), formatTokenFunctions = {
        M: function() {
            return this.month() + 1;
        },
        MMM: function(format) {
            return this.lang().monthsShort(this, format);
        },
        MMMM: function(format) {
            return this.lang().months(this, format);
        },
        D: function() {
            return this.date();
        },
        DDD: function() {
            return this.dayOfYear();
        },
        d: function() {
            return this.day();
        },
        dd: function(format) {
            return this.lang().weekdaysMin(this, format);
        },
        ddd: function(format) {
            return this.lang().weekdaysShort(this, format);
        },
        dddd: function(format) {
            return this.lang().weekdays(this, format);
        },
        w: function() {
            return this.week();
        },
        W: function() {
            return this.isoWeek();
        },
        YY: function() {
            return leftZeroFill(this.year() % 100, 2);
        },
        YYYY: function() {
            return leftZeroFill(this.year(), 4);
        },
        YYYYY: function() {
            return leftZeroFill(this.year(), 5);
        },
        gg: function() {
            return leftZeroFill(this.weekYear() % 100, 2);
        },
        gggg: function() {
            return this.weekYear();
        },
        ggggg: function() {
            return leftZeroFill(this.weekYear(), 5);
        },
        GG: function() {
            return leftZeroFill(this.isoWeekYear() % 100, 2);
        },
        GGGG: function() {
            return this.isoWeekYear();
        },
        GGGGG: function() {
            return leftZeroFill(this.isoWeekYear(), 5);
        },
        e: function() {
            return this.weekday();
        },
        E: function() {
            return this.isoWeekday();
        },
        a: function() {
            return this.lang().meridiem(this.hours(), this.minutes(), true);
        },
        A: function() {
            return this.lang().meridiem(this.hours(), this.minutes(), false);
        },
        H: function() {
            return this.hours();
        },
        h: function() {
            return this.hours() % 12 || 12;
        },
        m: function() {
            return this.minutes();
        },
        s: function() {
            return this.seconds();
        },
        S: function() {
            return ~~(this.milliseconds() / 100);
        },
        SS: function() {
            return leftZeroFill(~~(this.milliseconds() / 10), 2);
        },
        SSS: function() {
            return leftZeroFill(this.milliseconds(), 3);
        },
        Z: function() {
            var a = -this.zone(), b = "+";
            if (0 > a) {
                a = -a;
                b = "-";
            }
            return b + leftZeroFill(~~(a / 60), 2) + ":" + leftZeroFill(~~a % 60, 2);
        },
        ZZ: function() {
            var a = -this.zone(), b = "+";
            if (0 > a) {
                a = -a;
                b = "-";
            }
            return b + leftZeroFill(~~(10 * a / 6), 4);
        },
        z: function() {
            return this.zoneAbbr();
        },
        zz: function() {
            return this.zoneName();
        },
        X: function() {
            return this.unix();
        }
    };
    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + "o"] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);
    Language.prototype = {
        set: function(config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                "function" == typeof prop ? this[i] = prop : this["_" + i] = prop;
            }
        },
        _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months: function(m) {
            return this._months[m.month()];
        },
        _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort: function(m) {
            return this._monthsShort[m.month()];
        },
        monthsParse: function(monthName) {
            var i, mom, regex;
            this._monthsParse || (this._monthsParse = []);
            for (i = 0; 12 > i; i++) {
                if (!this._monthsParse[i]) {
                    mom = moment([ 2e3, i ]);
                    regex = "^" + this.months(mom, "") + "|^" + this.monthsShort(mom, "");
                    this._monthsParse[i] = new RegExp(regex.replace(".", ""), "i");
                }
                if (this._monthsParse[i].test(monthName)) return i;
            }
        },
        _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays: function(m) {
            return this._weekdays[m.day()];
        },
        _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort: function(m) {
            return this._weekdaysShort[m.day()];
        },
        _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin: function(m) {
            return this._weekdaysMin[m.day()];
        },
        weekdaysParse: function(weekdayName) {
            var i, mom, regex;
            this._weekdaysParse || (this._weekdaysParse = []);
            for (i = 0; 7 > i; i++) {
                if (!this._weekdaysParse[i]) {
                    mom = moment([ 2e3, 1 ]).day(i);
                    regex = "^" + this.weekdays(mom, "") + "|^" + this.weekdaysShort(mom, "") + "|^" + this.weekdaysMin(mom, "");
                    this._weekdaysParse[i] = new RegExp(regex.replace(".", ""), "i");
                }
                if (this._weekdaysParse[i].test(weekdayName)) return i;
            }
        },
        _longDateFormat: {
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D YYYY",
            LLL: "MMMM D YYYY LT",
            LLLL: "dddd, MMMM D YYYY LT"
        },
        longDateFormat: function(key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },
        isPM: function(input) {
            return "p" === (input + "").toLowerCase()[0];
        },
        _meridiemParse: /[ap]\.?m?\.?/i,
        meridiem: function(hours, minutes, isLower) {
            return hours > 11 ? isLower ? "pm" : "PM" : isLower ? "am" : "AM";
        },
        _calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[Last] dddd [at] LT",
            sameElse: "L"
        },
        calendar: function(key, mom) {
            var output = this._calendar[key];
            return "function" == typeof output ? output.apply(mom) : output;
        },
        _relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        relativeTime: function(number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return "function" == typeof output ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
        },
        pastFuture: function(diff, output) {
            var format = this._relativeTime[diff > 0 ? "future" : "past"];
            return "function" == typeof format ? format(output) : format.replace(/%s/i, output);
        },
        ordinal: function(number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal: "%d",
        preparse: function(string) {
            return string;
        },
        postformat: function(string) {
            return string;
        },
        week: function(mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },
        _week: {
            dow: 0,
            doy: 6
        }
    };
    moment = function(input, format, lang) {
        return makeMoment({
            _i: input,
            _f: format,
            _l: lang,
            _isUTC: false
        });
    };
    moment.utc = function(input, format, lang) {
        return makeMoment({
            _useUTC: true,
            _isUTC: true,
            _l: lang,
            _i: input,
            _f: format
        });
    };
    moment.unix = function(input) {
        return moment(1e3 * input);
    };
    moment.duration = function(input, key) {
        var sign, ret, isDuration = moment.isDuration(input), isNumber = "number" == typeof input, duration = isDuration ? input._input : isNumber ? {} : input, matched = aspNetTimeSpanJsonRegex.exec(input);
        if (isNumber) key ? duration[key] = input : duration.milliseconds = input; else if (matched) {
            sign = "-" === matched[1] ? -1 : 1;
            duration = {
                y: 0,
                d: ~~matched[2] * sign,
                h: ~~matched[3] * sign,
                m: ~~matched[4] * sign,
                s: ~~matched[5] * sign,
                ms: ~~matched[6] * sign
            };
        }
        ret = new Duration(duration);
        isDuration && input.hasOwnProperty("_lang") && (ret._lang = input._lang);
        return ret;
    };
    moment.version = VERSION;
    moment.defaultFormat = isoFormat;
    moment.updateOffset = function() {};
    moment.lang = function(key, values) {
        if (!key) return moment.fn._lang._abbr;
        values ? loadLang(key, values) : languages[key] || getLangDefinition(key);
        moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
    };
    moment.langData = function(key) {
        key && key._lang && key._lang._abbr && (key = key._lang._abbr);
        return getLangDefinition(key);
    };
    moment.isMoment = function(obj) {
        return obj instanceof Moment;
    };
    moment.isDuration = function(obj) {
        return obj instanceof Duration;
    };
    moment.fn = Moment.prototype = {
        clone: function() {
            return moment(this);
        },
        valueOf: function() {
            return +this._d + 6e4 * (this._offset || 0);
        },
        unix: function() {
            return Math.floor(+this / 1e3);
        },
        toString: function() {
            return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },
        toDate: function() {
            return this._offset ? new Date(+this) : this._d;
        },
        toISOString: function() {
            return formatMoment(moment(this).utc(), "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
        },
        toArray: function() {
            var m = this;
            return [ m.year(), m.month(), m.date(), m.hours(), m.minutes(), m.seconds(), m.milliseconds() ];
        },
        isValid: function() {
            null == this._isValid && (this._isValid = this._a ? !compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) : !isNaN(this._d.getTime()));
            return !!this._isValid;
        },
        utc: function() {
            return this.zone(0);
        },
        local: function() {
            this.zone(0);
            this._isUTC = false;
            return this;
        },
        format: function(inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },
        add: function(input, val) {
            var dur;
            dur = "string" == typeof input ? moment.duration(+val, input) : moment.duration(input, val);
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },
        subtract: function(input, val) {
            var dur;
            dur = "string" == typeof input ? moment.duration(+val, input) : moment.duration(input, val);
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },
        diff: function(input, units, asFloat) {
            var diff, output, that = this._isUTC ? moment(input).zone(this._offset || 0) : moment(input).local(), zoneDiff = 6e4 * (this.zone() - that.zone());
            units = normalizeUnits(units);
            if ("year" === units || "month" === units) {
                diff = 432e5 * (this.daysInMonth() + that.daysInMonth());
                output = 12 * (this.year() - that.year()) + (this.month() - that.month());
                output += (this - moment(this).startOf("month") - (that - moment(that).startOf("month"))) / diff;
                output -= 6e4 * (this.zone() - moment(this).startOf("month").zone() - (that.zone() - moment(that).startOf("month").zone())) / diff;
                "year" === units && (output /= 12);
            } else {
                diff = this - that;
                output = "second" === units ? diff / 1e3 : "minute" === units ? diff / 6e4 : "hour" === units ? diff / 36e5 : "day" === units ? (diff - zoneDiff) / 864e5 : "week" === units ? (diff - zoneDiff) / 6048e5 : diff;
            }
            return asFloat ? output : absRound(output);
        },
        from: function(time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },
        fromNow: function(withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },
        calendar: function() {
            var diff = this.diff(moment().startOf("day"), "days", true), format = -6 > diff ? "sameElse" : -1 > diff ? "lastWeek" : 0 > diff ? "lastDay" : 1 > diff ? "sameDay" : 2 > diff ? "nextDay" : 7 > diff ? "nextWeek" : "sameElse";
            return this.format(this.lang().calendar(format, this));
        },
        isLeapYear: function() {
            var year = this.year();
            return 0 === year % 4 && 0 !== year % 100 || 0 === year % 400;
        },
        isDST: function() {
            return this.zone() < this.clone().month(0).zone() || this.zone() < this.clone().month(5).zone();
        },
        day: function(input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (null != input) {
                if ("string" == typeof input) {
                    input = this.lang().weekdaysParse(input);
                    if ("number" != typeof input) return this;
                }
                return this.add({
                    d: input - day
                });
            }
            return day;
        },
        month: function(input) {
            var dayOfMonth, utc = this._isUTC ? "UTC" : "";
            if (null != input) {
                if ("string" == typeof input) {
                    input = this.lang().monthsParse(input);
                    if ("number" != typeof input) return this;
                }
                dayOfMonth = this.date();
                this.date(1);
                this._d["set" + utc + "Month"](input);
                this.date(Math.min(dayOfMonth, this.daysInMonth()));
                moment.updateOffset(this);
                return this;
            }
            return this._d["get" + utc + "Month"]();
        },
        startOf: function(units) {
            units = normalizeUnits(units);
            switch (units) {
              case "year":
                this.month(0);

              case "month":
                this.date(1);

              case "week":
              case "day":
                this.hours(0);

              case "hour":
                this.minutes(0);

              case "minute":
                this.seconds(0);

              case "second":
                this.milliseconds(0);
            }
            "week" === units && this.weekday(0);
            return this;
        },
        endOf: function(units) {
            return this.startOf(units).add(units, 1).subtract("ms", 1);
        },
        isAfter: function(input, units) {
            units = "undefined" != typeof units ? units : "millisecond";
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },
        isBefore: function(input, units) {
            units = "undefined" != typeof units ? units : "millisecond";
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },
        isSame: function(input, units) {
            units = "undefined" != typeof units ? units : "millisecond";
            return +this.clone().startOf(units) === +moment(input).startOf(units);
        },
        min: function(other) {
            other = moment.apply(null, arguments);
            return this > other ? this : other;
        },
        max: function(other) {
            other = moment.apply(null, arguments);
            return other > this ? this : other;
        },
        zone: function(input) {
            var offset = this._offset || 0;
            if (null == input) return this._isUTC ? offset : this._d.getTimezoneOffset();
            "string" == typeof input && (input = timezoneMinutesFromString(input));
            16 > Math.abs(input) && (input = 60 * input);
            this._offset = input;
            this._isUTC = true;
            offset !== input && addOrSubtractDurationFromMoment(this, moment.duration(offset - input, "m"), 1, true);
            return this;
        },
        zoneAbbr: function() {
            return this._isUTC ? "UTC" : "";
        },
        zoneName: function() {
            return this._isUTC ? "Coordinated Universal Time" : "";
        },
        daysInMonth: function() {
            return moment.utc([ this.year(), this.month() + 1, 0 ]).date();
        },
        dayOfYear: function(input) {
            var dayOfYear = round((moment(this).startOf("day") - moment(this).startOf("year")) / 864e5) + 1;
            return null == input ? dayOfYear : this.add("d", input - dayOfYear);
        },
        weekYear: function(input) {
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return null == input ? year : this.add("y", input - year);
        },
        isoWeekYear: function(input) {
            var year = weekOfYear(this, 1, 4).year;
            return null == input ? year : this.add("y", input - year);
        },
        week: function(input) {
            var week = this.lang().week(this);
            return null == input ? week : this.add("d", 7 * (input - week));
        },
        isoWeek: function(input) {
            var week = weekOfYear(this, 1, 4).week;
            return null == input ? week : this.add("d", 7 * (input - week));
        },
        weekday: function(input) {
            var weekday = (this._d.getDay() + 7 - this.lang()._week.dow) % 7;
            return null == input ? weekday : this.add("d", input - weekday);
        },
        isoWeekday: function(input) {
            return null == input ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },
        lang: function(key) {
            if (key === undefined) return this._lang;
            this._lang = getLangDefinition(key);
            return this;
        }
    };
    for (i = 0; proxyGettersAndSetters.length > i; i++) makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ""), proxyGettersAndSetters[i]);
    makeGetterAndSetter("year", "FullYear");
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    moment.fn.toJSON = moment.fn.toISOString;
    moment.duration.fn = Duration.prototype = {
        _bubble: function() {
            var seconds, minutes, hours, years, milliseconds = this._milliseconds, days = this._days, months = this._months, data = this._data;
            data.milliseconds = milliseconds % 1e3;
            seconds = absRound(milliseconds / 1e3);
            data.seconds = seconds % 60;
            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;
            hours = absRound(minutes / 60);
            data.hours = hours % 24;
            days += absRound(hours / 24);
            data.days = days % 30;
            months += absRound(days / 30);
            data.months = months % 12;
            years = absRound(months / 12);
            data.years = years;
        },
        weeks: function() {
            return absRound(this.days() / 7);
        },
        valueOf: function() {
            return this._milliseconds + 864e5 * this._days + 2592e6 * (this._months % 12) + 31536e6 * ~~(this._months / 12);
        },
        humanize: function(withSuffix) {
            var difference = +this, output = relativeTime(difference, !withSuffix, this.lang());
            withSuffix && (output = this.lang().pastFuture(difference, output));
            return this.lang().postformat(output);
        },
        add: function(input, val) {
            var dur = moment.duration(input, val);
            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;
            this._bubble();
            return this;
        },
        subtract: function(input, val) {
            var dur = moment.duration(input, val);
            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;
            this._bubble();
            return this;
        },
        get: function(units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + "s"]();
        },
        as: function(units) {
            units = normalizeUnits(units);
            return this["as" + units.charAt(0).toUpperCase() + units.slice(1) + "s"]();
        },
        lang: moment.fn.lang
    };
    for (i in unitMillisecondFactors) if (unitMillisecondFactors.hasOwnProperty(i)) {
        makeDurationAsGetter(i, unitMillisecondFactors[i]);
        makeDurationGetter(i.toLowerCase());
    }
    makeDurationAsGetter("Weeks", 6048e5);
    moment.duration.fn.asMonths = function() {
        return (+this - 31536e6 * this.years()) / 2592e6 + 12 * this.years();
    };
    moment.lang("en", {
        ordinal: function(number) {
            var b = number % 10, output = 1 === ~~(number % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return number + output;
        }
    });
    if (hasModule) {
        moment.lang(Ti.Locale.getCurrentLanguage());
        module.exports = moment;
    }
    "undefined" == typeof ender && (this["moment"] = moment);
    "function" == typeof define && define.amd && define("moment", [], function() {
        return moment;
    });
}).call(this);