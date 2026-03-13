// // performance-test.js
// // Simple Next.js Performance Tester - No TypeScript needed!
// // Usage: node performance-test.js [duration-in-seconds]
// // Example: node performance-test.js 30

// const fs = require('fs');
// const path = require('path');
// const os = require('os');

// class NextJSPerformanceTester {
//   constructor() {
//     this.samples = [];
//     this.issues = [];
//     this.startTime = Date.now();
//   }

//   // Get CPU usage
//   getCPUUsage() {
//     const cpus = os.cpus();
//     let totalIdle = 0, totalTick = 0;
    
//     cpus.forEach(cpu => {
//       for (let type in cpu.times) {
//         totalTick += cpu.times[type];
//       }
//       totalIdle += cpu.times.idle;
//     });
    
//     return {
//       idle: totalIdle / cpus.length,
//       total: totalTick / cpus.length,
//       usage: Math.round(100 - (100 * totalIdle / totalTick))
//     };
//   }

//   // Get memory usage
//   getMemory() {
//     const mem = process.memoryUsage();
//     return {
//       rss: (mem.rss / 1024 / 1024).toFixed(2),
//       heap: (mem.heapUsed / 1024 / 1024).toFixed(2),
//       external: (mem.external / 1024 / 1024).toFixed(2)
//     };
//   }

//   // Scan files for issues
//   scanFiles() {
//     console.log('\n🔍 Scanning your code...\n');
    
//     const srcPath = path.join(process.cwd(), 'src');
//     if (!fs.existsSync(srcPath)) {
//       console.log('⚠️  src folder not found');
//       return;
//     }

//     const problems = {
//       'Missing cleanup in useEffect': {
//         pattern: /useEffect.*addEventListener/gs,
//         severity: 'HIGH',
//         fix: 'Add: return () => removeEventListener(...)'
//       },
//       'setInterval without cleanup': {
//         pattern: /setInterval\(/g,
//         severity: 'HIGH',
//         fix: 'Add: return () => clearInterval(...)'
//       },
//       'setTimeout without cleanup': {
//         pattern: /setTimeout\(/g,
//         severity: 'MEDIUM',
//         fix: 'Add: return () => clearTimeout(...)'
//       },
//       'Possible infinite loop': {
//         pattern: /useEffect.*setState.*,\s*\[.*state.*\]/gs,
//         severity: 'HIGH',
//         fix: 'Check dependency array'
//       },
//       'Missing dependency array': {
//         pattern: /useEffect\([^)]+\{[^}]+\}(?!\s*,\s*\[)/gs,
//         severity: 'MEDIUM',
//         fix: 'Add dependency array: useEffect(..., [])'
//       },
//       'console.log in code': {
//         pattern: /console\.(log|debug|info)/g,
//         severity: 'LOW',
//         fix: 'Remove for production'
//       }
//     };

//     const scanFile = (filePath) => {
//       const content = fs.readFileSync(filePath, 'utf8');
//       const fileName = path.relative(process.cwd(), filePath);
      
//       for (let [problem, config] of Object.entries(problems)) {
//         const matches = content.match(config.pattern);
//         if (matches && matches.length > 0) {
//           this.issues.push({
//             file: fileName,
//             problem: problem,
//             count: matches.length,
//             severity: config.severity,
//             fix: config.fix
//           });
//         }
//       }
//     };

//     const walkDir = (dir) => {
//       try {
//         const files = fs.readdirSync(dir);
//         files.forEach(file => {
//           const fullPath = path.join(dir, file);
//           const stat = fs.statSync(fullPath);
          
//           if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
//             walkDir(fullPath);
//           } else if (/\.(tsx?|jsx?)$/.test(file)) {
//             scanFile(fullPath);
//           }
//         });
//       } catch (err) {
//         // Skip errors
//       }
//     };

//     walkDir(srcPath);
    
//     if (this.issues.length > 0) {
//       console.log(`❌ Found ${this.issues.length} potential issues\n`);
//     } else {
//       console.log('✅ No obvious issues found\n');
//     }
//   }

//   // Check package.json
//   checkPackages() {
//     console.log('📦 Checking packages...\n');
    
//     try {
//       const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
//       const heavy = {
//         'moment': 'Use date-fns instead (lighter)',
//         'lodash': 'Use lodash-es or individual imports',
//         'jquery': 'Not needed in Next.js',
//       };
      
//       const deps = { ...pkg.dependencies, ...pkg.devDependencies };
//       let found = false;
      
//       for (let [name, msg] of Object.entries(heavy)) {
//         if (deps[name]) {
//           console.log(`   ⚠️  ${name}: ${msg}`);
//           found = true;
//         }
//       }
      
//       if (!found) {
//         console.log('   ✅ Packages look good');
//       }
//       console.log();
//     } catch (err) {
//       console.log('   ⚠️  Cannot read package.json\n');
//     }
//   }

//   // Monitor performance
//   async monitor(duration) {
//     console.log(`\n🎯 Monitoring for ${duration} seconds...\n`);
    
