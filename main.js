import '@scss/style.scss';
import {ClockSVG} from '@js/clock-creator.js';

const clockParts = ['milliseconds', 'seconds', 'minutes', 'hours'];

$('.time-passing').html(ClockSVG("time-passing", clockParts));