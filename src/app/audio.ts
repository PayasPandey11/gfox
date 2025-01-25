export const playAudio = (audioSrc: string,modelRef:any, action?: () => void) => {
    if (!modelRef.current) return;

    const audio = new Audio(audioSrc);


    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const audioSource = audioContext.createMediaElementSource(audio);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const animateLipSync = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      
      if (modelRef.current) {
        modelRef.current.internalModel.coreModel.setParameterValueById(
          'ParamMouthOpenY', 
          average / 128
        );
      }

      if (!audio.ended) {
        requestAnimationFrame(animateLipSync);
      } else {
        modelRef.current?.internalModel.coreModel.setParameterValueById('ParamMouthOpenY', 0);

      }
    };

    audio.play();
    action?.();
    animateLipSync();
  };