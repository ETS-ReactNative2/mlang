import React from 'react';
import UI from 'components/UI';

class Modal extends UI {

  board(){
    const bs = this.props.app.store.ui.basicStyle;
    const boardStyle = {
      width: bs.width * 0.6,
      height:  bs.height * 0.3,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderRadius: '20px',
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'center'
    }
    return(
      <div style={boardStyle}>
        <div style={{height: '10%'}} />
        {this.message()}
        {this.buttonsArea()}
      </div>
    )
  }

  message(){
    const app = this.props.app;
    const modal = app.store.modal;
    const lang = app.store.main.language;
    const text = modal[lang];

    const messageStyle = {
      width: '85%',
      height: '55%',
      color: 'white',
      fontSize: '100%',
      fontWeight: 'bold',
      textAlign: 'center',
      justifyContent: 'center'
    }
    return <div style={messageStyle}>{text}</div>
  }

  buttonsArea(){
    const app = this.props.app;
    const button = app.store.modal.button;
    if(button === 'off'){
      return null;
    }

    const areaStyle = {
      width: '85%',
      height: '25%',
      backgroundColor: 'transparent',
      display: 'flex',
      flexFlow: 'row nowrap',
      justifyContent: 'center',
      alignItems: 'center'
    }
    return(
      <div style={areaStyle}>
        {this.buttons.modal(['Confirm','確定'], ()=>{app.actions.modal.hideModal()})}
      </div>
    )
  }

  render() {
    const app = this.props.app;
    const status = app.store.modal.status;
    if(status === 'off'){
      return null;
    }

    const ui = app.store.ui;
    const bs = ui.basicStyle;
    const modalStyle = {
      position: 'absolute',
      width: bs.width,
      height: bs.height,
      minHeight: bs.minHeight,
      backgroundColor: 'transparent',
      opacity: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
    return(
      <div style={modalStyle}>
        {this.board()}
      </div>
    )
  }

}

export default Modal;
