import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Loading } from 'src/components/Loading/Loading';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import { userAtom } from '../../atoms/user';
import { BasicHeader } from '../@components/BasicHeader/BasicHeader';
import styles from './othello.module.css';

const Home = () => {
  const [user] = useAtom(userAtom);
  const [count, setCount] = useState<number[]>();
  const turns = ['', '黒のターン', '白のターン', 'ゲーム終了'];
  const [board, setboard] = useState<number[][]>();
  const [turn, setTurn] = useState<number>();
  const fetchBoard = async () => {
    const board = await apiClient.board.$get().catch(returnNull);

    if (board !== null) setboard(board.board);
  };

  const fetchArounds = async () => {
    const count = await apiClient.board.$get().catch(returnNull);
    const turn = await apiClient.board.$get().catch(returnNull);
    if (count !== null) setCount(count.count);
    if (turn !== null) setTurn(turn.turn);
  };

  const clickCell = async (x: number, y: number) => {
    await apiClient.board.$post({ body: { x, y } });
    await fetchBoard();
  };

  useEffect(() => {
    const cancellid = setInterval(fetchBoard, 500);
    return () => {
      clearInterval(cancellid);
    };
  }, []);

  useEffect(() => {
    const cancelId = setInterval(fetchArounds, 500);
    return () => {
      clearInterval(cancelId);
    };
  }, []);
  if (!user || !board || !count || !turn) return <Loading visible />;

  return (
    <>
      <BasicHeader user={user} />
      <div className={styles.container}>
        {/* <div className={styles.game_table}>
        <p>{turnColor === 1 ? '黒' : '白'}のターンです。</p>
        <p>点数</p>
        <p>白 {white_count}</p>
        <p>黒 {black_count}</p> */}
        {/* <div className={styles.caveat}>
          {white_pass_count === 1 && (
            <p>警告!pass2回で負け判定になります。只今の白pass{white_pass_count}です。</p>
          )}
        </div> */}
        {/* <div className={styles.caveat}>
          {black_pass_count === 1 && (
            <p>警告!pass2回で負け判定になります。只今の黒pass{black_pass_count}です。</p>
          )} */}
        {/* </div>
        <div className={styles.caveat}>{white_pass_count === 2 && <p>警告!白の負けです。</p>}</div>
        <div className={styles.caveat}>{black_pass_count === 2 && <p>警告！黒の負けです。</p>}</div> */}
        {/* </div> */}
        {/* <div className={styles.pass_button} onClick={() => clickCell(100, 100)}>
          <p>pass</p>
        </div> */}
        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickCell(x, y)}>
                {cell !== 0 && cell !== 7 && (
                  <div
                    className={styles.storn}
                    style={{ background: cell === 1 ? '#131212' : '#d5d2d2' }}
                  />
                )}

                {cell === 7 && <div className={styles.signpost} key={`${x}-${y}`} />}
              </div>
            ))
          )}
        </div>
        <div>
          <h1>{`${turns[turn]}`}</h1>
          <h1>{`白：${count[0]}個 / 黒：${count[1]}個`}</h1>
        </div>
      </div>
    </>
  );
};

export default Home;