# if there's no local ipfs repo, initialize one
if [ ! -d "$HOME/.ipfs" ]; then
  ./node_modules/.bin/jsipfs init
fi

echo "Running local IPFS node"
./node_modules/.bin/jsipfs daemon