import { fireEvent, render, screen } from '@testing-library/react';
import AudioPlayButton from './AudioPlayButton';

describe('AudioPlayButton offsets', () => {
  it('seeks to a manually configured offset before playing', () => {
    render(<AudioPlayButton src="/dua.mp3" label="Play dua" startOffsetSeconds={12.5} />);
    const audio = document.querySelector('audio') as HTMLAudioElement;
    const play = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(audio, 'readyState', { value: 0, configurable: true });
    Object.defineProperty(audio, 'load', { value: jest.fn(), configurable: true });
    Object.defineProperty(audio, 'play', { value: play, configurable: true });

    fireEvent.click(screen.getByRole('button', { name: 'Play dua' }));
    fireEvent.loadedMetadata(audio);

    expect(audio.currentTime).toBe(12.5);
    expect(play).toHaveBeenCalledTimes(1);
  });

  it('keeps zero-offset audio at its normal starting position', () => {
    render(<AudioPlayButton src="/dua.mp3" label="Play dua" />);
    const audio = document.querySelector('audio') as HTMLAudioElement;
    const play = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(audio, 'readyState', { value: 0, configurable: true });
    Object.defineProperty(audio, 'load', { value: jest.fn(), configurable: true });
    Object.defineProperty(audio, 'play', { value: play, configurable: true });

    fireEvent.click(screen.getByRole('button', { name: 'Play dua' }));
    fireEvent.loadedMetadata(audio);

    expect(audio.currentTime).toBe(0);
    expect(play).toHaveBeenCalledTimes(1);
  });
});
