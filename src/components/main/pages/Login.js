import React from 'react';
import UI from 'components/UI';

import CustomButton from 'components/main/items/ui/CustomButton';
import icon from 'resources/images/icons/mlang_green.png';

class Login extends UI {

  constructor(props){
    super(props);
    this.init(this.props);
    this.state = {
      loginInfo: null,
      autoLogin: false
    }
    this.getLoginInfo();
  }

  async getLoginInfo(){
    const loginInfo = await this.db.get('loginInfo');
    const language = await this.db.get('language');
    const autoLogin = await this.db.get('autoLogin');
    this.setState({
      loginInfo: loginInfo,
      autoLogin: autoLogin
    });
    this.actions.main.setLanguage(language? language: 'chinese');
    if(autoLogin){
      this.login(loginInfo.id,loginInfo.pw);
    }
  }

  icon(){
    const iconStyle = {
      width: this.bs.height * 0.4,
      height: this.bs.height * 0.15,
      backgroundImage: 'url(' + icon + ')',
      backgroundSize: '100% 100%',
      flexShrink: 0
    }
    return <div style={iconStyle}/>
  }

  autoLoginCheckbox(){
    const style = {...this.ui.styles.container,...this.ui.styles.area,...{
      width: this.bs.width,
      height: this.bs.height * 0.035,
      color: 'white',
      fontSize: this.bs.height * 0.02,
    }}
    const checkBoxStyle = {
      width: this.bs.height * 0.025,
      height: this.bs.height * 0.025
    }
    return(
      <div style={style}>
        {this.func.multiLang('Keep me logged in on this devices','在此裝置上保持登入','在此装置上保持登入')}
        <input style={checkBoxStyle} type='checkbox' name='keepMeLogged' checked={this.state.autoLogin} onChange={(e)=>{this.onChecked(e)}}/>
      </div>
    )
  }

  onChecked(e){
  //  console.log(e.target.checked)
    this.db.set('autoLogin', e.target.checked);
    this.setState({
      autoLogin: e.target.checked
    })
  }

  languageBar(){
    const lang = this.store.main.language;

    const barStyle = {
      width: '67%',
      height: '5%',
      marginTop: '10%',
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'center'
    }
    const buttonStyle = {
      flexGrow: 1,
      border: 'none',
      backgroundColor: 'transparent',
      color: 'grey',
      cursor: 'pointer',
      fontWeight: 'normal'
    }

    const simplifiedchineseStyle = {...buttonStyle, ...{color: lang === 'simplified_chinese'? 'white': 'grey'}};
    const chineseStyle = {...buttonStyle, ...{color: lang === 'chinese'? 'white': 'grey'}};
    const englishStyle = {...buttonStyle, ...{color: lang === 'english'? 'white': 'grey'}};

    return(
      <div style={barStyle}>
        {this.buttons.button(simplifiedchineseStyle, ['简体中文','简体中文','简体中文'], '', ()=>this.actions.main.setLanguage('simplified_chinese'))}
        {this.buttons.button(chineseStyle, ['繁體中文','繁體中文','繁體中文'], '', ()=>this.actions.main.setLanguage('chinese'))}
        {this.buttons.button(englishStyle, ['English','English','English'], '', ()=>this.actions.main.setLanguage('english'))}
      </div>
    )
  }

  versionCode(){
    const versionStyle = {
      width: '30%',
      height: '4%',
      marginTop: '5%',
      color: 'grey',
      textAlign: 'center',
      fontWeight: 'bold'
    }
    return <div style={versionStyle}>{this.props.app.store.main.version}</div>
  }

  login(id, pw){
    const _id = id? id:document.getElementById('id').value;
    const _pw = pw? pw:document.getElementById('pw').value;
    //if(_id.length < 5 || _pw.length < 5){ return; }
    this.props.app.actions.user.login(_id, _pw);
  }

  render() {
    this.init(this.props);
    const status = this.store.main.status;

    const pageStyle = {...this.bs, ...{ justifyContent: 'center' }};
    //const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    const loginInfo = this.func.isDev()? this.state.loginInfo: null;

    if(status === 'waitForLogin'){
      return(
        <div style={pageStyle}>
          {this.gap('5%')}
          {this.icon()}
          {this.inputs.inputField('id','text', ['Enter your identity','登入名稱','登入名称'], loginInfo? loginInfo.id:'')}
          {this.inputs.inputField('pw','password', ['Enter your password','密碼','密码'], loginInfo? loginInfo.pw:'')}
          {this.autoLoginCheckbox()}
          <CustomButton app={this.app} button={this.buttons.rectGreen(['Login','登入','登入'], ()=>this.login())}/>
          <CustomButton app={this.app} button={this.buttons.rectYellow(['Get new account','申請帳號','申请帐号'], ()=>this.actions.main.setStatus('getNewAccount'))}/>
          <CustomButton app={this.app} button={this.buttons.rectRed(['Forget password','忘記密碼','忘记密码'], ()=>this.actions.main.setStatus('forgotPassword'))}/>
          {this.languageBar()}
          {this.versionCode()}
          {this.gap('5%')}
        </div>
      )
    }else if(status === 'getNewAccount'){
      return(
        <div style={pageStyle}>
          {this.inputs.inputField('email','text', ['Enter your email address','輸入你的電郵地址','输入你的电邮地址'], '')}
          <CustomButton app={this.app} button={this.buttons.rectGreen(['Acquire new account','獲得新帳號','获得新帐号'], ()=>this.actions.user.getNewAccount(document.getElementById('email').value))}/>
          <CustomButton app={this.app} button={this.buttons.rectRed(['Cancel','取消','取消'], ()=>this.actions.main.setStatus('waitForLogin'))}/>
        </div>
      )
    }else if(status === 'forgotPassword'){
      return(
        <div style={pageStyle}>
          {this.inputs.inputField('email','text', ['Enter your email address','輸入你的電郵地址','输入你的电邮地址'], '')}
          <CustomButton app={this.app} button={this.buttons.rectGreen(['Reset password','重設密碼','重设密码'], ()=>this.actions.user.resetPassword(document.getElementById('email').value))}/>
          <CustomButton app={this.app} button={this.buttons.rectRed(['Cancel','取消','取消'], ()=>this.actions.main.setStatus('waitForLogin') )}/>
        </div>
      )
    }else{
      return null;
    }
  }

}

export default Login;
