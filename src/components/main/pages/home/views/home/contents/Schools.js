import React from 'react';
import Content from './Content';

import Cell from 'components/main/items/Cell';

class Schools extends Content {

  componentDidMount(){
    this.init(this.props);
    this.setData();
    if(this.schoolsData.length === 0 && !this.store.content.hide.schools){
      this.actions.content.setHide('schools', true);
      this.setHint();
    }
  }

  setHint(){
    const toShow = this.store.profile.joinedCourses.length === 0;
    if(toShow){
      this.actions.content.pushHint({type:'schools'});
    }
  }

  setData(){
    this.schools =
    this.store.user.type === 'admin'? this.store.schools.supervisingSchools:
    this.store.user.type === 'teacher'? this.store.profile.joinedSchools:
    this.store.user.type === 'student'? this.store.profile.joinedSchools:
    [];

    this.schoolsData = [];
    this.schools.map(id=>{
      return this.schoolsData.push(this.func.getSchoolById(id));
    })
  }

  content = style =>(
    <div style={{...this.areaStyle(), ...{ height: style.height, opacity: style.opacity}}}>
      {this.verGap('2%')}
      {this.schoolCells()}
      {this.verGap('5%')}
      {this.schoolsData.length === 0 && this.buttons.cellAdd(this.onAdd)}
      {this.verGap('5%')}
    </div>
  )

  schoolCells(){
    this.setData();
    return this.schoolsData.map((school, i)=>{
      return(
        <Cell key={i} app={this.app}
        type={'school'}
        data={school}
        onClick={()=>{ this.actions.schools.viewSchool(school); this.actions.content.pushView('school'); }}/>
      )
    });
  }

  render() {
    this.init(this.props);
    //this.isInit = this.store.content.hide.schools === 'init';
    const hide = this.store.content.hide.schools;
    //const type = this.store.user.type;
    const title =
    this.store.user.type === 'admin'? ['Schools - created','學校 - 已創建','学校 - 已创建']:
    ['Schools - joined','學校 - 已加入','学校 - 已加入'];

    const containerStyle = {
      width: '100%',
      height: '',
      background: this.ui.colors.gradientBasic
    }

    this.onAdd =
    this.store.user.type === 'admin'? ()=>{this.actions.content.pushView('addSchool')}:
    this.store.user.type === 'teacher'? ()=>{this.actions.content.pushView('joinSchool')}:
    this.store.user.type === 'student'? ()=>{this.actions.content.pushView('joinSchool')}:
    ()=>{};

    return(
      <div style={containerStyle}>
        {this.tabBar(title, hide, ()=>{this.actions.content.toggleHide('schools')})}
        {this.animatedContent('schools', this.content.bind(this), !hide, this.bs.height * 0.27)}
      </div>
    )
  }
}

export default Schools;
