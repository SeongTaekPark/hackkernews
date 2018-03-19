import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';


const largeColumn = {
    width: '40%',
}

const midColumn = {
    width: '30%',
}

const smallColumn = {
    width: '10%',
}

// function isSearched(searchTerm) {
//     return function(item) {
//         return item.title.toLowerCase().includes(searchTerm.toLowerCase());
//     }
// }

// const isSearched = searchTerm => item => 
//     item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

    // 컴포넌트 생명주기 상태를 가리키는 클래스 필드.
    _isMounted = false;

    constructor(props) {
        super(props);

        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            error: null
        };
        // 클래스 메서드는 클래스 인스턴스에 자동으로 this를 바인딩하지 않기 때문에 일일이 바인딩을 해줘야 합니다.
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    }

    onDismiss(id) {
        const {searchKey, results} = this.state;
        const {hits, page} = results[searchKey];

        const isNotId = item => item.objectID !== id;

        const updatedHits = hits.filter(isNotId);

        this.setState({
            // 리액트는 불변 데이터 구조 원칙에 따라 객체 또는 상태를 바로 변경할 수 없습니다.
            // 올바른 접근법은 원 객체와 동일한 객체를 생성하여 그 어떤 객체도 변경하지 않고 그대로 유지하는 것입니다.
            // Object.assign() 함수를 사용하면 소스 객체는 변경되지 않기 때문에 불변성 원칙을 고수합니다.
            // result: Object.assign({}, this.state.result, {hits: updatedHits})

            // Object.assign() 함수를 ES6 전개연산자로 대체.
            results: {
                ...results,
                [searchKey]: {hits:updatedHits, page}
            }
        });
    }

    onSearchChange(event) {
        this.setState({searchTerm: event.target.value});
    }

    setSearchTopStories(result) {
        const {hits, page} = result;
        const {searchKey, results} = this.state;
        const oldHits = results && results[searchKey]
            ? results[searchKey]
            : [];

        const updatedHits = [...oldHits, ...hits];

        this.setState({
            results: {
                ...results,     // 객체 전개 연산자를 사용해 searchKey 에 따른 모든 results를 전파합니다. 그렇지 않으면 기존에 저장된 모든 results가 손실됩니다.
                [searchKey]: {hits:updatedHits, page}
            }
        });
    }

    needsToSearchTopStories(searchTerm) {
        return !this.state.results[searchTerm];
    }

    onSearchSubmit(event) {
        const { searchTerm } = this.state;
        this.setState({
            searchKey: searchTerm
        });

        if (this.needsToSearchTopStories(searchTerm)) {
            this.fetchSearchTopStories(searchTerm);
        }
    
        // HTML 폼 전송 콜백에 대한 네이티브 브라우저 동작(새로고침)을 방지하기 위해.
        event.preventDefault();
    }

    fetchSearchTopStories(searchTerm, page = 0) {
        console.log('fetchSearchTopStories()');

        axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
        .then(result => this._isMounted && this.setSearchTopStories(result.data))
        .catch(error => this._isMounted && this.setState({error}));
    }


    // ES6 화살표 함수를 사용하면 클래스 메서드를 생성자 내부에 바인딩하지 않고도 자동 바인딩할 수 있습니다.
    // onDismiss = (id) => {
    //     const updatedList = this.state.list.filter(item => item.objectID !== id);
    //     this.setState({list: updatedList});
    // }

    render() {
        // ES6 구조해체(destructing) 문법
        const {searchTerm, results, searchKey, error} = this.state;

        // result 가 없을 때 페이지 번호 기본값은 0.
        const page = (
            results &&
            results[searchKey] &&
            results[searchKey].page
        ) || 0

        const list = (
            results &&
            results[searchKey] &&
            results[searchKey].hits
        ) || [];

        // console.log(result);
        return (
            <div className = "App">
                <div className="page">
                    <div className="interactions">
                        <Search
                            value={searchTerm}
                            onChange={this.onSearchChange}
                            onSubmit={this.onSearchSubmit}>
                            Search
                        </Search>
                    </div>
                    {
                        error
                        ? <div className="interactions"><p>Something went wrong.</p></div>
                        : <Table
                        list={list}
                        onDismiss={this.onDismiss}
                        />
                    }
                    <div className="interactions">
                        <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                            More
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this._isMounted = true;

        const { searchTerm } = this.state;
        this.setState({
            searchKey: searchTerm
        });
        this.fetchSearchTopStories(searchTerm);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
}

// class Search extends Component {
//     render() {
//         const {value, onChange, children} = this.props;

//         return (
//             <form>
//                 {children} <input
//                     type="text"
//                     value={value}
//                     onChange={onChange}
//                 />
//             </form>
//         );
//     }
// }

// Search 컴포넌트 클래스를 '비 상태 함수형 컴포넌트'로 리팩터링
const Search = (
    {value, onChange, onSubmit, children}
) => {
    return (
        <form onSubmit={onSubmit}>
            <input
                type="text"
                value={value}
                onChange={onChange}
            />
            <button type="submit">
                {children}
            </button>
        </form>
    )
}

// class Table extends Component {
//     render() {
//         const {list, pattern, onDismiss} = this.props;

//         return(
//             <div>
//                 {list.filter(isSearched(pattern)).map(item => 
//                     <div key={item.objectID}>
//                         <span>
//                         <a href={item.url}>{item.title}</a>
//                         </span>
//                         <span>{item.author}</span>
//                         <span>{item.num_comments}</span>
//                         <span>{item.points}</span>
//                         <span>
//                             <Button
//                                 onClick={() => onDismiss(item.objectID)}>
//                                 Dismiss
//                             </Button>
//                         </span>
//                     </div>)
//                 }
//             </div>
//         );
//     }
// }

// Table 컴포넌트 클래스를 '비 상태 함수형 컴포넌트'로 리팩터링
const Table = ({list, onDismiss}) => {
    return (
        <div className="table">
            {list.map(item => 
                <div key={item.objectID} className="table-row">
                    <span style={largeColumn}>
                        <a href={item.url}>{item.title}</a>
                    </span>
                    <span style={midColumn}>{item.author}</span>
                    <span style={smallColumn}>{item.num_comments}</span>
                    <span style={smallColumn}>{item.points}</span>
                    <span style={smallColumn}>
                        <Button
                            onClick={() => onDismiss(item.objectID)}
                            className="button-inline">
                            Dismiss
                        </Button>
                    </span>
                </div>)
            }
        </div>
    )
}


// class Button extends Component {
//     render() {
//         const {
//             onClick,
//             className = '',
//             children
//         } = this.props;

//         return (
//             <button
//                 onClick={onClick}
//                 className={className}
//                 type="button"
//             >
//                 {children}
//             </button>
//         )
//     }
// }

// Button 컴포넌트 클래스를 '비 상태 함수형 컴포넌트'로 리팩터링
const Button = ({onClick, className, children}) => {
    return (
        <button
            onClick={onClick}
            className={className}
            type="button"
        >
            {children}
        </button>
    )
}

export default App;
