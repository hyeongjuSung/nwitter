nwitter 성형주
=============
2022-1 실무프로젝트 수업 내용 정리
-------------
## [05월 04일]
> 1. Auth.js - provider 적용허기
```js
- 해당 코드 수정
import { authService, firebaseInstance } from "fbase";

const onSocialClick = (event) => {
        const {
            target: {name},
        } = event;
        let provider;
        if(name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name === "github") {
            provider = new firebaseInstance.auth.GithubAuthProvider();
    };
```
> 2. Auth.js - 소셜로그인 완성하기
```js
-ㅙ당 코드 수정
const onSocialClick = async (event) => {
        const {
            target: {name},
        } = event;
        let provider;
        if(name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name === "github") {
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        const data = await authService.signInWithPopup(provider);
        console.log(data);
    };
```
> 3. 네비게이션 컴포넌트 만들기
```js
- components 폴더에 Navigation.js 파일 생성
- 해당 코드 추가

const Navigation = () => {
    return <nav>This is Navigation</nav>
};

export default Navigation;
```
> 4. Router.js - 네비게이션 컴포넌트 라우터에 추가하기
```js
- 해당 코드 추가

import Navigation from "./Navigation";

{isLoggedIn && <Navigation />}
```
> 5. Navigation.js - 링크 추가하기
```js
- 해당 코드 추가
import { Link } from "react-router-dom";

const Navigation = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/profile">My Profile</Link>
                </li>
            </ul>
        </nav>
    );
};
```
> 6. Router.js - 링크 추가하기
```js
-해당 코드 추가
import Profile from "routes/Profile";

<Route exact path="/profile">
   <Profile />
</Route>
```
> 7. Profile.js - 로그아웃 버튼 만들기
```js
- 해당 코드 추가
import { authService } from "fbase"

const onLogOutClick = () => authService.signOut();

    return (
        <>
            <button onClick={onLogOutClick}>Log out</button>
        </>
    );
```
> 8. Router.js - 로그아웃 후 주소 이동하기
```js
-해당 코드 추가
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";

<Redirect from="*" to="/" />
```
> 8. Router.js - useHistory로 로그아웃
```js
-해당 코드 삭제
import {  Redirect } from "react-router-dom";

<Redirect from="*" to="/" />
```
> 9. Profile.js - useHistory로 로그아웃 후 주소 이동하기
```js
-해당 큐드 추가
import { useHistory } from "react-router-dom";

const history = useHistory();

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
```
> 10. Home.js - 트윗을 위한 폼 만들기
```js
- 해당 코드 추가
import { useState } from "react"

const Home = () => {
    const [nweet, setNweet] = useState("");

    const onSubmit = (event) => {
        event.preventDefault();
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target: {value},
        } = event;
        setNweet(value);
    };

    return (
        <form onSubmit={onSubmit}>
            <input
                value={nweet}
                onChange={onChange}
                type="text"
                placeholder="What's on your mind?"
                maxLength={120}
            />
            <input type="submit" value="Nweet" />    
        </form>
    );
};
```
> 11. 트윗을 위한 파이어베이스 데이터베이스 생성하기
- [Firebase 접속](https://console.firebase.google.com)
- Firebase Database 탭
- 데이터베이스 만들기
- 테스트 모드에서 시작
- 위치 설정
## [04월 27일]
> 1. Auth.js - 파이어베이스로 로그인과 회원가입 처리하기
```js
- 해당 코드 추가 후 Create Account로 회원가입이 정상적으로 동작하는지 확인 
import { authService } from "fbase";

const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if(newAccount) {
                //create newAccount
                data = await authService.createUserWithEmailAndPassword(email, password);
            } else {
                // log in
                data = await authService.signInWithEmailAndPassword(email, password);
            }
            console.log(data);
        } catch(error) {
            console.log(error);
        }
    }
```
> 2. 로그인을 지속시켜주는 setPersistence
```
- 파이어베이스의 로그인 상태 지속 방법
- 프로젝트에서는 웹 브라우저를 종료해도 로그인이 유지되는 local 옵션을 사용(기본값)
```
> 3. IndexedDB
```
- local 옵션으로 저장한 사용자 로그인 정보를 담고있는 DB
- 개발자도구 > Application탭 > Storage > IndexedDB > firebaseLocalStorageDB > firebaseLocalStorage 에서 확인
- IndexedDB 를 clear 하면 수동으로 로그아웃 가능
```
> 4. App.js - setInterval 함수로 딜레이 확인하기
```js
- setInterval: 2번째 인자로 지정한 시간 간격마다 1번째 인자로 전달한 코드를 실행

- 해당 코드 추가
setInterval(() => console.log(authService.currentUser), 2000);
```
> 5. App.js - useEffect 함수 사용하기
```js
- useEffect 함수로 파이어베이스가 초기화되는 시점을 잡아낸 후, 로그인 완료 후 보여줄 화면을 렌더링

- 해당 코드 수정
import { useEffect, useState } from "react";

useEffect(() => {
    authService.onAuthStateChanged((user) => console.log(user));
  }, []);

- 해당 코드 수정(화면 렌더링)
  const [ init, setInit ] = useState(false);
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => console.log(user));
    authService.onAuthStateChanged((user) => {
      if(user) {
        setIsLoggedIn(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      <AppRouter iaLoggedIn={isLoggedIn} />
      {init ? <AppRouter iaLoggedIn={isLoggedIn} /> : "initializing..."}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );  
```
> 6. Auth.js - 에러와 에러 메시지를 파이어베이스로 처리하기
```js
- 해당 코드 수정
const [error, setError] = useState("");

catch(error) {
  setError(error.message);
}
```
> 7. Auth.js - 로그인/회원가입 토글 버튼 적용하기
```js
- 해당 코드 추가
const toggleAccount = () => setNewAccount((prev) => !prev);

 <span onClick={toggleAccount}>
    {newAccount ? "Sign In" : "Create Account"}
</span>
```
> 8. Auth.js - 소셜 로그인 버튼에서 name 속성 사용하기
```js
- 해당 코드 추가하여 소셜 로그인을 구별
const onSocialClick = (event) => {
  console.log(event.target.name);
};

<button onClick={onSocialClick} name="google">Continue with Google</button>
<button onClick={onSocialClick} name="github">Continue with Github</button>
```
> 9. fbase.js - firebaseInstance 추가하기
```js
- 해당 코드 추가
export const firebaseInstance = firebase;
```
## [04월 13일]
> 1. App.js - useState 초기값 정의
```js
- 해당 코드 삭제
console.log(authService.currentUser)

- 해당 코드 수정
const [ isLoggedIn, setIsLoggedIn ] = useState(authService.currentUser);
```
> 2. 파이어베이스 인증 설정하기
- [Firebase 접속](https://console.firebase.google.com)
- Authentication -> 시작하기 -> Sign-in method 탭
- 이메일 사용 설정 체크
- 구글 로그인 사용 설정 체크(기본값 설정)
- 깃허브 사용 설정 체크(콜백 URL 복사) -> 깃허브 접속 후 Developer Settings 이동 -> OAuth apps 이동 -> Register a new application 클릭
- Application name: Nwiiter
- Homepage URL: Firebase에서 firbaseapp.com 으로 끝나는 승인된 도메인 복사(https:// 입력필수)
- Authorization callback URL: 복사했던 콜백 URL 입력
- Register application 클릭하여 설정 완료
- 생성된 Client ID 및 Client secrets 값을 firebase의 클라이언트 ID 및 보안 비밀번호 영역에 각각 복사

> 3. Auth.js - 로그인 폼 기본 구조 만들기
```js
- 해당 코드 삭제
<span>Auth</span>

- 해당 코드 추가
{
    return (
        <div>
            <form>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <input type="submit" value="Log in" />
            </form>
            <div>
                <button>Continue with Google</button>
                <button>Continue with Github</button>
            </div>
        </div>
    )
}
```
> 4. Auth.js - 로그인 폼이 state를 업데이트하도록 만들기
```js
import { useState } from "react"

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = (event) => {
        // onSubmit 함수에서 이벤트의 기본값을 막아줌
        event.preventDefault();
    }

    return (
        <div>
            <form>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
            <form onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange} />
                <input namr="password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
                <input type="submit" value="Log in" />
            </form>
            <div>
```
> 5. Auth.js onSubmit 함수에서 로그인과 회원가입 분기시키기
```js
- 해당 코드 추가
const [newAccount, setNewAccount] = useState(true);

event.preventDefault();
        if(newAccount) {
            //create newAccount
        } else {
            // log in
        }

- 해당 코드 수정
// 회원가입과 로그인 분기
<input type="submit" value={newAccount ? "Create Account" : "Log in"} />

```

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