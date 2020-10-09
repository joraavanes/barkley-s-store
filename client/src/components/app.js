import React from 'react'
import {connect} from 'react-redux'
import {Container, Button, Row, Col} from 'reactstrap'
import debounce from 'lodash.debounce'
import {getItems,clearItems,clearTimestamp,resetPageNumber,allFetched} from '../redux/actions/itemActions'
import { clearSearchText } from '../redux/actions/filterActions'
import SearchProduct from './SearchProduct'
import Items from './Items/Items'

// import {products} from './mock/mock'
// import img from '../media/avatar.png'

class App extends React.Component{
    state = {
        pageTitle: 'Welcome to Barkley\'s Store',
        filteredItems: [],
        pageNumber: 0
    };

    // Checks if user sees the loading spinner, if so then again calls for new items from server
    handleWindowScroll = () => {
        const threshold = window.innerHeight + document.documentElement.scrollTop >= (document.documentElement.offsetHeight - 48);

        if(threshold && this.props.lastTimestamp != 0){
            this.props.getItems(this.props.lastTimestamp);
        }
    }
    
    // Calls remote server for new items, then udpates lastTimestamp for further items later
    componentDidMount = () => {
        this.props.clearItems();

        const timestamp = new Date().valueOf();
        this.props.getItems(timestamp);

        window.onscroll = debounce(this.handleWindowScroll, 800);
    }

    getSnapshotBeforeUpdate = (prevProps, prevState) => {
        // console.log('getSnapshotBeforeUpdate', this.props.products);
        // if(prevProps.products.length < this.props.products.length){
        //     console.log('debounced');
        //     // window.addEventListener('scroll', this.handleWindowScroll);
        //     // window.onscroll = debounce(this.handleWindowScroll, 1000);
        //     window.addEventListener('scroll', debounce(this.handleWindowScroll, 1000));
        // }else{
        //     console.log('debounce stopped');
        //     window.removeEventListener('scroll', debounce(this.handleWindowScroll, 1000));
        // }
        return this.props.products.length;
    }

    componentDidUpdate = (prevProps, prevState, snapshot) =>{
        // if(prevProps.products.length < this.props.products.length){
        //     console.log('NEW PRODUCTS');
        // }

        // Checks if user puts no text for search to refetch items again
        if(this.props.lastTimestamp == undefined && this.props.searchText == '' && this.props.products.length == 0){
            const timestamp = new Date().valueOf();
            this.props.getItems(timestamp);
        }
    }

    // Removes the existing state related to items
    componentWillUnmount = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        this.props.clearItems();

        window.onscroll = undefined;
    }

    render = () => {
        const {searchText, pageNumber, lastTimestamp} = this.props;
        const {pageTitle} = this.state;

        return(
            <React.Fragment>                
                <SearchProduct/>
                <Container>
                    <Row>
                        <Col>
                            <h2 className="text-center pt-3 pb-3">
                                {searchText !== '' ? <>Searched for: <span className="badge badge-warning bg-pink text-light">{searchText}</span></> : pageTitle}
                            </h2>                            
                        </Col>
                    </Row>
                </Container>
                <Items products={this.props.products}/>
                {lastTimestamp != undefined && (
                    <Container>
                        <Row>
                            <div className="col-12 offset-sm-4 col-sm-4 text-center mt-4">
                                <div role="status" style={{width: '3rem', height: '3rem', borderWidth: '.35em'}} className="spinner-border text-danger">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        </Row>
                    </Container>
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return{
        products: state.items.items,
        pageNumber: state.items.pageNumber,
        lastTimestamp: state.items.lastTimestamp,
        searchText: state.filters.searchText,
        loading: state.items.loading
    }
};

// ReactDOM.render(<App products={products}/>, document.querySelector('#app'));
export default connect(mapStateToProps,{getItems, clearItems, clearTimestamp, resetPageNumber, allFetched, clearSearchText})(App);