import React from 'react';
import ReactDOM from 'react-dom';
import { LpFramework, LpFrameworkWrapper } from 'sb-lp-framework';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <LpFramework
        resourceFile={require('./resources/languages.json')}
        funnel_name={"Bitcoin Evolution"}>
        <LpFrameworkWrapper Component={App}/>
    </LpFramework>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
