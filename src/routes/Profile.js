import { authService, dbService } from "fbase"
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj, refreshUser }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.newDisplayName);

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({ displayName: newDisplayName});
            refreshUser();
        }
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} type="text" placeholder="Display name" value={newDisplayName}/>
                <input type="submit" placeholder="Update Profile"/>
            </form>
            <button onClick={onLogOutClick}>Log out</button>
        </>
    );
};

export default Profile