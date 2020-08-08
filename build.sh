cd ./js;
yarn;
yarn build-dev;
cd ../rust;
wasm-pack build --debug;
rsync -r ./pkg/ ../js/node_modules/wasm-3048;