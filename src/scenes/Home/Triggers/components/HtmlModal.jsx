import React from 'react';
import { Button, Icon, Header, Image, Modal } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr';
import $ from 'jquery';

const copyHtml = (close) => {
    const temp = $('<input>');
    $('body').append(temp);
    temp.val($('#html-code').text()).select();
    document.execCommand('copy');
    temp.remove();
    toastr.success('Copy HTML', 'Code is copied to clipboard');
    setTimeout(() => {
        close();
    }, 200);
};

const HtmlModal = ({ html, open, close, htmlType }) => (
    <Modal
        // trigger={<Button>Show Modal</Button>}
        centered={false}
        open={open}
        // onClick={close}
        className="addtri-modal"
    >
        <Modal.Header>HTML Code</Modal.Header>
        <Modal.Content>
            <Modal.Description>
                <Header>Copy and use this html code</Header>
                {htmlType === 'json' ? (<pre id="html-code">{html}</pre>) : (<code id="html-code">{html}</code>)}
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <Button
                onClick={close}
                className="button btn btn-default trans-btn"
            >
                {' '}
                Close{' '}
            </Button>
            <Button
                onClick={() => copyHtml(close)}
                className="button btn btn-default common-btn"
            >
                <Icon name="copy outline" /> Copy to clipboard{' '}
            </Button>
        </Modal.Actions>
    </Modal>
);

export default HtmlModal;
