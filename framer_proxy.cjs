const { spawn } = require('child_process');

const framerUrl = "https://mcp.unframer.co/sse?id=1f0c2735314d62735c296725919ed10dbd62647a7de4ec72ed97ebd0db2af6a6&secret=Liyh6RoDyrxAYZPuYGgrLmlGF0mXkaw3";

console.error("[Proxy] Khởi động Framer MCP Proxy...");

// Sử dụng lệnh 'npx' với shell: true là cách an toàn nhất trên Windows 
// khi chúng ta đã bọc URL trong dấu ngoặc kép kép.
const child = spawn('npx', ['-y', 'supergateway', '--sse', `"${framerUrl}"`], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (err) => {
  console.error("[Proxy] Lỗi khởi động:", err.message);
});

child.on('exit', (code) => {
  if (code !== 0) console.error("[Proxy] Kết thúc với mã lỗi:", code);
});
