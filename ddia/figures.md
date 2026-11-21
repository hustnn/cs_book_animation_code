# DDIA 全书图版对照表（Figure / Table）

> 来源：原书 PDF `~/workspace/ddia/ddia.pdf`（Martin Kleppmann《Designing Data-Intensive Applications》，613 页，`pdfinfo` 核对）
> 与分镜总表 `PLAN.md`（193 段，181 小节）对照。制作时间：2026-11-20。
> 提取方法：`pdftotext -layout` 抽出全部图注（caption），`pdfimages -list` 核对嵌图数；
> 分镜段（PLAN 编号）按“图在正文中第一次被提到时所在的小节”定，不按图注所在页定——
> 原书的图经常浮排到后面几页，图注页经常落在下一小节的页码范围里（见下文“注意”）。
> 图注原文为英文，照书抄录，未翻译；中文小节名来自 PLAN.md。

## 0. 总数核对

| 项目 | 数值 |
|---|---|
| 带编号的图 Figure | **89 张**，Figure 1-1 至 Figure 12-1，正文提到 306 次 |
| PDF 内嵌图片 `pdfimages` | **127 张**（含封面、照片、重复使用的图标等；89 张编号图之外的图片不是编号 Figure） |
| 带正式编号的表 Table | **只有 Table 3-1 一张**（见第 2 节） |
| 有原书图的 PLAN 小节 | **62 / 181 小节**；其余 119 小节没有对应的原书图，分镜需原创画图 |
| 图最多的章 | 第 5 章 14 张；第 3 章 12 张；第 7 章 11 张；第 9 章 10 张 |
| 图最少的章 | 第 12 章只有 Figure 12-1 一张；第 10 章 3 张 |

**按章计数：** 第 1 章 5 张；第 2 章 6 张；第 3 章 12 张；第 4 章 7 张；第 5 章 14 张；第 6 章 8 张；第 7 章 11 张；第 8 章 5 张；第 9 章 10 张；第 10 章 3 张；第 11 章 7 张；第 12 章 1 张。

**注意（已核实的两处容易误读的地方）：**
- Figure 4-7 的图注是“*When an older version of the application updates data previously written by a newer version…*”（PDF p152），不是正文里那句以 “Figure 4-7. For example, if you decode…” 开头的句子，那句只是正文引用。
- 书页页码 = PDF 页码 − 22（第 1 章正文书页 p3 在 PDF p25）。例如 Figure 1-1 在 PDF p27，即书页 p5。
- 图注页 ≠ 讨论页：例如 Figure 5-1 在 §5.1 讨论，图注印在书页 p153（已是 §5.2 的页码范围）；Figure 9-9 在 §9.12 讨论，图注在书页 p356。做分镜时以本表“PLAN 段”列为准，不要只按图注页归类。

## 1. 全书 89 张图对照表

表头：图号 | 图注（原书英文） | PDF 页 / 书页 | PLAN 段（首次讨论的小节）

