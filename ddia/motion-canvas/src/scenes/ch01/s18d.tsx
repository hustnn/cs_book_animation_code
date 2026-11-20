import {makeCardScene} from '../../components/TitleCard';

// 1.8 描述负载 · 补段（45s）：Figure 1-2 的 SQL 语句原文（p11）。
export default makeCardScene(
  '第 1 章 · 1.8 描述负载',
  'Figure 1-2 · SQL 原文',
  [
    {text: 'SELECT tweets.*, users.*', size: 22},
    {text: 'FROM tweets JOIN users ON tweets.sender_id = users.id', size: 22},
    {text: 'JOIN follows ON follows.followee_id = users.id', size: 22},
    {text: 'WHERE follows.follower_id = current_user', size: 22},
  ],
  '读时组装：打开时间线时现查、现 join、现拼。',
  45,
);
