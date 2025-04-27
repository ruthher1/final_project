const initialValue={
    id: localStorage.getItem('id') || null


}

const reducer=(state=initialValue,action)=>{
switch (action.type) {
    case "fill":
        localStorage.setItem('id', action.payload);
        return {id:action.payload}
        break;
    case "clear":
        localStorage.removeItem('id')
        return {id:null}
        break;
    default:
        return state
}
}
export default reducer