
// 导入 better-sqlite3模块
const sqlite3 = require('better-sqlite3');


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
// full_name：任务全名，可选字段, such as 2021-01-01_01_任务名称
// create_date：任务创建日期，可选字段
// description：任务描述
// labels：任务标签，多个标签用逗号分隔
// folder_path：任务文件夹路径
// create_time：任务创建时间
// finish_time：任务完成时间
// ddl_time：任务截止日期
// status：任务状态，0表示未完成，1表示已完成
// imporance：任务重要性，0表示不重要，1表示重要
const create_tasks_table = `
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    full_name TEXT,
    create_date TEXT,
    description TEXT,
    labels TEXT,
    folder_path TEXT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ddl_time TIMESTAMP,
    finish_time TIMESTAMP,
    status INTEGER DEFAULT 0,
    imporance INTEGER DEFAULT 0
);      
`

// 创建labels表
/**
 * 字段说明：
 * id：主键，自增长
 * name：标签名称
 * imporance：标签重要性，0表示不重要，1表示重要
 */
const create_labels_table = 
`
CREATE TABLE labels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    imporance INTEGER DEFAULT 0
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



// 连接数据库
// const db = new sqlite3('tasks.db');

/**
 * 使用门面模式和单例模式结合，封装一个数据库操作类
 */
class TaskDBFacade {
    constructor() {
        if (!TaskDBFacade.instance) {
            this.db = new sqlite3('tasks.db');
            TaskDBFacade.instance = this;
        }
        return TaskDBFacade.instance;
    }

    // 插入任务信息
    insertTask(task) {
        const { name, description, labels, folder_path } = task;
        const sql = `INSERT INTO tasks (name, description, labels, folder_path) VALUES (?, ?, ?, ?)`;
        const params = [name, description, labels, folder_path];
        return this.db.prepare(sql).run(params);
    }

    // 插入标签信息
    insertLabel(label) {
        const { name } = label;
        const sql = `INSERT INTO labels (name) VALUES (?)`;
        const params = [name];
        return this.db.prepare(sql).run(params);
    }

    // 插入文件夹路径信息
    insertFolderPath(folder_path) {
        const { path } = folder_path;
        const sql = `INSERT INTO folder_path (path) VALUES (?)`;
        const params = [path];
        return this.db.prepare(sql).run(params);
    }

    // 插入任务与标签的关系
    insertTaskLabel(task_id, label_id) {
        const sql = `INSERT INTO tasks_labels (task_id, label_id) VALUES (?, ?)`;
        const params = [task_id, label_id];
        return this.db.prepare(sql).run(params);
    }

    // 插入文件夹与任务的关系
    insertFolderTask(folder_id, task_id) {
        const sql = `INSERT INTO folder_tasks (folder_id, task_id) VALUES (?, ?)`;
        const params = [folder_id, task_id];
        return this.db.prepare(sql).run(params);
    }

    // 查询任务信息
    queryTask(id) {
        const sql = `SELECT * FROM tasks WHERE id = ?`;
        const params = [id];
        return this.db.prepare(sql).get(params);    
    }

    // 查询标签信息
    queryLabel(id) {
        const sql = `SELECT * FROM labels WHERE id = ?`;
        const params = [id];
        return this.db.prepare(sql).get(params);
    }

    // 查询文件夹路径信息
    queryFolderPath(id) {
        const sql = `SELECT * FROM folder_path WHERE id = ?`;
        const params = [id];
        return this.db.prepare(sql).get(params);
    }

    // 查询任务与标签的关系
    queryTaskLabel(task_id, label_id) {
        const sql = `SELECT * FROM tasks_labels WHERE task_id = ? AND label_id = ?`;
        const params = [task_id, label_id];
        return this.db.prepare(sql).get(params);
    }

    // 查询文件夹与任务的关系
    queryFolderTask(folder_id, task_id) {
        const sql = `SELECT * FROM folder_tasks WHERE folder_id = ? AND task_id = ?`;
        const params = [folder_id, task_id];
        return this.db.prepare(sql).get(params);
    }

    // 更新任务信息
    updateTask(id, task) {
        const { name, description, labels, folder_path } = task;
        const sql = `UPDATE tasks SET name = ?, description = ?, labels = ?, folder_path = ? WHERE id = ?`;
        const params = [name, description, labels, folder_path, id];
        return this.db.prepare(sql).run(params);
    }

    // 更新标签信息
    updateLabel(id, label) {
        const { name } = label;
        const sql = `UPDATE labels SET name = ? WHERE id = ?`;
        const params = [name, id];
        return this.db.prepare(sql).run(params);
    }

    // 更新文件夹路径信息
    updateFolderPath(id, folder_path) {
        const { path } = folder_path;
        const sql = `UPDATE folder_path SET path = ? WHERE id = ?`;
        const params = [path, id];
        return this.db.prepare(sql).run(params);
    }

    // 更新任务与标签的关系
    updateTaskLabel(task_id, label_id, new_task_id, new_label_id) {
        const sql = `UPDATE tasks_labels SET task_id = ?, label_id = ? WHERE task_id = ? AND label_id = ?`;
        const params = [new_task_id, new_label_id, task_id, label_id];
        return this.db.prepare(sql).run(params);
    }

    // 更新文件夹与任务的关系
    updateFolderTask(folder_id, task_id, new_folder_id, new_task_id) {
        const sql = `UPDATE folder_tasks SET folder_id = ?, task_id = ? WHERE folder_id = ? AND task_id = ?`;
        const params = [new_folder_id, new_task_id, folder_id, task_id];
        return this.db.prepare(sql).run(params);
    }

    // 删除任务信息
    deleteTask(id) {
        const sql = `DELETE FROM tasks WHERE id = ?`;
        const params = [id];
        return this.db.prepare(sql).run(params);
    }

    // 删除标签信息
    deleteLabel(id) {
        const sql = `DELETE FROM labels WHERE id = ?`;
        const params = [id];
        return this.db.prepare(sql).run(params);
    }

    // 删除文件夹路径信息
    deleteFolderPath(id) {
        const sql = `DELETE FROM folder_path WHERE id = ?`;
        const params = [id];
        return this.db.prepare(sql).run(params);
    }

    // 删除任务与标签的关系
    deleteTaskLabel(task_id, label_id) {
        const sql = `DELETE FROM tasks_labels WHERE task_id = ? AND label_id = ?`;
        const params = [task_id, label_id];
        return this.db.prepare(sql).run(params);
    }

    // 删除文件夹与任务的关系
    deleteFolderTask(folder_id, task_id) {
        const sql = `DELETE FROM folder_tasks WHERE folder_id = ? AND task_id = ?`;
        const params = [folder_id, task_id];
        return this.db.prepare(sql).run(params);
    }

    // 查询所有任务信息
    queryAllTasks() {
        const sql = `SELECT * FROM tasks`;
        return this.db.prepare(sql).all();
    }

    // 查询所有标签信息
    queryAllLabels() {
        const sql = `SELECT * FROM labels`;
        return this.db.prepare(sql).all();
    }

    // 查询所有文件夹路径信息
    queryAllFolderPaths() {
        const sql = `SELECT * FROM folder_path`;
        return this.db.prepare(sql).all();
    }

    // 查询所有任务与标签的关系
    queryAllTaskLabels() {
        const sql = `SELECT * FROM tasks_labels`;
        return this.db.prepare(sql).all();
    }

    // 查询所有文件夹与任务的关系
    queryAllFolderTasks() {
        const sql = `SELECT * FROM folder_tasks`;
        return this.db.prepare(sql).all();
    }
}

module.exports = TaskDBFacade;        
