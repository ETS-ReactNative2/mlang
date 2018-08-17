import React from 'react';
import UI from 'components/UI';
import Badge from 'components/main/items/Badge';

import icon_alert2 from 'resources/images/icons/alert2.png';

class Cell extends UI {

  constructor(props){
    super(props);
    this.init(props);
    this.state = {
      url: null
    }
    this.initCell(props);
  }

  initCell(props){
    this.data = props.data;
    this.type = props.type;
    this.getIconUrl(this.type);
  }

  componentWillReceiveProps(newProps){
    this.init(newProps);
    this.initCell(newProps);
  }

  async getIconUrl(type){
    const fileType =
    type === 'course'? 'courseIcon':
    type === 'project'? 'projectIcon':
    type === 'card'? 'cardIcon':
    '';

    const url = await this.func.url(this.data.icon, fileType);
    if(!this.unmounted && url){
      //console.log('set image url ' + url);
      this.setState({ url: url })
    }
  }

  cellImage(){
    const imageStyle = {...this.ui.styles.container, ...this.ui.styles.border, ...{
      maxWidth: this.scale[0] * 0.8,
      maxHeight: this.scale[0] * 0.8,
      marginTop: '4%'
    }};
    //console.log(url)
    return <img style={imageStyle} src={this.state.url} alt=''/>
  }

  cellTitle(type){
    var text = '';
    if(type === 'course' || type === 'project'){
      text = this.data.title;
    }
    if(type === 'card'){
      const firstLang = this.func.getLangById(this.data.langs[0]);
      text = firstLang !== null? firstLang.text: '';
    }

    const scale =['100%','100%'];

    return(
      <div style={{flexGrow: 1, overflow: 'hidden'}}>
        {this.textDisplay(text, scale, this.bs.width * 0.03)}
      </div>
    )
  }

  checkAlertTag(){
    if(this.data.teacherAlert && this.store.user.type === 'teacher'){
      return this.alertTag();
    }else if(this.type === 'project' && this.store.user.type === 'student'){
      const studentProject = this.func.getStudentProject(this.store.user._id, this.data._id);
      if(studentProject && studentProject.studentAlert){
        return this.alertTag();
      }
    }
    return null;
  }

  alertTag(){
    const style = {
      position: 'absolute',
      top: this.bs.width * -0.015,
      right: this.bs.width * -0.015,
      width: this.bs.width * 0.05,
      height: this.bs.width * 0.05
    }
    return <img style={style} src={icon_alert2} alt=''/>
  }

  render(){
    this.init(this.props);
    //console.log(data)
    if(this.data === null){
      return null;
    }

    this.scale =
    this.type === 'course'? [this.bs.width * 0.26,this.bs.width * 0.26]:
    this.type === 'project'? [this.bs.width * 0.22,this.bs.width * 0.24]:
    this.type === 'card'? [this.bs.width * 0.25, this.bs.width * 0.35]:
    '';

    const cellStyle = {...this.ui.styles.button, ...this.ui.styles.border, ...{
      width: this.scale[0],
      height: this.scale[1],
      margin: '1.5%',
      backgroundColor: 'white',
      flexShrink: 0,
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'center',
      position: 'relative'
    }}
    const badgeScale = [this.bs.width * 0.125, this.bs.width * 0.125]

    return(
      <button style={cellStyle} onClick={this.props.onClick}>
        {this.type === 'card' && <Badge app={this.app} grade={this.data.grade} scale={badgeScale} />}
        {this.cellImage()}
        {this.cellTitle(this.type)}
        {this.checkAlertTag()}
      </button>
    )
  }

  getAppend(type){
    const append =
    type === 'course'? 'courseIcon':
    type === 'project'? 'projectIcon':
    type === 'card'? 'cardIcon':
    '';
    return append;
  }

}

export default Cell;
