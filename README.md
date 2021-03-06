nwitter 성형주
=============
2022-1 실무프로젝트 수업 내용 정리
-------------
## [06월 14일]
> 1. Profile.js - Profile 컴포넌트 삭제하기
```js
- 해당 코드 삭제
const getMyNweets = async () => {
        const nweets = await dbService.collection("nweets").where("creatorId", "==", userObj.uid).orderBy("createdAt", "asc").get();

        console.log(nweets.docs.map((doc) => doc.data()));
    }

    useEffect(() => {
        getMyNweets();
    }, []);
```
> 2. 내비게이션에 이름 널기
```js
- Router.js
- 해당 코드 추가
{isLoggedIn && <Navigation userObj={userObj} />}

- Navigation.js
- 해당 코드 추가
const Navigation = ({ userObj }) => 
...
Link to="/profile">{userObj.displayName}의 Profile</Link>

```
> 3. Profile.js - 프로필 업데이트 기능 추가하기
```js
- 해당 코드 추가
const Profile = ({ userObj }) => 

const [newDisplayName, setNewDisplayName] = useState(userObj.newDisplayName);

const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    };

const onSubmit = (event) => {
    event.preventDefault();    
}

<form onSubmit={onSubmit}>
    <input onChange={onChange} type="text" placeholder="Display name" value={newDisplayName}/>
    <input type="submit" placeholder="Update Profile"/>
</form>
```
> 4. Profile.js - 프로필 업데이트하기
```js
const onSubmit = async (event) => {
    event.preventDefault();
    if(userObj.displayName !== newDisplayName) {
        await userObj.updateProfile({ displayName: newDisplayName});
    }
}
```
> 5. App.js - refreshUser 함수 추가하기
```js
- 해당 코드 추가
const refreshUser = () => {
    setUserObj(authService.currentUser);
};
```
> 6. refreshUser 함수 Profile 컴포넌트로 보내주기
```js
- 파일명, 컴포넌트명, export명이 동일해야 하지만 컴포넌트명이 AppRouter로 되어있으니 주의 

- App.js
- 해당 코드 추가
<AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj} />

- Router.js
- 해당 코드 수정
const AppRouter = ({ isLoggedIn, userObj, refreshUser })
<Profile refreshUser={refreshUser} userObj={userObj} />

- Profile.js
- 해당 코드 추가
const Profile = ({ userObj, refreshUser })
refreshUser();
```
> 7. App.js - userObj 크기 줄이기
```js
setUserObj({
    uid: user.uid,
    displayName: user.displayName,
    updateProfile: (args) => user.updateProfile(args);
});
```
> 8. App.js - isLoggedIn 크기 줄이기
```js
- 해당 코드 삭제
setisLoggedIn(user);

- 해당 코드 수정
<AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} />

const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      uid: user.uid,
      displayName: user.displayName,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
```
## [06월 08일]
> 1. fbase.js - 파이어베이스 스토리지 임포트하기
```js
- 해당 코드 추가
import "firebase/compat/storage";

export const storageService = firebase.storage();
```
> 2. Home.js - 스토리지 간단하게 사용해 보기
```js
- 해당 코드 주석처리
// await dbService.collection("nweets").add({
        //     text: nweet,
        //     createdAt: Date.now(),
        //     creatorId: userObj.uid,
        // });
        // setNweet("");
```
> 3. Home.js - 고유 식별자를 만들어주는 UUID 라이브러리 설치하기
```js
npm install uuid
```
> 4. Home.js - UUID 임포트하기
```js
- 해당 코드 추가
import { v4 as uuidv4 } from 'uuid';
```
> 5. Home.js - 스토리지 레퍼런스 사용해보기
```js
-해당 코드 추가
import { dbService, storageService } from "fbase";

storageService.ref().child(`$(userObj.uid)/${uuidv4()}`);
```
> 6. Home.js - 스토리지에 사진 저장해보기
```js
-해당 코드 추가
const attachmentRef = storageService.ref().child(`$(userObj.uid)/${uuidv4()}`);
const response = await attachmentRef.putString(attachment, "data_url");
cosole.log(response);
```
> 7. Home.js - 스토리지에서 사진 불러오기
```js
- 해당 코드 추가
console.log(await response.ref.getDownloadURL());
```
> 8. 사진을 포함한 트윗 결과 화면에 출력허기
```js
- Home.js
- 해당 코드 추가
const attachmentUrl = await response.ref.getDownloadURL();

const onSubmit = async (event) => {
        event.preventDefault();
        const attachmentRef = storageService.ref().child(`$(userObj.uid)/${uuidv4()}`);
        const response = await attachmentRef.putString(attachment, "data_url");
        const attachmentUrl = await response.ref.getDownloadURL();
        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        });
        setNweet("");
        setAttachment("");
    };

- Nweet.js
- 해당 코드 추가
{nweetObj.attachmentUrl && (
    <img src={nweetObj.attachmentUrl} width="50px" height="50px" />
)}
```
> 9. Home.js - 코드 다듬기
```js
- 해당 코드 수정
let attachmentUrl = ""
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`$(userObj.uid)/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
```
> 10. Nweet.js - 트윗 삭제 시 사진을 스토리지에서 삭제하기
```js
- 해당 코드 수정
import { dbService, storageService } from "fbase";

