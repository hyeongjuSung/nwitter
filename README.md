nwitter 성형주
=============
2022-1 실무프로젝트 수업 내용 정리
-------------
## [04월 06일]
> 1. Router.js 코드 추가 - useState 함수 사용하기
```js
import { useState } from "react";
const [ isLoggedIn, setIsLoggedIn ] = useState(false);
```
> 2. Router.js 코드 추가 - 삼항 연산자를 통한 컴포넌트 반환
```js
import Auth from "../routes/Auth"
import Home from "../routes/Home"

<Route />
{isLoggedIn ? (
  // props 전달
  <Route exact path="/">
    <Home />
  </Route>
) : (
    <Route exact path="/">
      <Auth />
    </Route>
  )}
```
> 3. *Switch 컴포넌트 사용을 위해 react-router-dom 다운그레이드
```js
npm install react-router-dom@5.2.0
```
> 4. App.js 수정하기
```js
import AppRouter from "./Router";

return <AppRouter />;

```
> 5. App.js - useState 함수 위치 이동하기
```js
import { useState } from "react";

const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  return (
    <>
      <AppRouter iaLoggedIn={isLoggedIn} />
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
```
> 6. Router.js 수정하기
```js
- 해당 코드 삭제
import { useState } from "react";

const AppRouter = () => {
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)

- 상위 컴포넌트에서 받은 props는 구조분해할당으로 사용
const AppRouter = ({ isLoggedIn }) => {    
```
> 7. jsconfig.json 파일 생성 및 절대 경로 적용하기
```js
{
    "compilerOptions": {
        "baseUrl": "src"
    },
    "include": ["src"]
}
```
> 8. 컴포넌트의 import문 수정하기(App.js, Router.js, index.js)
```js
- App.js
import AppRouter from "components/Router";

- Router.js
import Auth from "routes/Auth"
import Home from "routes/Home"

- index.js
import App from 'components/App';
```
> 9. firebase.js 파일 이름 변경하기
- 패키지 이름과 파일 이름이 같으면 발생하는 오류를 방지하기 위해 파일명 변경
- firebase.js -> fbase.js

> 10. 파이어베이스 인증 모듈 사용하기(fbase.js)
```js
import firebase from "firebase/app";
import "firebase/auth";

firebase.initializeApp(firebaseConfig);

export const authService = firebase.auth(); 
```
> 11. App.js 코드 추가
```js
import { authService } from "fbase"

console.log(authService.currentUser)
```
> 12. *fbase.js 오류 해결
```js
- 에러: export 'default' (imported as 'firebase') was not found in 'firebase/app' (possible exports: FirebaseError, SDK_VERSION, _DEFAULT_ENTRY_NAME, _addComponent, _addOrOverwriteComponent, _apps, _clearComponents, _components, _getProvider, _registerComponent, _removeServiceInstance, deleteApp, getApp, getApps, initializeApp, onLog, registerVersion, setLogLevel)

- 해결: 경로명에 compat 추가

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
```

## [03월 30일]
> 1. Firebase 프로젝트 생성하기
- [Firebase 접속](https://firebase.google.com)
- 프로젝트 만들기(nwitter)
> 2. Firebase SDK 설치
```js
npm install firebase
```
> 3. firebase.js 파일 생성하기(비밀키 노출주의)

> 4. index.js 파일에 firebase 관련 import
```js
[firebase 8 버전 이하]
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

[firebase 9 버전 이상]
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
```
> 5. 비밀키 관련 설정
```
1. .env 파일 생성하기
2. .gitignore 파일에 .env 등록하기
3. firebase.js 파일 각각의 값을 변수로 변경 및 변수명 앞에 환경변수 process.env. 를 추가하여 참조하도록 수정
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

const AppRouter = () => { //Router를 미리 정의했으므로 AppRouter로 정의
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
> 9. Hooks
- 함수 컴포넌트에서 state를 관리하기 위해 사용
- Hooks를 사용하기 위해 useState 함수 이용

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