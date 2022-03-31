nwitter 성형주
=============
2022-1 실무프로젝트 수업 내용 정리
-------------
## [03월 30일]
> 1. Firebase 프로젝트 생성하기
- [Firebase 접속](https://firebase.google.com)
> 2. Firebase SDK 설치
```js
npm install firebase
```
> 3. firebase.js 파일 생성하기(비밀키 노출주의)
> 4. index.js 파일에 firebase 관련 import
```js
[firebase 8버전 이하]
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

[firebase 9버전 이상]
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
```
> 5. 비밀키 관련 설정
```
1. .env 파일 생성하기
2. .gitignore 파일에 .env 등록하기
3. firebase.js 파일 각각의 값을 변수로 변경 및 변수명 앞에 process.env. 추가하여 참조하도록 수정
```
> 6. 프로젝트 루트에 components 및 routes 폴더 생성하기
- App.js 파일을 components 폴더로 이동
- Auth.js, EditProfile.js, Home.js, Profile.js 파일을 routes 폴더에 생성
=> 파일안에 코드는 아래와 같이 추가
```js
const 컴포넌트명 = () => <span>컴포넌트명</span>

export default 컴포넌트명
```
> 7. react-router-dom 설치
```js
npm install react-router-dom
```
> 8. Router.js 파일 생성하기
```js
import { HashRouter as Router, Route, Switch } from "react-router-dom";

const AppRouter = () => {
    return (
        <Router>
            <Switch>
                <Route />
            </Switch>
        </Router>
    )
}

export default AppRouter 
```

## [03월 23일]
> 프로젝트 생성 시 오류 해결 방법
```js
npx create-react-app nwitter 를 통해 프로젝트 생성 시 오류가 발생할 경우

npm install -g create-react-app@latest 를 통해 최신 버전 설치 후 진행하면 정상적으로 프로젝트가 생성됨
```
> 1. package.json 파일 수정
```js
- scripts 부분 해당 코드 삭제

"test": "react-scripts test",

"eject": "react-scripts eject"
```
> 2. index.js 파일 수정
```js
- 해당 코드 삭제

import './index.css';

import reportWebVitals from './reportWebVitals';

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```
> 3. App.js 파일 수정
```js
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
> 4. App.css, App.test.js, index.css, logo.svg, reportWebVitals.js, setupTest.js 파일 삭제