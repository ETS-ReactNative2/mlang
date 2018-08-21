import axios from 'axios';
import * as actions from '../actions';
import to from '../to';
var api = process.env.REACT_APP_API;

export const viewCourse = (course) =>{
  return {
    type: 'viewCourse',
    payload: course
  }
}

export function joinCourse(_data){

  return async function (dispatch) {
    actions.connecting(dispatch);

    let err, res;
    [err, res] = await to(axios.post(api + '/course/join', { data: _data }));
    if(err){actions.connectionError(dispatch); return;}


    if(res.data.result === 'success'){
      dispatch({type: "message", payload: ['Join course succeed!', '成功加入班別!']});
      dispatch({type: "updateCourses", payload: [res.data.joinedCourse]});
      dispatch({type: "updateJoinedCourses", payload: [res.data.joinedCourse._id]});
      dispatch({type: "setProfile", payload: res.data.updatedProfile});
      dispatch({type: "backToHome"});
    } else {
      dispatch({type: "message", payload: ['Join course failed! Please make sure to enter a correct code!',  '加入失敗! 請確定代碼輸入正確!']});
    }
  }
}

export function editCourse(editedCourse){
  return async function (dispatch) {
    actions.connecting(dispatch);

    let err, uploadRes, updateRes;

    if(editedCourse.newIcon){
      var iconFile = new FormData();
      iconFile.append('files', editedCourse.newIcon, 'courseIcon.png');
      [err, uploadRes] = await to(axios.post(api + '/upload', iconFile, { headers: { type: 'courseIcon'}}))
      if(err){actions.connectionError(dispatch); return;}

      editedCourse['icon'] = uploadRes.data.filenames[0];
    }

    [err, updateRes] = await to(axios.post(api + '/course/edit', {data: editedCourse}));
    if(err){actions.connectionError(dispatch); return;}


    if(updateRes.data.result === 'success'){
      dispatch({type: "message", payload: ['Edit course succeed!', '成功修改班別!']});
      dispatch({type: "updateCourses", payload: [updateRes.data.editedCourse]});
      dispatch({type: "viewCourse", payload: updateRes.data.editedCourse});
      dispatch({type: "pullView"});
    }else{
      dispatch({type: "message", payload: ['Edit course failed! Please try again!',  '修改失敗! 請再試一次!']});
    }
  }
}

export function addCourse(newCourse){
  //console.log(newCourse)
  return async function (dispatch) {
    actions.connecting(dispatch);

    let err, uploadRes, addRes;

    var iconFile = new FormData();
    iconFile.append('files', newCourse.icon, 'courseIcon.png');

    [err, uploadRes] = await to(axios.post(api + '/upload', iconFile, { headers: { type: 'courseIcon'}}));
    if(err){ actions.connectionError(dispatch); return; }

    if(uploadRes.data.result !== 'success'){
      actions.connectionError(dispatch);
      return;
    }

    newCourse['icon'] = uploadRes.data.filenames[0];

    [err, addRes] = await to(axios.post(api + '/course/add', { data: newCourse }));
    if(err){ actions.connectionError(dispatch); return; }


    if(addRes.data.result === 'success'){
      dispatch({type: "message", payload: ['Add course succeed!', '成功創建班別!']});
      dispatch({type: "updateCourses", payload: [addRes.data.newCourse]});
      dispatch({type: "updateTeachingCourses", payload: [addRes.data.newCourse._id]});
      dispatch({type: "backToHome"});
      //dispatch({type: "setPhoto", payload: {blob: null, url: null}});
    }else{
      dispatch({type: "message", payload: ['Add course failed! Please try again!', '創建失敗! 請再試一次!']});
    }

  }
}
