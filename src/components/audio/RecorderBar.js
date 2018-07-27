import React from 'react';
import UI from 'components/UI';
import WAVEInterface from 'components/audio/waveInterface';

import icon_recorder from 'resources/images/buttons/buttonIcons/recorder_black.png';
import icon_play from 'resources/images/buttons/buttonIcons/play_black.png';
import icon_stop from 'resources/images/buttons/buttonIcons/stop_black.png';
import icon_cross from 'resources/images/buttons/buttonIcons/cross_black.png';


class RecorderBar extends UI {
  waveInterface = new WAVEInterface();

  componentWillMount() { this.waveInterface.reset(); }
  componentWillUnmount() { this.waveInterface.reset(); }

  constructor(props){
    super(props);
    this.state = {
      audioPlaying: false
    }
  }

  record(){
    const actions = this.props.app.actions;
    this.waveInterface.reset();

    this.waveInterface.startRecording()
    .then(() => {
      actions.main.setAudioRecorder({recording: true, onRecordStop: ()=>{this.stopRecord()}});
    })
    .catch((err) => {
      actions.modal.errorMessage([err.message, err.message]);
      throw err;
    })
  }

  stopRecord(){
    const actions = this.props.app.actions;
    this.waveInterface.stopRecording()
    actions.main.setAudioRecorder({recording: false, onRecordStop: null});

    const blob = this.waveInterface.audioData;
    this.props.onStopRecording(blob);
  }

  playback(){
    if(this.state.audioPlaying || !this.props.audioBlob){ return; }
    this.waveInterface.startPlayback(false, this.props.audioBlob, ()=>{this.onPlaybackEnd()})
    .then(()=>{
      this.setState({ audioPlaying: true })
    })
  }

  onPlaybackEnd(){
    this.setState({ audioPlaying: false })
  }

  stopPlayback(){
    if(!this.state.audioPlaying){ return; }
    this.waveInterface.stopPlayback();
    this.setState({ audioPlaying: false })
  }

  langBar(i){
    const app = this.props.app;
    const ui = app.store.ui;
    const bs = ui.basicStyle;

    const barStyle = {...ui.styles.area, ...{
      width: this.props.scale[0],
      height: this.props.scale[1],
      alignItems: 'center'
    }}

    const sizeSmall = [bs.width * 0.05,bs.width * 0.05];
    const sizeBig = [bs.width * 0.06,bs.width * 0.06];

    const audioBlob = this.props.audioBlob;
    const isPlaying = this.state.audioPlaying

    return(
      <div style={barStyle}>
        {this.verGap('15%')}
        {this.buttons.langBar(icon_recorder, audioBlob? 0.7: 0.15, sizeBig, ()=>{this.record(i)})}
        {this.verGap('15%')}
        {this.buttons.langBar(icon_play , (audioBlob && !isPlaying)? 0.7:0.15, sizeSmall,()=>{this.playback(i)})}
        {this.verGap('15%')}
        {this.buttons.langBar(icon_stop, (audioBlob && isPlaying)? 0.7:0.15, sizeBig,()=>{this.stopPlayback(i)})}
        {this.verGap('15%')}
        {this.props.canRemove && this.buttons.langBar(icon_cross, audioBlob? 0.7:0.15, sizeBig,()=>{this.props.onStopRecording(null)})}
      </div>
    )
  }

  render() {
    return this.langBar(this.props.index);
  }

}

export default RecorderBar;
