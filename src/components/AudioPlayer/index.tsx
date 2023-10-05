import React, {useEffect, useMemo} from 'react';
import {HiPause, HiPlay} from 'react-icons/hi';

import useToggle from '@ra/hooks/useToggle';

import classes from './styles';

const AudioPlayer = ({file} : {file?: File | string}) => {
  const [isPlaying, setPlaying] = useToggle();

  useEffect(() => {
    const audio = document.getElementById('audio') as HTMLAudioElement;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
    audio.onended = () => setPlaying(false);
  }, [isPlaying, setPlaying]);

  useEffect(() => {
    const audioTag = document.getElementById('audio') as HTMLAudioElement;
    if (typeof file !== 'string') {
      const dt = URL.createObjectURL(file as File);
      audioTag.src = dt;
    } else {
      audioTag.src = file;
    }
  }, [file]);

  const fileName = useMemo(() => (
    typeof file !== 'string' ? file?.name : (file as string)?.substring((file as string).lastIndexOf('/') + 1)
  ), [file]);

  return (
    <div>
      <audio id='audio'>
        <track kind='captions' />
      </audio>
      <div className={classes.audioPlayer} onClick={setPlaying}>
        {isPlaying ? <HiPause size={40} color='#EC6D25' /> : <HiPlay size={40} color='#0A52A1' />}
        <p className={classes.audioTitle}>{fileName?.substring(0, 25)}</p>
      </div>
    </div>
  );
};

export default AudioPlayer;
