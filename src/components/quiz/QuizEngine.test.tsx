import { render, screen, fireEvent } from '@testing-library/react';
import QuizEngine from './QuizEngine';
import type { QuizQuestion } from 'types/quiz.types';

const DECK: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'What is 2 + 2?',
    options: ['3', '4', '5'],
    correctIndex: 1,
    category: 'math',
    difficulty: 'easy',
  },
  {
    id: 'q2',
    prompt: 'What color is the sky?',
    options: ['Green', 'Blue'],
    correctIndex: 1,
    category: 'science',
    difficulty: 'easy',
  },
];

describe('QuizEngine (generic)', () => {
  it('shows the first question and the question counter', () => {
    render(<QuizEngine questions={DECK} />);
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
  });

  it('accepts an answer once, then reveals correct/wrong styling and advances', () => {
    render(<QuizEngine questions={DECK} />);
    fireEvent.click(screen.getByRole('button', { name: /4 \(correct\)|4/ }));
    // Option buttons are disabled after answering (one attempt per question).
    expect(screen.getByRole('button', { name: /3/ })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByText('What color is the sky?')).toBeInTheDocument();
  });

  it('scores correctly and shows the results screen with onFinish payload', () => {
    const onFinish = jest.fn();
    render(<QuizEngine questions={DECK} onFinish={onFinish} />);

    fireEvent.click(screen.getByRole('button', { name: /4/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: /Blue/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }));

    expect(screen.getByText('You scored 2 of 2')).toBeInTheDocument();
    expect(onFinish).toHaveBeenCalledWith(
      expect.objectContaining({ total: 2, score: 2, percent: 100 }),
    );
  });

  it('reports missed questions in the result payload', () => {
    const onFinish = jest.fn();
    render(<QuizEngine questions={DECK} onFinish={onFinish} />);

    fireEvent.click(screen.getByRole('button', { name: /3/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: /Blue/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }));

    expect(onFinish).toHaveBeenCalledWith(
      expect.objectContaining({ score: 1, total: 2, percent: 50 }),
    );
  });

  it('ignores clicks before an answer is selected', () => {
    render(<QuizEngine questions={DECK} />);
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
  });

  it('restarts the deck from the results screen', () => {
    render(<QuizEngine questions={DECK} />);
    fireEvent.click(screen.getByRole('button', { name: /4/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: /Blue/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }));
    fireEvent.click(screen.getByRole('button', { name: 'Play again' }));

    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
  });

  it('renders an empty state for an empty deck instead of crashing', () => {
    render(<QuizEngine questions={[]} />);
    expect(screen.getByText('Question 0 of 0')).toBeInTheDocument();
  });

  it('supports custom labels', () => {
    render(
      <QuizEngine
        questions={DECK}
        labels={{
          questionCounter: (current, total) => `${current}/${total}`,
          next: 'Nächste',
          finish: 'Fertig',
          scoreLabel: (score, total) => `Ergebnis: ${score}/${total}`,
          playAgain: 'Nochmal',
        }}
      />,
    );
    expect(screen.getByText('1/2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /4/ }));
    expect(screen.getByRole('button', { name: 'Nächste' })).toBeInTheDocument();
  });
});

describe('QuizEngine phases 9 & 12 wiring', () => {
  it('fires onAnswer once per selection with the verdict', () => {
    const onAnswer = jest.fn();
    render(<QuizEngine questions={DECK} onAnswer={onAnswer} />);

    fireEvent.click(screen.getByRole('button', { name: /4/ }));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(
      expect.objectContaining({ questionId: 'q1', selectedIndex: 1, correct: true }),
      true,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(screen.getByRole('button', { name: /Green/ }));
    expect(onAnswer).toHaveBeenCalledTimes(2);
    expect(onAnswer.mock.calls[1][1]).toBe(false);
  });

  it('does not re-fire onAnswer when clicking again after answering', () => {
    const onAnswer = jest.fn();
    render(<QuizEngine questions={DECK} onAnswer={onAnswer} />);

    fireEvent.click(screen.getByRole('button', { name: /4/ }));
    fireEvent.click(screen.getByRole('button', { name: /4/ }));
    expect(onAnswer).toHaveBeenCalledTimes(1);
  });

  it('renders speaker buttons when onReadAloud is provided and delegates the text', () => {
    const onReadAloud = jest.fn();
    render(<QuizEngine questions={DECK} onReadAloud={onReadAloud} />);

    fireEvent.click(screen.getByRole('button', { name: 'Hear: What is 2 + 2?' }));
    expect(onReadAloud).toHaveBeenCalledWith('What is 2 + 2?');

    fireEvent.click(screen.getByRole('button', { name: 'Hear: 4' }));
    expect(onReadAloud).toHaveBeenCalledWith('4');
  });

  it('hides speaker buttons when onReadAloud is omitted', () => {
    render(<QuizEngine questions={DECK} />);
    expect(screen.queryByRole('button', { name: /^Hear:/ })).not.toBeInTheDocument();
  });
});
