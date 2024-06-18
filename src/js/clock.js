import {ClockSVG} from '@js/clock-creator.js';

const clock = (options = {}, ...args) => {
    let results = [];
    const methods = {
        start: function (results, data) {
            data.isCounting = true;
            $('[data-clock-id="'+data.idSuffix+'"]').data('clock', data);
        },
        stop: function (results, data) {
            data.isCounting = false;
            $('[data-clock-id="'+data.idSuffix+'"]').data('clock', data);
        },
        set: function (results, data, args) {
            let time = args[0];
            if (isDefined(time)) time = time.trim();
            else time = "";
            if (time.split(":").length === data.partsLength.length) {
                data.current = time;
                $('[data-clock-id="'+data.idSuffix+'"]').data('clock', data);
            }
            return results;
        },
        clear: function (results, data) {
            data.current = getInitialTime(data.partsLength);
            $('[data-clock-id="'+data.idSuffix+'"]').data('clock', data);
            return results;
        },
        option: function (results, data, args) {
            if (typeof data.settings === 'undefined') {
                data.settings = {};
            }
            if (!isDefined(args) || args.length < 1 || args.length > 2) {
                console.error('Arguments number not valid');
            }
            else if (args.length === 1) {
                results.push(data.settings[args[0]]);
            }
            else if (args.length === 2) {
                data.settings[args[0]] = args[1];
                $('[data-clock-id="'+data.idSuffix+'"]').data('clock', data);
            }
            return results;
        },
    };


    $(this).each(function() {
        let data = $(this).data('clock');
        let idSuffix = Math.floor((Math.random() * 1000) + 100);
        if (!data) {
            let settings = $.extend(
                {
                    partsKeys: ['seconds', 'minutes', 'hours']
                },
                options
            );
            let $parent = $(this);

            let parts = {};
            for (let i = 0; i < settings.partsKeys.length; i++) {
                let part = settings.partsKeys[i];
                if (typeof part === 'string') {
                    parts[part] = 60;
                }
                else{
                    let key = Object.keys(part)[0];
                    parts[key] = part[key];
                }
            }

            data = {
                idSuffix: idSuffix,
                settings: settings,
                parts,
                partsLength: settings.partsKeys.length,
                isCounting: false,
                timer: null,
                current: getInitialTime(data.partsLength)
            };

            data.timer = setTimeout(() => {
                update($(this));
            }, 1000);

            //save the settings of the element
            $(this).data('clock', data);
            $(this).attr('data-clock-id', idSuffix);

            let $clockDom = $(ClockSVG("clock_"+idSuffix, data.partsLength));
            $clockDom.appendTo($parent);
        }
        else{
            if (typeof options === 'string' && typeof methods[options] !== 'undefined') {
                results = methods[options](results, data, [...args]);
            }
        }
    });
    return results.length > 1 ? results : (results.length === 0 ? null : results[0]);
}

const getInitialTime = (parts) => {
    return (new Array(parts.length)).fill("0").join(":");
}

const isDefined = (variable, notEmpty = true) => {
    return typeof variable !== 'undefined' && variable !== null && (typeof variable !== 'string' || !notEmpty || variable !== "");
}

const display = (a, n) => {
    const number = [
        [1, 1, 1, 0, 1, 1, 1], // 0
        [0, 0, 1, 0, 0, 1, 0], // 1
        [1, 0, 1, 1, 1, 0, 1], // 2
        [1, 0, 1, 1, 0, 1, 1], // 3
        [0, 1, 1, 1, 0, 1, 0], // 4
        [1, 1, 0, 1, 0, 1, 1], // 5
        [1, 1, 0, 1, 1, 1, 1], // 6
        [1, 0, 1, 0, 0, 1, 0], // 7
        [1, 1, 1, 1, 1, 1, 1], // 8
        [1, 1, 1, 1, 0, 1, 1]  // 9
    ]

    n = number[n]
    let i = 0
    while (i < n.length) {
        const crystal = document.getElementById(a + (i + 1))
        if (n[i] === 0) {
            crystal.style.opacity = '0.125'
        }
        else {
            crystal.style.opacity = '1'
        }
        i++
    }
}

const format = (value) => {
    value = value + ''

    if (value.length === 1) {
        return '0' + value
    }

    return value
}

const update = ($clockElement) => {
    let data = $clockElement.data('clock');
    const date = new Date()
    const hours = format(date.getHours())
    const minutes = format(date.getMinutes())
    const seconds = format(date.getSeconds())

    setTimeout(function() {
        display('a', hours[0])
        display('b', hours[1])
        display('c', minutes[0])
        display('d', minutes[1])
        display('e', seconds[0])
        display('f', seconds[1])
        update()
    }, 1000)
}