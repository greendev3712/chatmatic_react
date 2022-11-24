import React from 'react'; import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { Button, List, Grid } from 'semantic-ui-react';

import { Block, Svg, Pagination } from '../Layout';
import { Link } from 'react-router-dom';
import { getPageTemplates } from 'services/workflows/workflowsActions';
import { getUserCards } from 'services/auth/authActions';
import { PreviewTemplateModal } from './components';
// import { template } from 'lodash';
// import imgPlaceholder from 'assets/images/Image.png';
import TemplateCard from '../../Templates/components/TemplateCard';

const categories = ['Ecommerce', 'Digital Products', 'Health & Fitness', 'Local Business', 'General', 'Free']
// const randomColor = (category) => {
//     const colors = [
//         'blue',
//         'lightGreen',
//         'orange',
//         'lightBlue',
//         'voilet'
//     ];
//     return colors[categories.findIndex(c => c === category)];
// }

class SelectTemplate extends React.Component {
    state = {
        category: null,
        templateData: null,
        showTemplateModal: false,
        pageTemplates: []
    }

    componentDidMount = () => {
        this.props.actions.getUserCards();
        this.props.actions.getPageTemplates();
        this.handleChangeCategory(this.state.category);
    }

    UNSAFE_componentWillReceiveProps = ({ loading, error, templates }) => {
        if ((!templates || (templates && templates.length === 0)) && loading) {
            Swal({
                name: 'Please wait...',
                text: 'We are loading templates...',
                onOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false
            });
        } else if (!loading && error) {
            Swal.fire({
                type: 'error',
                name: 'Oops...',
                text: error || 'Something went wrong! Please try again.'
            });
        } else {
            Swal.close();
        }

        if (templates !== this.props.templates) {
            this.setState(({ category }) => ({
                category,
                templates
            }));
        }
    }

    handleChangeCategory = category => {
        const { templates: allTemplates } = this.props;
        let templates = allTemplates;
        console.log('category', category)
        if (category && category === 'Free') {
            templates = allTemplates.filter(t => Number(t.price) === 0);
        } else if (category) {
            templates = allTemplates.filter(t => t.category === category);
        }
        console.log('templates', templates)
        this.setState({
            category,
            templates
        });
    }

    _handleTemplatePreview = template => {
        console.log('template', template);
        // return false;
        this.setState({
            showTemplateModal: true,
            templateData: template
        });
    }

    closeTemplateModal = () => {
        // console.log('close modal');
        this.setState({
            showTemplateModal: false,
            templateData: null
        });
    };

    render() {
        // console.log('iinthe function')
        const { category, showTemplateModal, templateData, pageTemplates, templates } = this.state;
        const pageId = this.props.match.params.id;
        console.log('templates', templates);
        return (
            <Block className="main-container trigger-container trigger-newo">
                {showTemplateModal && (
                    <PreviewTemplateModal
                        open={showTemplateModal}
                        close={this.closeTemplateModal}
                        templateData={templateData}
                        id={pageId}
                    />
                )}
                <Block className="inner-box-main">
                    <Block className="float-left w-100">
                        <h2 className="title-head no-padding float-left">
                            Select Template
                        </h2>
                    </Block>

                    <Block className="add-temp-top-grid">
                        <Grid
                            columns={5}
                            className="grid-inner-block add-temp-top"
                        >
                            <Grid.Row>
                                <Grid.Column></Grid.Column>
                                <Grid.Column>
                                    <Link to={`/page/${pageId}/workflows/add`}>
                                        <Block className="sequence-inner add-new-workflow text-center">
                                            <Block className="icon-col select-temp-icon">
                                                <Svg name="plus" />
                                            </Block>
                                            <p className="sq-titlesm text-center">
                                                Blank Workflow
                                            </p>
                                        </Block>
                                    </Link>
                                </Grid.Column>
                                <Grid.Column>
                                    <Link to={`/page/${pageId}/workflows/add?type=privateReply`}>
                                        <Block className="sequence-inner add-new-workflow text-center">
                                            <Block className="icon-col select-temp-icon">
                                                <Svg name="plus" />
                                            </Block>
                                            <p className="sq-titlesm text-center">
                                                Private Reply
                                        </p>
                                        </Block>
                                    </Link>
                                </Grid.Column>
                                <Grid.Column>
                                    <Link to={`/page/${pageId}/workflows/add?type=JSON`}>
                                        <Block className="sequence-inner add-new-workflow text-center">
                                            <Block className="icon-col select-temp-icon">
                                                <Svg name="plus" />
                                            </Block>
                                            <p className="sq-titlesm text-center">
                                                Json
                                        </p>
                                        </Block>
                                    </Link>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Block>

                    <Block className="add-temp-middle-tab">
                        <Block className="edit-listing">
                            <List horizontal>
                                <List.Item className={`${!category ? 'active' : ''}`}>
                                    <Link onClick={() => this.handleChangeCategory(null)} to="#">All Products</Link>
                                </List.Item>
                                {categories.map((c, i) => (
                                    <List.Item className={`${c === category ? 'active' : ''}`} key={i}>
                                        <Link
                                            onClick={() => this.handleChangeCategory(c)}
                                            to="#"
                                        >
                                            {c}
                                        </Link>
                                    </List.Item>
                                ))}
                            </List>
                        </Block>
                    </Block>
                    <Block className="choose-sequence-box choose-work-temp-btm select-template-box row">
                        {pageTemplates && pageTemplates.map((t, i) => (
                            <TemplateCard item={t} index={i} buttonText="Preview Template" onButtonClick={this._handleTemplatePreview} key={i}/>
                        ))
                        }
                    </Block>
                    <Block className="paginationCol">
                        <Pagination
                            pageLimit={6}
                            onPageChange={pageTemplates => this.setState({ pageTemplates })}
                            data={templates}
                        />
                    </Block>
                </Block>
            </Block>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(
        {
            getPageTemplates,
            getUserCards
        },
        dispatch
    )
});

export default withRouter(
    connect(
        state => ({
            loading: state.default.workflows.loading,
            error: state.default.workflows.error,
            templates: state.default.workflows.templates
        }),
        mapDispatchToProps
    )(SelectTemplate)
);