import axios from 'axios';
import * as actions from '../actions';
var api = process.env.REACT_APP_API;


export function getStudentProfiles(students){
  //console.log(students)
  return function (dispatch) {
    //actions.connecting(dispatch);
    axios.post(api + '/profile/getMultiple', { data: students })
    .then(res=>{
      if(res.data.result === 'success'){
        dispatch({type: "updateStudents", payload: res.data.profiles});
      }else{
        dispatch({type: "showModalButton"});
        dispatch({type: "message", payload: ['Failed to get students data!', '無法查閱學生資料!']});
      }
    }).catch(err=>{
      actions.connectionError(dispatch);
    })
  }

}
