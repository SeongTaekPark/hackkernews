import React, { Component } from 'react';
import './App.css';

const list = [
    {
        title: 'React',
        url: 'https://reactjs.org/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 0,
    },
    {
        title: 'Redux',
        url: 'https://github.com/reactjs/redux',
        author: 'Dan Abramov, Andrew Clark',
        num_comments: 2,
        points: 5,
        objectID: 1,
    }
];

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

const isSearched = searchTerm => item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list,       // ES6에서는 개체 프로퍼티 이름과 변수 이름이 같다면, 하나로 축약해 정의합니다.
            searchTerm : ''
        }
        // 클래스 메서드는 클래스 인스턴스에 자동으로 this를 바인딩하지 않기 때문에 일일이 바인딩을 해줘야 합니다.
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    onDismiss(id) {
        const updatedList = this.state.list.filter(item => item.objectID !== id);
        this.setState({list: updatedList});
    }

    onSearchChange(event) {
        this.setState({searchTerm: event.target.value});
    }

    // ES6 화살표 함수를 사용하면 클래스 메서드를 생성자 내부에 바인딩하지 않고도 자동 바인딩할 수 있습니다.
    // onDismiss = (id) => {
    //     const updatedList = this.state.list.filter(item => item.objectID !== id);
    //     this.setState({list: updatedList});
    // }

    render() {
        // ES6 구조해체(destructing) 문법
        const {list, searchTerm} = this.state;

        return (
            <div className = "App">
                <div className="page">
                    <div className="interactions">
                        <Search
                            value={searchTerm}
                            onChange={this.onSearchChange}>
                            Search
                        </Search>
                    </div>
                    <Table
                        list={list}
                        pattern={searchTerm}
                        onDismiss={this.onDismiss}
                    />
                </div>
            </div>
        );
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
const Search = ({value, onChange, children}) => {
    return (
        <form>
            {children} <input
                type="text"
                value={value}
                onChange={onChange}
            />
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
const Table = ({list, pattern, onDismiss}) => {
    return (
        <div className="table">
            {list.filter(isSearched(pattern)).map(item => 
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
