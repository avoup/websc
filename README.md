## 
Install
```bash
npm i 
npm run install
```
Start front:
```bash
# build speech module first
npm run build:speech
# then run
npm start
```
Build all: 
```bash
npm run build
```
Build front:
```bash
npm run build:front
```
Build speech module:
```bash
npm run build:speech
```
If can't require `websc-speech` module in front run:
```bash
npm run symlink:local
```