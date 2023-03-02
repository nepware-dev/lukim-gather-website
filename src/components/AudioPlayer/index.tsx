import React, {useEffect} from 'react';
import {HiPause, HiPlay} from 'react-icons/hi';

import useToggle from '@ra/hooks/useToggle';

import classes from './styles';

const AudioPlayer = ({file} : {file?: any}) => {
  const [isPlaying, setPlaying] = useToggle();

  useEffect(() => {
    const audio = document.getElementById('audio') as any;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
    audio.onended = () => setPlaying(false);
  }, [isPlaying, setPlaying]);

  useEffect(() => {
    if (typeof file !== 'string') {
      const audioTag = document.getElementById('audio') as any;
      const dt = URL.createObjectURL(file);
      audioTag.src = dt;
    }
  }, [file]);

  return (
    <div>
      <audio id='audio' src={file}>
        <track kind='captions' />
      </audio>
      <div className={classes.audioPlayer} onClick={setPlaying}>
        {isPlaying ? <HiPause size={40} color='#EC6D25' /> : <HiPlay size={40} color='#0A52A1' />}
        <p className={classes.audioTitle}>{file?.name || file?.substring(file.lastIndexOf('/') + 1)}</p>
      </div>
    </div>
  );
};

export default AudioPlayer;
