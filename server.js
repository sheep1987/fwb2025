const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const { dbConfig, serverConfig } = require('./config'); // 修改这行，导入 serverConfig

const app = express();
const port = serverConfig.port; // 修改这行，使用配置中的端口

// 中间件 - 增加请求体大小限制
app.use(bodyParser.json({ limit: '50mb' }));  // 将默认限制增加到 50MB
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));  // 同样增加 URL 编码数据的限制
app.use(express.static(path.join(__dirname, 'public')));

// 创建 MySQL 连接
const connection = mysql.createConnection(dbConfig);

// 连接到数据库
connection.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err);
    return;
  }
  console.log('已成功连接到 MySQL 数据库');
  
  // 确保表存在，并添加 category 列
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS zbzn_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('创建表失败:', err);
    } else {
      console.log('数据表已就绪');
      
      // 检查是否需要添加 category 列（如果表已存在但没有该列）
      connection.query("SHOW COLUMNS FROM zbzn_history LIKE 'category'", (err, results) => {
        if (err) {
          console.error('检查列失败:', err);
          return;
        }
        
        if (results.length === 0) {
          // category 列不存在，添加它
          connection.query("ALTER TABLE zbzn_history ADD COLUMN category VARCHAR(100) AFTER title", (err) => {
            if (err) {
              console.error('添加 category 列失败:', err);
            } else {
              console.log('已添加 category 列到现有表');
            }
          });
        }
      });
    }
  });
});

// API 端点保存内容到数据库
app.post('/api/save-content', (req, res) => {
  const { title, projectType, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ success: false, message: '标题和内容不能为空' });
  }
  
  const query = 'INSERT INTO zbzn_history (title, category, content) VALUES (?, ?, ?)';
  
  connection.query(query, [title, projectType, content], (error, results) => {
    if (error) {
      console.error('保存数据失败:', error);
      return res.status(500).json({ success: false, message: '数据库错误' });
    }
    
    res.json({
      success: true,
      message: '内容已成功保存',
      id: results.insertId
    });
  });
});

// 获取所有保存的内容
app.get('/api/get-contents', (req, res) => {
  const query = 'SELECT id, title, category, created_at FROM zbzn_history ORDER BY created_at DESC';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('获取数据失败:', error);
      return res.status(500).json({ success: false, message: '数据库错误' });
    }
    
    res.json({
      success: true,
      data: results
    });
  });
});

// 根据 ID 获取具体内容
app.get('/api/get-content/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM zbzn_history WHERE id = ?';
  
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('获取数据失败:', error);
      return res.status(500).json({ success: false, message: '数据库错误' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: '内容不存在' });
    }
    
    res.json({
      success: true,
      data: results[0]
    });
  });
});

// 更新内容的 API 端点
app.post('/api/update-content', (req, res) => {
  const { id, title, category, content } = req.body;
  
  if (!id || !title || !content) {
    return res.status(400).json({ success: false, message: 'ID、标题和内容不能为空' });
  }
  
  const query = 'UPDATE zbzn_history SET title = ?, category = ?, content = ? WHERE id = ?';
  
  connection.query(query, [title, category, content, id], (error, results) => {
    if (error) {
      console.error('更新数据失败:', error);
      return res.status(500).json({ success: false, message: '数据库错误' });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '未找到要更新的内容' });
    }
    
    res.json({
      success: true,
      message: '内容已成功更新'
    });
  });
});

// 删除内容的 API 端点
app.delete('/api/delete-content/:id', (req, res) => {
  const id = req.params.id;
  
  if (!id) {
    return res.status(400).json({ success: false, message: '内容 ID 不能为空' });
  }
  
  const query = 'DELETE FROM zbzn_history WHERE id = ?';
  
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error('删除数据失败:', error);
      return res.status(500).json({ success: false, message: '数据库错误' });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: '未找到要删除的内容' });
    }
    
    res.json({
      success: true,
      message: '内容已成功删除'
    });
  });
});

// 提供前端HTML页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});

// 优雅关闭数据库连接
process.on('SIGINT', () => {
  connection.end((err) => {
    console.log('数据库连接已关闭');
    process.exit(err ? 1 : 0);
  });
}); 