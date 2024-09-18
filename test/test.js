//  import assert 
var assert = require('assert');

// 测试n1.js文件
var n1 = require('../n1');

// 测试用例
describe('n1.js', function() {
  describe('#isTaskFolder()', function() {

    it('should return true when the folder is a task folder', function() {
      assert.equal(n1.isTaskFolder("2024-03-04_01_23年申报资金文件"), true);
    });

    it('should return false when the folder is not a task folder', function() {
      assert.equal(n1.isTaskFolder("2024-09_01_做一个任务管理系统"), false);
    });

    it('should return false when the folder is not a task folder', function() {
      assert.equal(n1.isTaskFolder("00-history"), false);
    });

  });


  describe('读取任务列表', function() {
    it('should return the task name when the folder is a task folder', function() {
      assert.ok(n1.readTaskList(n1.TASK_LIST_PATHS));
    });
  });


});

