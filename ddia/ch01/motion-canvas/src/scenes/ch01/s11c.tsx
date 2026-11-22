import {makeCardScene} from '../../components/TitleCard';

// 1.1 思考数据系统 · 补段（45s）：Figure 1-1 的图意与图面流程。
export default makeCardScene(
  '第 1 章 · 1.1 思考数据系统',
  'Figure 1-1：复合数据系统',
  [
    {text: '应用管理 Memcached / Elasticsearch / Solr 独立于主库'},
    {text: '同步缓存与索引，是应用代码的责任'},
    {text: 'API 把实现细节藏起来'},
    {text: '复合系统给保证：写时缓存失效 / 更新，客户看到一致结果'},
    {text: '读先查内存缓存，未命中与写走主数据库；捕获变更'},
    {text: '搜索走全文索引，索引随更新而更新；异步出站发邮件'},
  ],
  '你不只是应用开发者，也是数据系统设计者。',
  45,
);
