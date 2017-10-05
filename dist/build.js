/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = __webpack_require__(4);
var dataManager = /** @class */ (function () {
    function dataManager() {
        var _this = this;
        this.init = function () {
            return _this.dataObject();
        };
        this.dataObject = function () {
            var killed = false, customObject = function () {
                var db = Object.create({}), sets = [];
                db.__proto__.onSet = _this.sets();
                Object.defineProperty(db.__proto__, "set", {
                    get: function () {
                        return sets;
                    },
                    set: function (e) {
                        if (typeof e === "string") {
                            sets.push(e);
                            configProp(db, e, "");
                        }
                        else if (typeof e === "object") {
                            for (var i in e) {
                                sets.push(i);
                                configProp(db, i, e[i]);
                            }
                        }
                    }
                });
                return db;
            }, configProp = function (obj, prop, value) {
                var i, db = customObject();
                if (!obj.__proto__[prop]) {
                    Object.defineProperty(obj.__proto__, prop, {
                        get: function () {
                            return db;
                        },
                        set: function (e) {
                            if (!killed) {
                                killed = true;
                                for (i in db.set) {
                                    killData(db, db.set[i]);
                                }
                                killed = false;
                            }
                            db.onSet.forEach(function (cb, key) {
                                cb({
                                    oldValue: db.__proto__.value,
                                    value: e
                                }, key);
                            });
                            db.__proto__.value = e;
                            if (typeof e === "object") {
                                for (i in e) {
                                    if (!db[i]) {
                                        db.set = i;
                                    }
                                    db[i] = e[i];
                                }
                            }
                        }
                    });
                }
                obj[prop] = value;
            }, killData = function (obj, data) {
                var i;
                obj[data] = "";
                for (i in obj[data].set) {
                    killData(obj[data], obj[data].set[i]);
                }
            };
            return customObject();
        };
        this.guid = new helper_1.helper().guid;
    }
    dataManager.prototype.sets = function () {
        var _this = this;
        var set = Object.create({});
        set.__proto__.push = function (f) {
            var guid = _this.guid();
            set[guid] = f;
            return guid;
        };
        set.__proto__.forEach = function (cb) {
            var keys = Object.keys(set);
            keys.forEach(function (key) {
                cb(set[key], key);
            });
        };
        return set;
    };
    return dataManager;
}());
exports.dataManager = dataManager;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var styleManager_1 = __webpack_require__(2);
var elementManager_1 = __webpack_require__(3);
var dataManager_1 = __webpack_require__(0);
var fwName = "jhcr", em = new elementManager_1.elementManager();
// define caller functions
window[fwName] = {
    css: new styleManager_1.styleManager().init,
    html: em.init,
    data: new dataManager_1.dataManager().init
};
em.watchElements();
// define proto functions
// for(let i in x.protos) {
//     window[fwName].css.__proto__[i] = x.protos[i]
// }
// for(let i in y.protos) {
//     debugger
//     window[fwName].html.__proto__[i] = y.protos[i]
// }
// new styleManager()
// styleManager.length
// for(let i in styleManager.protoFunction)
// window[fwName].css.__proto__ 


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var styleManager = /** @class */ (function () {
    function styleManager() {
        var _this = this;
        this.init = function (config) {
            return _this.callAddToStyles(false, config);
        };
        this.callAddToStyles = function (parentSelector, config) {
            var that = _this;
            var _loop_1 = function (i) {
                i.split(',').forEach(function (selector) {
                    var newSelector = parentSelector ? (parentSelector + " " + selector).replace(" &", "") : selector;
                    that.addToStyles(newSelector, config[i]);
                });
            };
            for (var i in config) {
                _loop_1(i);
            }
            return config;
        };
        this.addRule = function (rule) {
            _this.STYLE_LIST[rule] = _this.rules[_this.sheet.insertRule(rule + '{}', _this.rules.length)];
        };
        this.getStyle = function (style) {
            if (!_this.STYLE_LIST[style])
                _this.addRule(style);
            return _this.STYLE_LIST[style].style;
        };
        this.getCurrentStyle = function (style) {
            var a, b, searchingStyles = true, searchingIndex = 0, currentStyleSheet, styleSheets = _this.getStyleSheets(), currentStyle = _this.getStyle(style);
            for (a in styleSheets) {
                currentStyleSheet = styleSheets[a]["cssRules"] ? styleSheets[a]["cssRules"] : styleSheets[a]["rules"];
                for (b in currentStyleSheet) {
                    if (currentStyleSheet[b].selectorText === style) {
                        while (searchingStyles) {
                            if (currentStyleSheet[b].style[searchingIndex]) {
                                currentStyle[currentStyleSheet[b].style[searchingIndex]] = currentStyleSheet[b].style[currentStyleSheet[b].style[searchingIndex]];
                                searchingIndex++;
                            }
                            else {
                                searchingStyles = false;
                                searchingIndex = 0;
                            }
                        }
                        searchingStyles = true;
                    }
                    currentStyleSheet[b];
                }
            }
            return currentStyle;
        };
        this.protos = {
            getCurrentStyle: this.getCurrentStyle,
            getStyle: this.getStyle
        };
        this.STYLE_ELEMENT = document.createElement('style');
        this.STYLE_ELEMENT.type = "text/css";
        document.head.appendChild(this.STYLE_ELEMENT);
        this.sheet = document.styleSheets[document.styleSheets.length - 1];
        this.rules = this.sheet.cssRules ? this.sheet.cssRules : this.sheet.rules;
        this.STYLE_LIST = {};
        for (var i in this.protos) {
            this.init[i] = this.protos[i];
        }
    }
    styleManager.prototype.addToStyles = function (selector, style) {
        if (!this.STYLE_LIST[selector]) {
            this.addRule(selector);
        }
        for (var s in style) {
            if (s === "children") {
                this.callAddToStyles(selector, style[s]);
            }
            else {
                this.STYLE_LIST[selector].style[s] = style[s];
            }
        }
        style.style = this.STYLE_LIST[selector].style;
    };
    styleManager.prototype.getStyleSheets = function () {
        return document.styleSheets;
    };
    return styleManager;
}());
exports.styleManager = styleManager;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dataManager_1 = __webpack_require__(0);
var elementManager = /** @class */ (function () {
    function elementManager() {
        var _this = this;
        this.types = {};
        this.registry = {};
        this.init = function (config, data) {
            var element;
            if (typeof config === "string") {
                config = { tag: config };
            }
            if (config.types) {
                config.types.forEach(function (t) {
                    for (var i in this.types[t]) {
                        config[i] = this.types[t][i];
                    }
                });
            }
            if (config.type) {
                for (var i in config.types[config.type]) {
                    if (!config[i])
                        config[i] = config.types[config.type][i];
                }
            }
            config.tag = !config.tag ? 'div' : config.tag;
            if (config.tag === "textNode") {
                element = document.createTextNode('');
            }
            else {
                element = config.element ? config.element : document.createElement(config.tag);
            }
            !config.value ? false : element.value = config.value;
            !config.html ? false : element.innerHTML = config.html;
            !config.class ? false : element.className = config.class;
            for (var i in config) {
                if (_this.render[i])
                    _this.render[i](config[i], element, data);
            }
            return element;
        };
        this.watchElements = function () {
            var dm = new dataManager_1.dataManager();
            var that = _this, JHCRdocObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    for (var i in mutation.addedNodes) {
                        if (that.registry[mutation.addedNodes[i].localName]) {
                            if (that.registry[mutation.addedNodes[i].localName].data) {
                                var db = dm.init();
                                db.set = "data";
                                db.data = that.registry[mutation.addedNodes[i].localName].data;
                                Object.defineProperty(mutation.addedNodes[i], "data", {
                                    get: function () {
                                        return db.data;
                                    },
                                    set: function (e) {
                                        db.data = e;
                                    }
                                });
                            }
                            mutation.addedNodes[i].fa = mutation.addedNodes[i].findAll = mutation.addedNodes[i].querySelectorAll;
                            mutation.addedNodes[i].f = mutation.addedNodes[i].find = mutation.addedNodes[i].querySelector;
                            var tplElement = that.init(that.registry[mutation.addedNodes[i].localName].tpl, mutation.addedNodes[i].data);
                            var x = that.getComponentData(mutation.addedNodes[i], that.registry[mutation.addedNodes[i].localName].interface);
                            console.log(x);
                            mutation.addedNodes[i].appendChild(tplElement);
                            if (that.registry[mutation.addedNodes[i].localName].onSet) {
                                that.registry[mutation.addedNodes[i].localName].onSet(mutation.addedNodes[i]);
                            }
                        }
                    }
                    for (var i_1 in mutation.removedNodes) {
                        if (that.registry[mutation.removedNodes[i_1].localName] && that.registry[mutation.removedNodes[i_1].localName].onRemove) {
                            that.registry[mutation.removedNodes[i_1].localName].onRemove(mutation.removedNodes[i_1]);
                        }
                    }
                });
            });
            JHCRdocObserver.observe(document, { childList: true, subtree: true });
        };
        this.getValueOf = function (path, obj) {
            return path.split('.').reduce(function (prev, curr) {
                return prev ? prev[curr] : undefined;
            }, obj || self);
        };
        this.render = {
            attributes: function (config, elem) {
                for (var i in config) {
                    elem.setAttribute(i, config[i]);
                }
            },
            properties: function (config, elem) {
                var that = _this;
                for (var i in config) {
                    elem[i] = config[i];
                }
            },
            children: function (config, elem, dataModel) {
                var that = _this;
                config.forEach(function (i) {
                    elem.appendChild(that.init(i, dataModel));
                });
            },
            callbacks: function (config, elem) {
                var that = _this;
                config.forEach(function (i) {
                    elem.addEventListener(i.event, i.callback);
                });
            },
            binds: function (config, elem, d) {
                var that = _this;
                function setVals(config) {
                    config.forEach(function (i) {
                        var data = that.getValueOf(i.data, d);
                        if (i.property) {
                            elem[i.property] = data.value;
                            data.onSet.push(function (d) { return elem[i.property = d.value]; });
                        }
                        if (i.attribute) {
                            elem.setAttribute(i.attribute, data.value);
                            data.onSet.push(function (d) { return elem.setAttribute(i.attribute, d.value); });
                        }
                        if (i.callback) {
                            i.callback(i.data.value);
                            data.onSet.push(i.callback);
                        }
                    });
                }
                setVals(config);
                // config.data.onSet.push(function(e){
                //     setVals(config)
                // })
            }
        };
        this.protos = {
            register: function (config) {
                for (var i in config) {
                    _this.registry[i] = config[i];
                }
            },
            addType: function (config) {
                for (var t in config) {
                    _this.types[t] = config[t];
                }
            }
        };
        for (var i in this.protos) {
            this.init[i] = this.protos[i];
        }
    }
    elementManager.prototype.getComponentData = function (e, i) {
        var d = {};
        if (e.children.length) {
            if (e.children[0].tagName === "SET-DATA") {
                this.buildComponentData(e.children[0], d, i);
            }
        }
    };
    elementManager.prototype.buildComponentData = function (m, d, i) {
        m;
        d;
        i;
        debugger;
    };
    return elementManager;
}());
exports.elementManager = elementManager;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helper = /** @class */ (function () {
    function helper() {
    }
    helper.prototype.guid = function () {
        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
    return helper;
}());
exports.helper = helper;


/***/ })
/******/ ]);jhcr.html.register({
    "test-component": {
        "data": {
            "person": {
                "name": "milad",
                "alter": "30",
                "skills": {
                    "skill": "php",
                    "level": "3"
                }
            }
        },
        "tpl": {
            "children": [
                {
                    "attributes": {
                        "title": "hmm",
                        "propDop": "asdasd"
                    },
                    "children": [
                        {
                            "attributes": {},
                            "children": [
                                {
                                    "tag": "textNode",
                                    "binds": [
                                        {
                                            "property": "nodeValue",
                                            "data": "person.name"
                                        }
                                    ]
                                },
                                {
                                    "tag": "textNode",
                                    "properties": {
                                        "nodeValue": " ist "
                                    }
                                },
                                {
                                    "tag": "textNode",
                                    "binds": [
                                        {
                                            "property": "nodeValue",
                                            "data": "person.alter"
                                        }
                                    ]
                                },
                                {
                                    "tag": "textNode",
                                    "properties": {
                                        "nodeValue": " jahre alt"
                                    }
                                }
                            ],
                            "tag": "p"
                        }
                    ],
                    "tag": "div"
                }
            ]
        },
        "interface": {
            "person": {
                "type": "array",
                "item": {
                    "name": {
                        "type": "string",
                        "item": "milad"
                    },
                    "alter": {
                        "type": "string",
                        "item": "30"
                    },
                    "skills": {
                        "type": "array",
                        "item": {
                            "skill": {
                                "type": "string",
                                "item": "php"
                            },
                            "level": {
                                "type": "string",
                                "item": "3"
                            }
                        }
                    }
                }
            }
        }
    }
})