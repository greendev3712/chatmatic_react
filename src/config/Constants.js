// Message Type Icons
import mini_autoresponse_icon from 'assets/images/mini_autoresponse_icon.svg';
import mini_broadcast_icon from 'assets/images/mini_broadcast_icon.svg';
import mini_general_icon from 'assets/images/mini_general_icon.svg';
import mini_keyword_msg_icon from 'assets/images/mini_keyword_msg_icon.svg';
import mini_welcome_msg_icon from 'assets/images/mini_welcome_msg_icon.svg';
import mini_unknown_icon from 'assets/images/mini_unknown_icon.svg';

// Toolbox Item Icons
import activeCardIcon from 'assets/images/icon-active-card.svg';
import activeCarouselIcon from 'assets/images/icon-active-carousel.svg';
import activeVideoIcon from 'assets/images/icon-active-video.svg';
import activeImageIcon from 'assets/images/icon-active-image.svg';
import activeTextIcon from 'assets/images/icon-active-text.svg';
import activeDelayIcon from 'assets/images/icon-active-delay.png';
import activeAudioIcon from 'assets/images/icon-active-audio.png';
import activeUserInputIcon from 'assets/images/icon-active-userinput.svg';

export const conditionBuilder = Object.freeze({
    ifElseOperator: Object.freeze({
        and: {
            label: 'all of the following conditions',
            operator: 'and'
        },
        or: {
            label: 'any of the following conditions',
            operator: 'or'
        }
    })
});

export default {
    messageType: {
        welcomemsg: {
            value: 'welcomemsg',
            label: 'Welcome Message',
            image: mini_welcome_msg_icon,
            title: 'Welcome Message',
            description:
                'A welcome message is shown to users as soon as they open Facebook Messenger in order to communicate with your fan page. ' +
                'Each fan page may only have ONE (1) welcome message.'
        },
        keywordmsg: {
            value: 'keywordmsg',
            label: 'Keyword Message',
            image: mini_keyword_msg_icon,
            title: 'Keyword Message',
            description:
                'As users message your fan page, you may want your bot to send them different messages depending on what was typed. ' +
                "With this type of engagement your bot is able to provide information and answer your subscriber's questions automatically."
        },
        general: {
            value: 'general',
            label: 'General',
            image: mini_general_icon,
            title: 'General Message',
            description:
                'A general message can be used to engage users when they subscribe to your campaigns.'
        },
        broadcast: {
            value: 'broadcast',
            label: 'Broadcast',
            image: mini_broadcast_icon,
            title: 'Broadcast Message',
            description:
                'A broadcast message allows you to create a flow and send it to many subscribers at once. ' +
                'With this type of engagement you can send promotional marketing material or even just a non-promotional notification with ease.'
        },
        json: {
            value: 'json',
            label: 'JSON',
            image: mini_unknown_icon,
            title: 'JSON Message',
            description:
                'A JSON message is strictly for running Facebook ads. When you create this type of message we restrict your FIRST step to only contain material that can be used in a Facebook ad. After you build it, you will be able to copy the JSON code to use in a Facebook ad from main Engagement screen by clicking on the “…”'
        },
        autoresponse: {
            value: 'autoresponse',
            label: 'AutoResponse',
            image: mini_autoresponse_icon,
            title: 'Auto response',
            description: 'This is a just an auto response'
        }
    },
    toolboxItems: {
        cardItem: {
            type: 'card',
            label: 'CARD',
            image: activeCardIcon,
            active: true,
            component: 'Card'
        },
        carouselItem: {
            type: 'carousel',
            label: 'CAROUSEL',
            image: activeCarouselIcon,
            active: true,
            component: 'Carousel'
        },
        videoItem: {
            type: 'video',
            label: 'VIDEO',
            image: activeVideoIcon,
            active: true,
            component: 'Video'
        },
        imageItem: {
            type: 'image',
            label: 'IMAGE',
            image: activeImageIcon,
            active: true,
            component: 'Image'
        },
        textItem: {
            type: 'text',
            label: 'TEXT',
            image: activeTextIcon,
            active: true,
            component: 'Text'
        },
        audioItem: {
            type: 'audio',
            label: 'AUDIO',
            image: activeAudioIcon,
            active: true,
            component: 'Audio'
        },
        delayItem: {
            type: 'delay',
            label: 'DELAY',
            image: activeDelayIcon,
            active: true,
            component: 'Delay'
        },
        userInputItem: {
            type: 'free_text_input',
            label: 'User Input',
            image: activeUserInputIcon,
            active: true,
            component: 'UserInput'
        }
    },
    workflowIcons: {
        broadcast: mini_broadcast_icon,
        autoresponse: mini_autoresponse_icon,
        general: mini_general_icon,
        json: mini_general_icon,
        keywordmsg: mini_keyword_msg_icon,
        welcomemsg: mini_welcome_msg_icon
    },
    keywordsOptions: [
        {
            key: 'contains_any',
            label: 'Contains Any',
            description:
                'This option would trigger your response if ANY of the words you list here are contained in the users message. ' +
                'You can list multiple words and if any of them appear in a message to your page, we will send the response you set.',
            constraint: 'Individual words only'
        },
        {
            key: 'contains_all',
            label: 'Contains All',
            description:
                'This option would trigger your response if ALL of the words or phrases you list here are used. ' +
                'If you list "Hello" and "There"... your response will only be sent if the message sent to your page contains both "Hello" and "There". ' +
                'If someone types "Hello" nothing would be sent if you select this option.',
            constraint: 'Individual words only'
        },
        {
            key: 'exact_match',
            label: 'Exact Match',
            description:
                'If you select this option your user will only receive a response if they type EXACTLY what you enter above. ' +
                'Capital letters do not matter, but if they word or phrase is sent to you exactly as you have it above, your response will send. ' +
                'If you use the phrase "Hello There" and someone types "Hello there Sam" your response will not send.'
        }
    ],
    builderTypes: Object.freeze({
        messageConfig: Object.freeze({
            type: 'items',
            label: 'Send Message',
            iconName: 'Send_Message'
        }),
        smsConfig: Object.freeze({
            type: 'sms',
            label: 'Send SMS',
            iconName: 'Another_Flow'
        }),
        conditionConfig: Object.freeze({
            type: 'conditions',
            label: 'Condition',
            iconName: 'Condition'
        }),
        randomizerConfig: Object.freeze({
            type: 'randomizer',
            label: 'Randomizer',
            iconName: 'Randomizer'
        }),
        delayConfig: Object.freeze({
            type: 'delay',
            label: 'Smart Delay',
            iconName: 'delaysm'
        })
    }),
    smsBuilderItemTypes: Object.freeze({
        text: 'text',
        image: 'image',
        audio: 'audio',
        video: 'video'
    })
};
