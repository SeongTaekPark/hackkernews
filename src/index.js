import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

// Hot Module Replacement (HMR) -> 브라우저 내 애플리케이션을 재실행하는 도구 (브라우저는 새로고침 되지 않지만, 애플리케이션이 재실행되어 올바른 결과가 출력)
if (module.hot) {
    module.hot.accept();
}
