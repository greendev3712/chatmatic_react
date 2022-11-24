import {
    welcomemsgIcon,
    autoresponseIcon,
    buttonsIcon,
    checkboxIcon,
    jsonIcon,
    keywordmsgIcon,
    post_triggerIcon,
    m_dot_meIcon,
    chat_widget
} from 'assets/images/sidebar';

export const screenOrientation = Object.freeze({
    auto: 'auto',
    portrait: 'portrait',
    landscape: 'landscape'
});

export const messageRenderType = Object.freeze({
    none: 'none',
    info: 'info',
    error: 'error',
    success: 'success',
    warning: 'warning'
});

export const durationTypes = Object.freeze({
    hour: { label: 'Hours', value: 'hours' },
    minute: { label: 'Minutes', value: 'minutes' },
    second: { label: 'Seconds', value: 'seconds' },
    day: { label: 'Days', value: 'days' },
    week: { label: 'Weeks', value: 'weeks' },
    month: { label: 'Months', value: 'months' },
    year: { label: 'Years', value: 'years' }
});

export const dayNames = Object.freeze({
    monday: { label: 'Monday', value: 'mon', abbr: 'Mon' },
    tuesday: { label: 'Tuesday', value: 'tue', abbr: 'Tue' },
    wednesday: { label: 'Wednesday', value: 'wed', abbr: 'Wed' },
    thursday: { label: 'Thursday', value: 'thu', abbr: 'Thu' },
    friday: { label: 'Friday', value: 'fri', abbr: 'Fri' },
    saturday: { label: 'Saturday', value: 'sat', abbr: 'Sat' },
    sunday: { label: 'Sunday', value: 'sun', abbr: 'Sun' }
});

export const hours24 = Object.freeze([
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23'
]);

export const triggerTypes = {
    welcomemsg: {
        type: 'welcomemsg',
        text: 'Welcome Message',
        icon: welcomemsgIcon
    },
    autoresponse: {
        type: 'autoresponse',
        text: 'Auto Response',
        icon: autoresponseIcon
    },
    json: { type: 'json', text: 'JSON', icon: jsonIcon },
    keywordmsg: {
        type: 'keywordmsg',
        text: 'Keyword Message',
        icon: keywordmsgIcon
    },
    m_dot_me: { type: 'm_dot_me', text: 'M Dot Me', icon: m_dot_meIcon },
    buttons: { type: 'buttons', text: 'Button', icon: buttonsIcon },
    post_trigger: {
        type: 'post_trigger',
        text: 'Private Reply',
        icon: post_triggerIcon
    },
    checkbox: { type: 'checkbox', text: 'Checkbox', icon: checkboxIcon },
    chat_widget: { type: 'chat_widget', text: 'Chat Widget', icon: chat_widget }
    // broadcast: { type: 'broadcast', text: 'Broadcast' }
};
