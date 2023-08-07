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
  const [turnColor, setturnColor] = useState<number>();
  const [board, setboard] = useState<number[][]>();
  const [me_color, setme_color] = useState<number>();
  const [black_number, setbkack_number] = useState<number>();
  const [white_numbe, setwhite_number] = useState<number>();
  const yossiy_idea: string[] = ['', '黒', '白'];
  let safe_me_color = 0;
  const fetchBoard = async () => {
    //ここでapi/bordのapiをたたいて、getした値を取得する関数です
    const res = await apiClient.board.$get().catch(returnNull);
    if (res !== null) {
      setboard(res.board);
      setturnColor(res.turnColor);
      setme_color(res.me_color);
      setbkack_number(res.black_number);
      setwhite_number(res.white_number);
    }
  };
  //クリックした位置をpost
  const clickCell = async (x: number, y: number) => {
    await apiClient.board.$post({ body: { x, y } });
  };
  useEffect(() => {
    //ここでさっきの関数を0.5秒ごとに呼び出すことでusestateの中身を更新しています(再描写)
    const cancellid = setInterval(fetchBoard, 500);
    return () => {
      clearInterval(cancellid);
    };
  }, []);

  if (!user || !board || !turnColor) return <Loading visible />;
  me_color && (safe_me_color = me_color);
  return (
    <>
      <BasicHeader user={user} />
      <div className={styles.container}>
        <div className={styles.pass_button} onClick={() => clickCell(8, 8)}>
          Reset
        </div>
        <div className={styles.game_table}>
          {yossiy_idea[turnColor]}の番です。あなたは、{yossiy_idea[safe_me_color]}です。
        </div>
        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickCell(x, y)}>
                {(cell === 1 || cell === 2) && (
                  <div
                    className={styles.storn}
                    style={{ background: cell === 1 ? '#131212' : '#c3c3c3' }}
                  />
                )}
                {cell === 7 && <div className={styles.signpost} key={`${x}-${y}`} />}
              </div>
            ))
          )}
        </div>
        <div className={styles.game_table}>
          白{white_numbe},黒{black_number}
        </div>
      </div>
    </>
  );
};
export default Home;
