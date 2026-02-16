import { FC, useEffect, useState } from 'react';

import { TimerInterface } from './Timer.interface';

export const Timer: FC<TimerInterface> = ({
  date,
  setIsExpired,
  className = '',
  labelClassName = 'f-20-24-400-tertiary',
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const target = new Date(date);

    const updateTimer = (): void => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeRemaining(0);
        setIsExpired(true);

        return;
      }

      setTimeRemaining(difference);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [date, setIsExpired]);

  const totalHours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, '0');
  const hours = totalHours.toString().padStart(2, '0');

  return (
    <div className={`flex gap-6 ${className}`}>
      {[
        { value: hours, label: 'Hours' },
        { value: minutes, label: 'Minutes' },
        { value: seconds, label: 'Seconds' },
      ].map((item, index, arr) => (
        <span key={index}>
          {item.value}
          {index < arr.length - 1 && <span className="p-4">:</span>}
          <br />
          <span className={labelClassName}>{item.label}</span>
        </span>
      ))}
    </div>
  );
};