const oneDeleteClick = async () => {
        const ok = window.confirm("삭제하시겠습니까?");
        if (ok) {
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            if (nweetObj.attachmentUrl !== "")
                await storageService.refFromURL(nweetObj.attachmentUrl).delete();
        }
    }
```
> 11. 파일 정리하기
```js
1. EditProfile.js 파일 삭제

2. Router.js
- 해당 코드 수정
<Profile userObj={userObj} />

3. Profile.js
- 해당 코드 수정
const Profile = ( userObj ) =>
```
> 12. Profile.js - 트윗 필터링 기능 구현하기
```js
- 해당 코드 추가
import { authService, dbService } from "fbase"
import { useEffect } from "react";

const getMyNweets = async () => {
        const nweets = await dbService.collection("nweets").where("creatorId", "==", userObj.uid);
    }

    useEffect(() => {}, []);

```
> 13. Profile.js - 정렬 쿼리 사용해보기
```js
- 해당 코드 수정
const nweets = await dbService.collection("nweets").where("creatorId", "==", userObj.uid).orderBy("createdAt", "asc");
```
> 14. Profile.js - 필터링한 트윗 목록 콘솔에 출력해보기
```js
- 해당 코드 수정
const nweets = await dbService.collection("nweets").where("creatorId", "==", userObj.uid).orderBy("createdAt", "asc").get();

console.log(nweets.docs.map((doc) => doc.data()));

useEffect(() => {
        getMyNweets();
    }, []);
```
> 15. 복합 색인 만들기
```
1. 컬렉션 ID: nwitter
2. 색인 필드: (creatorId 오름차순), (createdAt, 오름차순)
3. 쿼리 범위: 컬렉션
```
## [05월 25일]
> 1. Nweet.js - 수정 기능을 위한 useState 추가하기
```js
- 해당 코드 추가
import { useState } from "react";

const [editing, setEditing] = useState(false);
const [newNweet, setNewNweet] = useState(nweetObj.text);

const toggleEditing = () => setEditing((prev) => !prev);

<button onClick={toggleEditing}>Edit Nweet</button> 

{editing ? (
    <>             
        <form>
            <input value={newNweet} required />
        </form>
        <button onClick={toggleEditing}>Cancel</button>
                </>
         ) : (

         )}
```
> 2. Nweet.js - 입력란에 onChange 작업하기
```js
- 해당 코드 추가
const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewNweet(value);
    };
<input onChange={onChange} value={newNweet} required />
```
> 3. Nweet.js - 파이어스토어에 새 입력값 반영하기
```js
-해당 코드 추가
const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`nweets/${nweetObj.id}`).update({ text: newNweet });
        setEditing(false);
    };

<form onSubmit={onSubmit}>
    <input onChange={onChange} value={newNweet} required />
    <input type="submit" value="Update Nweet" />
</form>
```
> 4. Home.js - 파일 첨부 양식 만들기
```js
- 해당 코드 추가
<input type="file" accept="image/*" />
```
> 5. App.js - 화면 깔끔하게 정리하기
```js
- 해당 코드 삭제
<footer>&copy; {new Date().getFullYear()} Nwitter</footer>
```
> 6. Home.js - 첨부 파일 정보 출력해보기
```js
- 해당 코드 추가
const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];
};

<input type="file" accept="image/*" onChange={onFileChange}/>
```
> 7. Home.js - 웹 브라우저에 사진 출력해보기
```js
- 해당 코드 추가
const reader = new FileReader();
reader.onloadend = (finishedEvent) => {
    console.log(finishedEvent);
};
```
> 8. Home.js - 사진 미리보기 구현해보기
```js
- 해당 코드 추가
const [attachment, setAttachment] = useState("");

const {
    currentTarget: { result },
} = finishedEvent;
setAttachment(result);

{attachment && <img src={attachment} width="50px" height="50px" />}
```
> 9. Home.js - 파일 선택 취소 버튼 만들기
```js
- 해당 코드 추가
const onClearAttachment = () => setAttachment("");

{attachment && (
    <diV>
        <img src={attachment} width="50px" height="50px" />
        <button onClick={onClearAttachment}>Clear</button>
    </diV>
)}
```
## [05월 18일]
> 1. Home.js - 트윗 목록 출력해보기
```js
- 해당 코드 추가
- 배열을 순회하는 map 함수
        <>
        <div>
            {nweets.map((nweet) => (
                <div key={nweet.id}>
                    <h4>{nweet.text}</h4>
                </div>    
            ))}
        </div>
        </>
