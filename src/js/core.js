(function ($, window) {
    $.fias = {};

    (function () {
        var protocol = 'https:';
        $.fias.url = protocol + '//kladr-api.ru/api.php';
        $.fias.timeout = 3000;
    })();

    var ajaxQueue = [];
    var clearAjaxQueue = function () {
        while (ajaxQueue.length > 5) {
            var a = ajaxQueue.shift();
            a.abort();
        }
    };

    var debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        };
    };

    /**
     * Перечисление типов объектов
     *
     * @type {{region: string, district: string, city: string, street: string, building: string}}
     */
    $.fias.type = {
        region: 'region',   // Область
        district: 'district', // Район
        city: 'city',     // Город
        street: 'street',   // Улица
        building: 'building'  // Строение
    };

    /**
     * Перечисление типов населённых пунктов
     *
     * @type {{city: number, settlement: number, village: number}}
     */
    $.fias.typeCode = {
        city: 1, // Город
        settlement: 2, // Посёлок
        village: 4  // Деревня
    };

    /**
     * Проверяет корректность запроса
     *
     * @param {{}} query Запрос
     * @returns {boolean}
     */
    $.fias.validate = function (query) {
        var type = $.fias.type;

        switch (query.type) {
            case type.region:
            case type.district:
            case type.city:
                if (query.parentType && !query.parentId) {
                    error('parentId undefined');
                    return false;
                }
                break;
            case type.street:

                if (query.parentType != type.city && query.parentType != type.street) {
                    error('parentType must equal "city" or "street"');
                    return false;
                }
                if (!query.parentId) {
                    error('parentId undefined');
                    return false;
                }
                break;
            case type.building:
                if (!query.zip) {
                    if (!~$.inArray(query.parentType, [type.street, type.city])) {
                        error('parentType must equal "street" or "city"');
                        return false;
                    }
                    if (!query.parentId) {
                        error('parentId undefined');
                        return false;
                    }
                }
                break;
            default:
                if (!query.oneString) {
                    error('type incorrect');
                    return false;
                }
                break;
        }

        if (query.oneString && query.parentType && !query.parentId) {
            error('parentId undefined');
            return false;
        }

        if (query.typeCode && (query.type != type.city)) {
            error('type must equal "city"');
            return false;
        }

        if (query.limit < 1) {
            error('limit must greater than 0');
            return false;
        }

        return true;
    };

    /**
     * Отправляет запрос к сервису
     *
     * @param {{}} query Запрос
     * @param {Function} callback Функция, которой будет передан массив полученных объектов
     */
    $.fias.api = function (query, callback) {
        if (!callback) {
            error('Callback undefined');
            return;
        }

        if (!$.fias.validate(query)) {
            callback([]);
            return;
        }


        var timeout = setTimeout(function () {
            callback([]);
            timeout = null;
        }, $.fias.timeout);

        if(!query.token && $.fias.token) {
            query.token = $.fias.token;
        }

        clearAjaxQueue();
        var a = $.ajax({
            url: $.fias.url + '?callback=?',
            type: 'get',
            data: toApiFormat(query),
            dataType: 'jsonp'
        });

        ajaxQueue.push(a);
        a.done(function (data) {
            if (timeout) {
                callback(data.result || []);
                clearTimeout(timeout);
            }
        });
    };

    //$.fias.api = debounce($.fias.api, 250);

    /**
     * Проверяет существование объекта, соответствующего запросу
     *
     * @param {{}} query Запрос
     * @param {Function} callback Функция, которой будет передан объект, если он существует, или
     * false если не существует.
     */
    $.fias.check = function (query, callback) {
        if (!callback) {
            error('Callback undefined');
            return;
        }

        query.withParents = false;
        query.limit = 1;

        $.fias.api(query, function (objs) {
            objs && objs.length
                ? callback(objs[0])
                : callback(false);
        });
    };

    /**
     * Преобразует запрос из формата принятого в плагине в формат сервиса
     *
     * @param {{}} query Запрос в формате плагина
     * @returns {{}} Запрос в формате сервиса
     */
    function toApiFormat(query) {
        var params = {},
            fields = {
                type: 'contentType',
                name: 'query',
                withParents: 'withParent'
            };

        if (query.parentType && query.parentId) {
            params[query.parentType + 'Id'] = query.parentId;
        }

        for (var key in query) {
            if (hasOwn(query, key) && query[key]) {
                params[hasOwn(fields, key) ? fields[key] : key] = query[key];
            }
        }

        return params;
    }

    /**
     * Проверяет принадлежит ли объекту свойство
     *
     * @param {{}} obj Объект
     * @param {string} property Свойство
     * @returns {boolean}
     */
    function hasOwn(obj, property) {
        return obj.hasOwnProperty(property);
    }

    /**
     * Выводит ошибку на консоль
     *
     * @param {string} error Текст ошибки
     */
    function error(error) {
        var console = window.console;

        console && console.error && console.error(error);
    }
})(jQuery, window);