| 图号 | 图注 | PDF 页 / 书页 | PLAN 段 |
|---|---|---|---|
| Figure 1-1 | Figure 1-1. One possible architecture for a data system that combines several components. | p27 / 书 p5 | 1.1 Thinking About Data Systems |
| Figure 1-2 | Figure 1-2. Simple relational schema for implementing a Twitter home timeline. | p34 / 书 p12 | 1.8 Describing Load |
| Figure 1-3 | Figure 1-3. Twitter’s data pipeline for delivering tweets to followers, with load parameters as of November 2012 [16]. | p34 / 书 p12 | 1.8 Describing Load |
| Figure 1-4 | Figure 1-4. Illustrating mean and percentiles: response times for a sample of 100 requests to a service. | p36 / 书 p14 | 1.9 Describing Performance |
| Figure 1-5 | Figure 1-5. When several backend calls are needed to serve a request, it takes just a single slow backend request to slow down the entire end-user request. | p39 / 书 p17 | 1.9 Describing Performance |
| Figure 2-1 | Figure 2-1. Representing a LinkedIn profile using a relational schema. Photo of Bill Gates courtesy of Wikimedia Commons, Ricardo Stuckert, Agência Brasil. | p53 / 书 p31 | 2.3 The Object-Relational Mismatch |
| Figure 2-2 | Figure 2-2. One-to-many relationships forming a tree structure. | p54 / 书 p32 | 2.3 The Object-Relational Mismatch |
| Figure 2-3 | Figure 2-3. The company name is not just a string, but a link to a company entity. | p57 / 书 p35 | 2.4 Many-to-One and Many-to-Many Relationships |
| Figure 2-4 | Figure 2-4. Extending résumés with many-to-many relationships. | p57 / 书 p35 | 2.4 Many-to-One and Many-to-Many Relationships |
| Figure 2-5 | Figure 2-5. Example of graph-structured data (boxes represent vertices, arrows represent edges). | p72 / 书 p50 | 2.10 Graph-Like Data Models |
| Figure 2-6 | Figure 2-6. Determining that Idaho is in North America, using the Datalog rules from Example 2-11. | p84 / 书 p62 | 2.15 The Foundation: Datalog |
| Figure 3-1 | Figure 3-1. Storing a log of key-value pairs in a CSV-like format, indexed with an in-memory hash map. | p94 / 书 p72 | 3.2 Hash Indexes |
| Figure 3-2 | Figure 3-2. Compaction of a key-value update log (counting the number of times each cat video was played), retaining only the most recent value for each key. | p95 / 书 p73 | 3.2 Hash Indexes |
| Figure 3-3 | Figure 3-3. Performing compaction and segment merging simultaneously. | p96 / 书 p74 | 3.2 Hash Indexes |
| Figure 3-4 | Figure 3-4. Merging several SSTable segments, retaining only the most recent value for each key. | p98 / 书 p76 | 3.3 SSTables and LSM-Trees |
| Figure 3-5 | Figure 3-5. An SSTable with an in-memory index. | p99 / 书 p77 | 3.3 SSTables and LSM-Trees |
| Figure 3-6 | Figure 3-6. Looking up a key using a B-tree index. | p102 / 书 p80 | 3.4 B-Trees |
| Figure 3-7 | Figure 3-7. Growing a B-tree by splitting a page. | p103 / 书 p81 | 3.4 B-Trees |
| Figure 3-8 | Figure 3-8. Simplified outline of ETL into a data warehouse. | p114 / 书 p92 | 3.8 Data Warehousing |
| Figure 3-9 | Figure 3-9. Example of a star schema for use in a data warehouse. | p116 / 书 p94 | 3.9 Stars and Snowflakes: Schemas for Analytics |
| Figure 3-10 | Figure 3-10. Storing relational data by column, rather than by row. | p119 / 书 p97 | 3.10 Column-Oriented Storage |
| Figure 3-11 | Figure 3-11. Compressed, bitmap-indexed storage of a single column. | p120 / 书 p98 | 3.11 Column Compression |
| Figure 3-12 | Figure 3-12. Two dimensions of a data cube, aggregating data by summing. | p124 / 书 p102 | 3.14 Aggregation: Data Cubes and Materialized Views |
| Figure 4-1 | Figure 4-1. Example record (Example 4-1) encoded using MessagePack. | p139 / 书 p117 | 4.3 JSON, XML, and Binary Variants |
| Figure 4-2 | Figure 4-2. Example record encoded using Thrift’s BinaryProtocol. | p140 / 书 p118 | 4.4 Thrift and Protocol Buffers |
| Figure 4-3 | Figure 4-3. Example record encoded using Thrift’s CompactProtocol. | p140 / 书 p118 | 4.4 Thrift and Protocol Buffers |
| Figure 4-4 | Figure 4-4. Example record encoded using Protocol Buffers. | p142 / 书 p120 | 4.4 Thrift and Protocol Buffers |
| Figure 4-5 | Figure 4-5. Example record encoded using Avro. | p145 / 书 p123 | 4.5 Avro |
| Figure 4-6 | Figure 4-6. An Avro reader resolves differences between the writer’s schema and the reader’s schema. | p146 / 书 p124 | 4.5 Avro |
| Figure 4-7 | Figure 4-7. When an older version of the application updates data previously written by a newer version of the application, data may be lost if you’re not careful. | p152 / 书 p130 | 4.8 Dataflow Through Databases |
| Figure 5-1 | Figure 5-1. Leader-based (master–slave) replication. | p175 / 书 p153 | 5.1 Leaders and Followers |
| Figure 5-2 | Figure 5-2. Leader-based replication with one synchronous and one asynchronous follower. | p176 / 书 p154 | 5.2 Synchronous Versus Asynchronous Replication |
| Figure 5-3 | Figure 5-3. A user makes a write, followed by a read from a stale replica. To prevent this anomaly, we need read-after-write consistency. | p185 / 书 p163 | 5.7 Reading Your Own Writes |
| Figure 5-4 | Figure 5-4. A user first reads from a fresh replica, then from a stale replica. Time appears to go backward. To prevent this anomaly, we need monotonic reads. | p187 / 书 p165 | 5.8 Monotonic Reads |
| Figure 5-5 | Figure 5-5. If some partitions are replicated slower than others, an observer may see the answer before they see the question. | p188 / 书 p166 | 5.9 Consistent Prefix Reads |
| Figure 5-6 | Figure 5-6. Multi-leader replication across multiple datacenters. | p191 / 书 p169 | 5.12 Use Cases for Multi-Leader Replication |
| Figure 5-7 | Figure 5-7. A write conflict caused by two leaders concurrently updating the same record. | p193 / 书 p171 | 5.13 Handling Write Conflicts |
| Figure 5-8 | Figure 5-8. Three example topologies in which multi-leader replication can be set up. | p197 / 书 p175 | 5.14 Multi-Leader Replication Topologies |
| Figure 5-9 | Figure 5-9. With multi-leader replication, writes may arrive in the wrong order at some replicas. | p198 / 书 p176 | 5.14 Multi-Leader Replication Topologies |
| Figure 5-10 | Figure 5-10. A quorum write, quorum read, and read repair after a node outage. | p200 / 书 p178 | 5.16 Writing to the Database When a Node Is Down |
| Figure 5-11 | Figure 5-11. If w + r > n, at least one of the r replicas you read from must have seen the most recent successful write. | p202 / 书 p180 | 5.16 Writing to the Database When a Node Is Down |
| Figure 5-12 | Figure 5-12. Concurrent writes in a Dynamo-style datastore: there is no well-defined ordering. | p207 / 书 p185 | 5.19 Detecting Concurrent Writes |
| Figure 5-13 | Figure 5-13. Capturing causal dependencies between two clients concurrently editing a shopping cart. | p211 / 书 p189 | 5.19 Detecting Concurrent Writes |
| Figure 5-14 | Figure 5-14. Graph of causal dependencies in Figure 5-13. | p211 / 书 p189 | 5.19 Detecting Concurrent Writes |
| Figure 6-1 | Figure 6-1. Combining replication and partitioning: each node acts as leader for some partitions and follower for other partitions. | p223 / 书 p201 | 6.1 Partitioning and Replication |
| Figure 6-2 | Figure 6-2. A print encyclopedia is partitioned by key range. | p224 / 书 p202 | 6.3 Partitioning by Key Range |
| Figure 6-3 | Figure 6-3. Partitioning by hash of key. | p226 / 书 p204 | 6.4 Partitioning by Hash of Key |
| Figure 6-4 | Figure 6-4. Partitioning secondary indexes by document. | p229 / 书 p207 | 6.7 Partitioning Secondary Indexes by Document |
| Figure 6-5 | Figure 6-5. Partitioning secondary indexes by term. | p230 / 书 p208 | 6.7 Partitioning Secondary Indexes by Document |
| Figure 6-6 | Figure 6-6. Adding a new node to a database cluster with multiple partitions per node. | p233 / 书 p211 | 6.10 Strategies for Rebalancing |
| Figure 6-7 | Figure 6-7. Three different ways of routing a request to the right node. | p237 / 书 p215 | 6.12 Request Routing |
| Figure 6-8 | Figure 6-8. Using ZooKeeper to keep track of assignment of partitions to nodes. | p237 / 书 p215 | 6.12 Request Routing |
| Figure 7-1 | Figure 7-1. A race condition between two clients concurrently incrementing a counter. | p248 / 书 p226 | 7.2 The Meaning of ACID |
| Figure 7-2 | Figure 7-2. Violating isolation: one transaction reads another transaction’s uncommitted writes (a “dirty read”). | p251 / 书 p229 | 7.3 Single-Object and Multi-Object Operations |
| Figure 7-3 | Figure 7-3. Atomicity ensures that if an error occurs any prior writes from that transaction are undone, to avoid an inconsistent state. | p251 / 书 p229 | 7.3 Single-Object and Multi-Object Operations |
| Figure 7-4 | Figure 7-4. No dirty reads: user 2 sees the new value for x only after user 1’s transaction has committed. | p256 / 书 p234 | 7.5 Read Committed |
| Figure 7-5 | Figure 7-5. With dirty writes, conflicting writes from different transactions can be mixed up. | p258 / 书 p236 | 7.5 Read Committed |
| Figure 7-6 | Figure 7-6. Read skew: Alice observes the database in an inconsistent state. | p259 / 书 p237 | 7.6 Snapshot Isolation and Repeatable Read |
| Figure 7-7 | Figure 7-7. Implementing snapshot isolation using multi-version objects. | p262 / 书 p240 | 7.6 Snapshot Isolation and Repeatable Read |
| Figure 7-8 | Figure 7-8. Example of write skew causing an application bug. | p269 / 书 p247 | 7.8 Write Skew and Phantoms |
| Figure 7-9 | Figure 7-9. The difference between an interactive transaction and a stored procedure (using the example transaction of Figure 7-8). | p276 / 书 p254 | 7.10 Actual Serial Execution |
| Figure 7-10 | Figure 7-10. Detecting when a transaction reads outdated values from an MVCC snapshot. | p285 / 书 p263 | 7.12 Serializable Snapshot Isolation (SSI) |
| Figure 7-11 | Figure 7-11. In serializable snapshot isolation, detecting when one transaction modifies another transaction’s reads. | p286 / 书 p264 | 7.12 Serializable Snapshot Isolation (SSI) |
| Figure 8-1 | Figure 8-1. If you send a request and don’t get a response, it’s not possible to distinguish whether (a) the request was lost, (b) the remote node is down, or (c) the response was lost. | p300 / 书 p278 | 8.3 Unreliable Networks |
| Figure 8-2 | Figure 8-2. If several machines send network traffic to the same destination, its switch queue can fill up. Here, ports 1, 2, and 4 are all trying to send packets to port 3. | p305 / 书 p283 | 8.6 Timeouts and Unbounded Delays |
| Figure 8-3 | Figure 8-3. The write by client B is causally later than the write by client A, but B’s write has an earlier timestamp. | p314 / 书 p292 | 8.11 Relying on Synchronized Clocks |
| Figure 8-4 | Figure 8-4. Incorrect implementation of a distributed lock: client 1 believes that it still has a valid lease, even though it has expired, and thus corrupts a file in storage. | p324 / 书 p302 | 8.14 The Truth Is Defined by the Majority |
| Figure 8-5 | Figure 8-5. Making access to storage safe by allowing writes only in the order of increasing fencing tokens. | p325 / 书 p303 | 8.14 The Truth Is Defined by the Majority |
| Figure 9-1 | Figure 9-1. This system is not linearizable, causing football fans to be confused. | p346 / 书 p324 | 9.2 Linearizability |
| Figure 9-2 | Figure 9-2. If a read request is concurrent with a write request, it may return either the old or the new value. | p347 / 书 p325 | 9.3 What Makes a System Linearizable? |
| Figure 9-3 | Figure 9-3. After any one read has returned the new value, all following reads (on the same or other clients) must also return the new value. | p349 / 书 p327 | 9.3 What Makes a System Linearizable? |
| Figure 9-4 | Figure 9-4. Visualizing the points in time at which the reads and writes appear to have taken effect. The final read by B is not linearizable. | p350 / 书 p328 | 9.3 What Makes a System Linearizable? |
| Figure 9-5 | Figure 9-5. The web server and image resizer communicate both through file storage and a message queue, opening the potential for race conditions. | p354 / 书 p332 | 9.4 Relying on Linearizability |
| Figure 9-6 | Figure 9-6. A nonlinearizable execution, despite using a strict quorum. | p356 / 书 p334 | 9.5 Implementing Linearizable Systems |
| Figure 9-7 | Figure 9-7. A network interruption forcing a choice between linearizability and availability. | p357 / 书 p335 | 9.6 The Cost of Linearizability |
| Figure 9-8 | Figure 9-8. Lamport timestamps provide a total ordering consistent with causality. | p368 / 书 p346 | 9.9 Sequence Number Ordering |
| Figure 9-9 | Figure 9-9. A successful execution of two-phase commit (2PC). | p378 / 书 p356 | 9.12 Atomic Commit and Two-Phase Commit (2PC) |
| Figure 9-10 | Figure 9-10. The coordinator crashes after participants vote “yes.” Database 1 does not know whether to commit or abort. | p381 / 书 p359 | 9.12 Atomic Commit and Two-Phase Commit (2PC) |
| Figure 10-1 | Figure 10-1. A MapReduce job with three mappers and three reducers. | p423 / 书 p401 | 10.5 MapReduce Job Execution |
| Figure 10-2 | Figure 10-2. A join between a log of user activity events and a database of user profiles. | p426 / 书 p404 | 10.6 Reduce-Side Joins and Grouping |
| Figure 10-3 | Figure 10-3. A reduce-side sort-merge join on user ID. If the input datasets are partitioned into multiple files, each could be processed with multiple mappers in parallel. | p427 / 书 p405 | 10.6 Reduce-Side Joins and Grouping |
| Figure 11-1 | Figure 11-1. (a) Load balancing: sharing the work of consuming a topic among consumers; (b) fan-out: delivering each message to multiple consumers. | p467 / 书 p445 | 11.2 Messaging Systems |
| Figure 11-2 | Figure 11-2. Consumer 2 crashes while processing m3, so it is redelivered to consumer 1 at a later time. | p468 / 书 p446 | 11.2 Messaging Systems |
| Figure 11-3 | Figure 11-3. Producers send messages by appending them to a topic-partition file, and consumers read these files sequentially. | p470 / 书 p448 | 11.3 Partitioned Logs |
| Figure 11-4 | Figure 11-4. In the database, X is first set to A and then to B, while at the search index the writes arrive in the opposite order. | p475 / 书 p453 | 11.5 Keeping Systems in Sync |
| Figure 11-5 | Figure 11-5. Taking data in the order it was written to one database, and applying the changes to other systems in the same order. | p476 / 书 p454 | 11.6 Change Data Capture |
| Figure 11-6 | Figure 11-6. The relationship between the current application state and an event stream. | p482 / 书 p460 | 11.8 State, Streams, and Immutability |
| Figure 11-7 | Figure 11-7. Windowing by processing time introduces artifacts due to variations in processing rate. | p492 / 书 p470 | 11.11 Reasoning About Time |
| Figure 12-1 | Figure 12-1. In a search index, writes (document updates) meet reads (queries). | p531 / 书 p509 | 12.7 Observing Derived State |

