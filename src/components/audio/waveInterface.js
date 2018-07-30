import encodeWAV from './waveEncoder';

export default class WAVEInterface {
  static audioContext = new AudioContext();
  static bufferSize = 2048;

  playbackNode: AudioBufferSourceNode;
  recordingNodes: AudioNode[] = [];
  recordingStream: MediaStream;
  buffers: Float32Array[][];
  encodingCache: Blob;

  get bufferLength() { return this.buffers[0].length * WAVEInterface.bufferSize; }
  get audioDuration() { return this.bufferLength / WAVEInterface.audioContext.sampleRate; }
  get audioData() {
    return this.encodingCache || this.encode(this.buffers);
  }

  encode(buffers){
    return encodeWAV(buffers, this.bufferLength, WAVEInterface.audioContext.sampleRate);
  }

  startRecording() {

    return new Promise((resolve, reject) => {
      navigator.getUserMedia({ audio: true }, (stream) => {
        const { audioContext } = WAVEInterface;
        const recGainNode = audioContext.createGain();
        const recSourceNode = audioContext.createMediaStreamSource(stream);
        const recProcessingNode = audioContext.createScriptProcessor(WAVEInterface.bufferSize, 2, 2);
        if (this.encodingCache) this.encodingCache = null;

        recProcessingNode.onaudioprocess = (event) => {
          if (this.encodingCache) this.encodingCache = null;
          // save left and right buffers
          for (let i = 0; i < 2; i++) {
            const channel = event.inputBuffer.getChannelData(i);
            this.buffers[i].push(new Float32Array(channel));
          }
        };

        recSourceNode.connect(recGainNode);
        recGainNode.connect(recProcessingNode);
        recProcessingNode.connect(audioContext.destination);

        this.recordingStream = stream;
        this.recordingNodes.push(recSourceNode, recGainNode, recProcessingNode);
        resolve(stream);
      }, (err) => {
        reject(err);
      });
    });
  }

  stopRecording() {
    if (this.recordingStream) {
      this.recordingStream.getTracks()[0].stop();
      delete this.recordingStream;
    }
    for (let i in this.recordingNodes) {
      this.recordingNodes[i].disconnect();
      delete this.recordingNodes[i];
    }
  }

  startPlayback(loop: boolean = false, audioData, onended: () => void) {
    return new Promise((resolve, reject) => {
      if(audioData instanceof Blob){
        const reader = new FileReader();
        reader.readAsArrayBuffer(audioData);
        reader.onloadend = () => {
          resolve(this.decodeAudioData(reader.result, loop, onended, audioData))
        };
      }else{
        this.decodeAudioData(audioData.slice(0), loop, onended)
      }
    }).catch(err=>{
      console.log(err);
    });
  }

  decodeAudioData(arrayBuffer, loop, onended){
    WAVEInterface.audioContext.decodeAudioData(arrayBuffer, (buffer) => {
      const source = WAVEInterface.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(WAVEInterface.audioContext.destination);
      source.loop = loop;
      source.start(0);
      source.onended = onended;
      this.playbackNode = source;
      return source;
    }).catch(err=>{
      console.log(err);
    });
  }

  stopPlayback() {
    this.playbackNode.stop();
  }

  reset() {
    if (this.playbackNode) {
      this.playbackNode.stop();
      this.playbackNode.disconnect(0);
      delete this.playbackNode;
    }
    this.stopRecording();
    this.buffers = [[], []];
  }
}
