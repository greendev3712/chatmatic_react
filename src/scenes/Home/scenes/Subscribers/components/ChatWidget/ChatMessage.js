import React from 'react';
import PropTypes from 'prop-types';

const URL_PATTERN = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
    'i'
);

const ChatMessage = props => {
    const { message } = props;
    const parseMessage = message => {
        if (!message || message.length <= 0) {
            return;
        }

        if (message.slice(0, 1) == '{' && message.slice(-1) == '}') {
            message = message.slice(1, message.length - 1);

            const images = message
                .split(',')
                .filter(x => !!URL_PATTERN.test(x))
                .map((img, i) => (
                    <img key={i} src={img} className="img-fluid my-2" />
                ));
            return <>{images}</>;
        }
        return message;
    };

    return (
        <>
            {parseMessage(message.message)}
            {message.images &&
                message.images.map((image, x) => (
                    <img key={x} src={image} className="img-fluid my-2" />
                ))}
        </>
    );
};

ChatMessage.propTypes = {
    message: PropTypes.object.isRequired
};

export default ChatMessage;
