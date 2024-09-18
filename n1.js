/**
 * @description 任务管理系统
 * 
 * step1: 读取任务列表
 * step2: 设计数据库并写入
 * step3: 实现根据标签查询任务
 * step4: 实现任务的添加、删除、修改
 */


fs = require('fs')


// step1: 读取任务列表

// 任务列表文件夹路径列表
const TASK_LIST_PATHS = [
  'D:\\时间线\\00-history',
  'D:\\时间线\\00-history\\00history'
]

/**
 * 写一个验证函数，判断是否是任务文件夹
 * 任务文件夹名称要求形如2024-09-04_01_任务名称，year-month-day_number_任务名称
 * 其中number表示任务的顺序，如果长度不满2位，则用0补齐
 * 其中日期格式为yyyy-mm-dd
 * @param {string} folderName 文件夹名称
 * @returns {boolean} 是否是任务文件夹
 */ 
function isTaskFolder(folderName) {
  const match = folderName.match(/(\d{4})-(\d{2})-(\d{2})_(\d{1,2})_(.*)/)
  if (match) {
    const year = match[1]
    const month = match[2]
    const day = match[3]
    const number = match[4]
    const title = match[5]
    const date = new Date(`${year}-${month}-${day}`)
    if (date.toString() === 'Invalid Date') {
      return false
    }
    return true
  }
  return false    
}

/**
 * 读取任务文件夹列表，每一个任务文件夹是一个对象，包含title、folderPath
 * @param {Array} taskListPaths task list folder paths
 * @returns {Array} task folder list, each item is an object with title,  folderPath
 * { title: '任务名称', date: '2024-09-04', folderPath: 'D:\\时间线\\00-history\\2024-09-04_01_做一个任务管理系统' }
 */
function readTaskList(taskListPaths) {
  const taskList = []
  // 两个for循环，遍历每个文件夹
  for (const path of taskListPaths) {
    const folders = fs.readdirSync(path)
    for (const folder of folders) {
      if (isTaskFolder(folder)) {
        const title = folder.split('_')[2]
        const date = folder.split('_')[0]
        const folderPath = path + '\\' + folder
        taskList.push({
          title,
          date,
          folderPath,
          path : path
        })
      }
    }
  }
  // console.log(taskList)
  return taskList 
}




/**
 * exports module
 */
exports.readTaskList = readTaskList;
exports.isTaskFolder = isTaskFolder;
exports.TASK_LIST_PATHS = TASK_LIST_PATHS;