```
> 2. 작성자 표시하기
- [관련 코드](https://github.com/hyeongjuSung/nwitter/commit/72e7125d5e646ce05bb8a87f4c919b070f32f3f1)
> 3. getNweets 함수 삭제하기
```js
- 해당 코드 삭제
const getNweets = async () => {
        const dbNweets = await dbService.collection("nweets").get();

        dbNweets.forEach((document) => {
            const nweetObject = { ...document.data(), id: document.id };
            setNweets((prev) => [nweetObject, ...prev])
        });
};

getNweets();
```
> 4. Home.js - onSnapShot 함수 적용하기
```js
- 해당 코드 추가
useEffect(() => {
        dbService.collection("nweets").onSnapshot((snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setNweets(newArray);
        });    
    }, []);
```
> 5. 트윗 컴포넌트 분리하기
```js
- /components/Nweet.js 생성
- 해당 코드 추가
const Nweet = ({ nweetObj }) => {
    return (
        <div>
            <h4>{nweetObj.text}</h4>
        </div>
    );
};

export default Nweet;

- Home.js 수정
- 해당 코드 추가
import Nweet from "components/Nweet";
-해당 코드 수정
{nweets.map((nweet) => (
    <Nweet key={nweet.id} nweetObj={nweet}/>    
))}
```
> 6. Nweet.js - 수정, 삭제 버튼 추가하기
```js
<button>Delete Nweet</button>
<button>Edit Nweet</button>
```
> 7. 본인이 쓴 트윗만 관리하기
```js
- Home.js 수정
- 헤당 코드 추가
isOwner={nweet.creatorId === userObj.uid}

- Nweet.js 수정
- 헤당 코드 수정
{isOwner && (
    <>
        <button>Delete Nweet</button>
        <button>Edit Nweet</button>
    </>
)}
```
> 8. Nweet.js - 버튼에 삭제 기능 추가하기
```js
- 해당 코드 추가
const oneDeleteClick = () => {
    const ok = window.confirm("삭제하시겠습니까?");
    console.log(ok);
}
<button onClick={oneDeleteClick}>Delete Nweet</button>

import { dbService } from "fbase";
if (ok) {
            console.log(nweetObj.id);
            const data = await dbService.doc(`nweets/${nweetObj.id}`).delete();
            console.log(data);
        }  
```
## [05월 11일]
> 1. 샘플 데이터 저장해보기
- Cloud Firestore 탭
- 컬렉션 시작
- 컬렉션 ID: nwitter
- 자동 ID, 필드, 유형, 값 입력 후 저장
> 2. fbase.js - 리액트에서 파이어베이스 데이터배아스 사용하기
```js
- 해당 코드 추가
import "firebase/firestore";

export const dbService = firebase.firestore();
```
> * 오류 해결
```js 
- 위 코드 추가 후 페이지 동작안되는 현상

- 해결방법: import문 수정
import "firebase/compat/firestore";
```
> 3. Home.js - 파이어스토어에 데이터 저장하기: Create
```js
- 해당 코드 추가
import { dbService } from "fbase";

const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now(),
        });
        setNweet("");
    };
```
> 4. Home.js - 파이어스토어에서 문서 읽어오기: Read
```js
- 해당 코드 추가
import { useEffect, useState } from "react"

const getNweets = async () => {
        const dbNweets = await dbService.collection("nweets").get();
        console.log(dbNweets);
    };

    useEffect(() => {
        getNweets();
    }, []);
```
> 5. Home.js - 스냅샷 확인하기
```js
- 해당 코드 삭제
console.log(dbNweets);
- 해당 코드 수정
dbNweets.forEach((document) => console.log(document.data()));
```
> 6. Home.js - 받은 데이터로 게시물 목록 만들기
```js
- 해당 코드 수정
const [nweets, setNweets] = useState([]);

 dbNweets.forEach((document) => 
            setNweets((prev) => [document.data(), ...prev])
        );
```
> 7. Home.js - 트윗 아이디 저장하기
```js
- 해당 코드 수정
 dbNweets.forEach((document) => {
            const nweetObject = { ...document.data(), id: document.id };
            setNweets((prev) => [nweetObject, ...prev])
        });
```
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
- 해당 코드 수정
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
- 해당 코드 추가
import { HashRouter as Router, Redirect, Route, Switch } from "react-router-dom";

<Redirect from="*" to="/" />
```
> 9. Router.js - useHistory로 로그아웃
```js
- 해당 코드 삭제
import {  Redirect } from "react-router-dom";

<Redirect from="*" to="/" />
```
> 10. Profile.js - useHistory로 로그아웃 후 주소 이동하기
```js
- 해당 코드 추가
import { useHistory } from "react-router-dom";

const history = useHistory();

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };
```
> 11. Home.js - 트윗을 위한 폼 만들기
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
> 12. 트윗을 위한 파이어베이스 데이터베이스 생성하기
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