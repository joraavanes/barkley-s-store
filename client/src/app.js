import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router,Switch, Route, Link } from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './redux/store/store'
import App from './components/app'
import Auction from './components/Auction'
import Navigation from './components/Navigation'
import ViewItem from './components/ViewItem'
import LoginModal from './components/LoginModal'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/custom.scss'

const router = (
    <Provider store={store}>
        <Router>
                <Navigation/>
                {/* <div className='mask'></div> */}
                <LoginModal/>
                <Switch>
                    <Route 
                        path="/"
                        // render={() => <App products={products}/>}
                        component={App}
                        exact={true}/>
                    <Route path="/items" component={App} exact={true}/>
                    <Route path="/items/:name/:id" component={ViewItem} exact={true}/>
                    <Route path="/Auction" component={Auction}/>
                    <Route path="*" render={() => <h2>Middle of nowhere !</h2>}/>
                </Switch>
        </Router>
    </Provider>
);

ReactDOM.render(router, document.querySelector('#app'));