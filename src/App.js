import React, { Component } from 'react'
import ReactQueryParams from 'react-query-params'

import TopSection from './components/TopSection/TopSection'
import MidSection from './components/MidSection/MidSection'
import BottomSection from './components/BottomSection/BottomSection'
import Page from './pages/Page'

// Pages
import * as Pages from './pages'

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            form: {
                first_name: '',
                last_name: '',
                email: '',
                agree_2: true
            },
            errors: {},
            step: 1,
            page: 'main'
        };

        this.pageHandler = this.pageHandler.bind(this);
    }

    syncForms = (form) => this.setState({form})
    syncErrors = (errors) => this.setState({errors})

    handleStep = (step) => {
        this.setState({step})
    };

    pageHandler(page) {
        window.scrollTo(0, 0);

        switch (page) {
            default:  
                this.setState({page: 'main'});
                break;
            case 'terms':
                this.setState({page: Pages.terms});
                break;
            case 'privacy':
                this.setState({page: Pages.privacy});
                break;
            case 'gov':
                this.setState({page: Pages.gov});
                break;
            case 'disc':
                this.setState({page: Pages.disc});
                break;
            case 'spam':
                this.setState({page: Pages.spam});
                break;
        }

    }

    render() {

        if (this.state.page === 'main') {
            return (
                <div className='App'>
                    <TopSection {...this.props}
                                handleStep={this.handleStep}
                                syncForms={this.syncForms}
                                syncErrors={this.syncErrors}
                                syncState={this.state}/>

                    <MidSection languageManager={this.props.languageManager}/>

                    <BottomSection
                        languageManager={this.props.languageManager}
                        pageHandler={this.pageHandler}
                        handleForward={this.handleForward}/>
                </div>
            )
        } else {
            return (
                <Page page={this.state.page} pageHandler={this.pageHandler}></Page>
            )
        }
    }
}
