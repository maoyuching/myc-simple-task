
/**
 * 设计一个数据库用于管理任务信息，有以下内容：
1. 每个任务用一个文件夹管理
2. 每个任务有0个或多个标签
设计SQLite建表语句
 */
// 建表语句

// 创建tasks表
// 字段说明：
// id：主键，自增长
// name：任务名称
// description：任务描述
// labels：任务标签，多个标签用逗号分隔
// folder_path：任务文件夹路径
// create_time：任务创建时间
// finish_time：任务完成时间
// status：任务状态，0表示未完成，1表示已完成
// imporance：任务重要性，0表示不重要，1表示重要
const create_tasks_table = `
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    labels TEXT,
    folder_path TEXT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    finish_time TIMESTAMP,
    status INTEGER DEFAULT 0,
    imporance INTEGER DEFAULT 0
);      
`

// 创建labels表
const create_labels_table = 
`
CREATE TABLE labels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);
`

// 创建folder_path表    
const create_folder_path_table = 
`
CREATE TABLE folder_path (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL
);
`
// 创建tasks_labels表
const create_tasks_labels_table = 
`
CREATE TABLE tasks_labels (
    task_id INTEGER NOT NULL,
    label_id INTEGER NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (label_id) REFERENCES labels(id)
);
`

// 创建folder_tasks表
const create_folder_tasks_table = 
`
CREATE TABLE folder_tasks (
    folder_id INTEGER NOT NULL,
    task_id INTEGER NOT NULL,
    FOREIGN KEY (folder_id) REFERENCES folder_path(id),
    FOREIGN KEY (task_id) REFERENCES tasks(id)
);
`    
// 说明：
// 1. tasks表：存储任务信息，包括任务名称、描述、标签、文件夹路径
// 2. labels表：存储标签信息，包括标签名称
// 3. folder_path表：存储文件夹路径信息 
// 4. tasks_labels表：存储任务与标签的关系，一对多关系
// 5. folder_tasks表：存储文件夹与任务的关系，一对多关系                
// 示例：
// 插入一条任务信息
`
INSERT INTO tasks (name, description, labels, folder_path) VALUES ('任务1', '任务1描述', '标签1,标签2', '文件夹1');
`
// 插入一条标签信息
`
INSERT INTO labels (name) VALUES ('标签1');
`
// 插入一条文件夹路径信息
`
INSERT INTO folder_path (path) VALUES ('文件夹1');
`
// 插入一条任务与标签的关系
`
INSERT INTO tasks_labels (task_id, label_id) VALUES (1, 1);
`
// 插入一条文件夹与任务的关系
`
INSERT INTO folder_tasks (folder_id, task_id) VALUES (1, 1);
`   


