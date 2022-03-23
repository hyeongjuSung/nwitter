nwitter 성형주
=============
2022-1 실무프로젝트 수업 내용 정리
-------------
## [03월 23일]
> 프로젝트 생성 시 오류 해결 방법
```
npx create-react-app nwitter 를 통해 프로젝트 생성 시 오류가 발생할 경우

npm install -g create-react-app@latest 를 통해 최신 버전 설치 후 진행하면 정상적으로 프로젝트 생성됨
```
> package.json 파일 수정
```
- scripts 부분 해당 코드 삭제
"test": "react-scripts test",

"eject": "react-scripts eject"
```
> index.js 파일 수정
```
- 해당 코드 삭제
import './index.css';

import reportWebVitals from './reportWebVitals';

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```
> App.js 파일 수정
```
- 해당 코드 삭제
import logo from './logo.svg';

import './App.css';

- return 문 내 코드 삭제 및 <div>App</div> 로 변경
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
```
> App.css, App.test.js, index.css, logo.svg, reportWebVitals.js, setupTest.js 파일 삭제