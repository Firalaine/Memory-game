// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { clearResults, setPlayerName } from '../gameSlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import styles from './Home.module.css';

interface FormData {
  playerName: string;
}

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { results } = useSelector((state: RootState) => state.game);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      playerName: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    dispatch(setPlayerName(data.playerName || 'Гість'));
    navigate('/game');
  };

  return (
    <div className={styles.home}>
      <h1 className={styles.title}>Ласкаво просимо до гри в пам’ять! 🧠</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.playerForm}>
        <label htmlFor="playerName" className={styles.label}>
          Введіть ваше ім’я:
        </label>
        <input
          id="playerName"
          {...register('playerName', {
            required: 'Ім’я обов’язкове',
            minLength: {
              value: 2,
              message: 'Ім’я має містити щонайменше 2 символи',
            },
            maxLength: {
              value: 20,
              message: 'Ім’я не може перевищувати 20 символів',
            },
          })}
          type="text"
          placeholder="Ваше ім’я"
          className={styles.input}
        />
        {errors.playerName && <p className={styles.error}>{errors.playerName.message}</p>}
        <button type="submit" className={styles.button}>
          Почати гру
        </button>
      </form>
      <h2 className={styles.subtitle}>Результати попередніх ігор</h2>
      {results.length === 0 ? (
        <p className={styles.info}>Ще немає результатів. Зіграйте, щоб побачити статистику!</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Номер гри</th>
                <th>Гравець</th>
                <th>Ходи</th>
                <th>Час (с)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.gameNumber}>
                  <td>{result.gameNumber}</td>
                  <td>{result.playerName || 'Гість'}</td>
                  <td>{result.moves}</td>
                  <td>{result.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => dispatch(clearResults())} className={styles.button}>
            Очистити результати
          </button>
        </>
      )}
    </div>
  );
}