//     return new Promise((resolve) => {
//       const interval = setInterval(() => {
//         const cpu = this.getCPUUsage();
//         const mem = this.getMemory();
        
//         this.samples.push({ cpu, mem, time: Date.now() });
        
//         // Visual bar
//         const bars = '█'.repeat(Math.floor(cpu.usage / 5));
//         const emoji = cpu.usage > 80 ? '🔴' : cpu.usage > 50 ? '🟡' : '🟢';
        
//         process.stdout.write(
//           `\r${emoji} ${this.samples.length}s | CPU: ${cpu.usage}% [${bars.padEnd(20)}] | Mem: ${mem.heap}MB   `
//         );
        
//         if (this.samples.length >= duration) {
//           clearInterval(interval);
//           console.log('\n\n✅ Done!\n');
//           resolve();
//         }
//       }, 1000);
//     });
//   }

//   // Generate report
//   report() {
//     console.log('='.repeat(70));
//     console.log('📊 PERFORMANCE REPORT');
//     console.log('='.repeat(70));

//     if (this.samples.length > 0) {
//       const cpus = this.samples.map(s => s.cpu.usage);
//       const mems = this.samples.map(s => parseFloat(s.mem.heap));
      
//       const avgCPU = cpus.reduce((a, b) => a + b, 0) / cpus.length;
//       const maxCPU = Math.max(...cpus);
//       const avgMem = mems.reduce((a, b) => a + b, 0) / mems.length;
//       const maxMem = Math.max(...mems);
//       const minMem = Math.min(...mems);
      
//       console.log('\n📈 Statistics:');
//       console.log(`   Duration: ${this.samples.length}s`);
//       console.log(`   Avg CPU: ${avgCPU.toFixed(1)}% ${avgCPU > 50 ? '⚠️  HIGH' : '✅'}`);
//       console.log(`   Max CPU: ${maxCPU}% ${maxCPU > 80 ? '🔴 CRITICAL' : maxCPU > 50 ? '⚠️  HIGH' : '✅'}`);
//       console.log(`   Avg Memory: ${avgMem.toFixed(2)}MB`);
//       console.log(`   Max Memory: ${maxMem.toFixed(2)}MB`);
//       console.log(`   Memory Growth: ${(maxMem - minMem).toFixed(2)}MB ${(maxMem - minMem) > 100 ? '⚠️  LEAK?' : '✅'}`);
//     }

//     if (this.issues.length > 0) {
//       console.log('\n' + '='.repeat(70));
//       console.log('⚠️  CODE ISSUES FOUND:\n');
      
//       const high = this.issues.filter(i => i.severity === 'HIGH');
//       const medium = this.issues.filter(i => i.severity === 'MEDIUM');
      
//       if (high.length > 0) {
//         console.log('🔴 HIGH PRIORITY:\n');
//         high.forEach((issue, i) => {
//           console.log(`   ${i + 1}. ${issue.problem}`);
//           console.log(`      📄 ${issue.file}`);
//           console.log(`      Found: ${issue.count} time(s)`);
//           console.log(`      Fix: ${issue.fix}\n`);
//         });
//       }
      
//       if (medium.length > 0) {
//         console.log('⚠️  MEDIUM PRIORITY:\n');
//         medium.forEach((issue, i) => {
//           console.log(`   ${i + 1}. ${issue.problem} (${issue.file})`);
//           console.log(`      Fix: ${issue.fix}\n`);
//         });
//       }
//     }

//     console.log('='.repeat(70));
//     console.log('✅ WHAT TO DO NOW:\n');

//     if (this.samples.length > 0) {
//       const avgCPU = this.samples.reduce((sum, s) => sum + s.cpu.usage, 0) / this.samples.length;
      
//       if (avgCPU > 50) {
//         console.log('🔴 FIX HIGH CPU USAGE:');
//         console.log('   1. Fix Navbar.tsx event listeners');
//         console.log('   2. Add pollingInterval: 0 to RTK Query');
//         console.log('   3. Use React.memo for components');
//         console.log('   4. Check for infinite loops in useEffect');
//         console.log('   5. Remove console.log statements\n');
//       }
//     }
    
//     console.log('✅ FOR PRODUCTION:');
//     console.log('   1. npm run build');
//     console.log('   2. Use PM2: pm2 start npm --name "app" -- start');
//     console.log('   3. Enable compression');
//     console.log('   4. Monitor with: pm2 monit\n');
    
//     console.log('='.repeat(70) + '\n');
//   }

//   // Run full test
//   async test(duration = 30) {
//     console.log('🚀 Next.js Performance Tester\n');
//     console.log('Testing your app for ' + duration + ' seconds...\n');
    
//     this.checkPackages();
//     this.scanFiles();
//     await this.monitor(duration);
//     this.report();
//   }
// }

// // Run it
// const duration = parseInt(process.argv[2]) || 30;
// const tester = new NextJSPerformanceTester();

// tester.test(duration).catch(err => {
//   console.error('Error:', err.message);
//   process.exit(1);
// });

// process.on('SIGINT', () => {
//   console.log('\n\n⏹️  Stopped by user\n');
//   tester.report();
//   process.exit(0);
// });