## 2. 唯一的正式编号表 Table 3-1

- **Table 3-1. Comparing characteristics of transaction processing versus analytic systems**（PDF p117 / 书 p93，§3.7 Transaction Processing or Analytics?，PLAN 3.7）
- 内容（`pdftotext -layout` 抽出，列对齐完整）：

| Property | Transaction processing systems (OLTP) | Analytic systems (OLAP) |
|---|---|---|
| Main read pattern | Small number of records per query, fetched by key | Aggregate over large number of records |
| Main write pattern | Random-access, low-latency writes from user input | Bulk import (ETL) or event stream |
| Primarily used by | End user/customer, via web application | Internal analyst, for decision support |
| What data represents | Latest state of data (current point in time) | History of events that happened over time |
| Dataset size | Gigabytes to terabytes | Terabytes to petabytes |

书里其他“表”都没有 Table 编号，是正文排版成的表格样子，用 layout 模式也能读到，但做动画时要人工核对列有没有对错行。

## 3. 给第 2 章起的分镜怎么用这张表

- 第 2 章 6 张图：Figure 2-1、2-2 在 §2.3（对象关系失配），2-3、2-4 在 §2.4（多对一与多对多），2-5 在 §2.10（图状数据模型），2-6 在 §2.15（Datalog）。
- §2.1、2.2、2.5–2.9、2.11–2.14、2.16 没有原书图，分镜要原创画图，不能照着书里的图描。
- 第 3 章最值得对着图做：Figure 3-4、3-5 在 §3.3（SSTable 合并与索引），3-6、3-7 在 §3.4（B 树查找与分裂），3-1～3-3 在 §3.2（哈希索引与日志压缩）。
- 第 5 章的 Quorum 图 Figure 5-11 在 §5.16（不是 §5.17），Manim 证明段已按这个做的；Figure 5-10 同段。

