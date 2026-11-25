// 一章一份的章数据：章号、章名、路线图（部分 → 站）。所有场景共用：开篇画路线图，每个单元的站牌算“第 k 站 / 共 n 站”。
// 在工程里放在 src/lib/chapter.ts；这里放在示例的 scenes/ 下，是因为示例要能临时装进任何工程。
// 和 design.md 开篇单元的“### 路线图”表一一对应：部分、问题、站名、单元标题都从那里抄，改一处就改两处。
// 站的 id 是内部编号（不上屏）；name ≤ 5 个字（路线图上放得下）；title 是单元标题（站牌和页眉用）。
// 这份是示例 lsm/scenes/chapter.ts 的同一份内容（两个示例同属一章：LSM 是第 3 站）。
import type {Chapter} from '../../lib/opening';

export const CHAPTER: Chapter = {
  number: 3,
  title: '存储与检索',
  en: 'Storage and Retrieval',
  parts: [
    {
      title: '事务型存储',
      question: '一条记录写进去，怎么最快找回来？',
      stops: [
        {id: 'u1', name: '追加日志', title: '最简单的数据库：一行一行追加'},
        {id: 'u2', name: '哈希索引', title: '哈希索引：键就是地址'},
        {id: 'u3', name: 'LSM 树', title: '排好序的段：SSTable 与 LSM 树'},
        {id: 'u4', name: 'B 树', title: 'B 树：把数据切成页'},
        {id: 'u5', name: '两派对决', title: '两大学派对决：写快还是读快'},
        {id: 'u6', name: '二级索引', title: '不止主键：二级索引与聚集索引'},
        {id: 'u7', name: '多维模糊', title: '超出键值查找：多维、模糊与内存'},
      ],
    },
    {
      title: '分析型存储',
      question: '一次查询要扫几十亿行，数据该放哪？',
      stops: [
        {id: 'u8', name: '两类负载', title: '两条路：事务还是分析'},
        {id: 'u9', name: '数据仓库', title: '数据仓库与 ETL'},
        {id: 'u10', name: '星型模式', title: '星型模式：事实在中间'},
      ],
    },
    {
      title: '列式存储',
      question: '只读用得到的列：怎么存、怎么压、怎么算？',
      stops: [
        {id: 'u11', name: '按列存', title: '列式存储：按列排'},
        {id: 'u12', name: '位图压缩', title: '列压缩：位图'},
        {id: 'u13', name: '排序写入', title: '排序与写入：列存的两难'},
        {id: 'u14', name: '物化聚合', title: '聚合：立方体与物化视图'},
      ],
    },
    {
      title: '收束',
      question: '这一路的取舍，什么时候选哪种？',
      stops: [{id: 'u15', name: '小结', title: '小结：存与取，怎么选'}],
    },
  ],
};
