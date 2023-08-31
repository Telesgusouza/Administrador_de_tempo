
const initialValue = {
    currentUser: "Gustavoo"
}

const userData = (state = initialValue, action) => {
    if (action.type === "SETDATA") {
        return {...state, currentUser: "mudou"}
    }

    return state;
}

export default userData;