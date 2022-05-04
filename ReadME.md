## Use

| use           | Description                                                |
| :-----------: | ---------------------------------------------------------- |
| `geth`        | Ethereum CLI client |
| `api`         | nodejs server based web3 |
| `remix`       | Ethereum IDE |
| `eth-netstats`| Monitoring tool of ethereum network |
| `prometheus`  | Monitoring tool of ethereum network based on Granfana |
| `blockscout`  | Monitoring tool of block and transaction |


## geth

### Make a new account. 

1. make a data folder or copy data-sample folder.
2. make `password` file to data folder and set password.
3. configure folder at `geth-init.yml`.
4. run the command below.

```shell
$ docker-compose -f ./geth-account-new.yml up
``` 

### Initialize gensis block. 

1. copy `genesis.json` to data folder.
2. configure folder at `geth-init.yml`.
3. run the command below.

```shell
$ docker-compose -f ./geth-init.yml up
``` 

### Operating geth & eth-netstats.

configure docker-compose.yml
      --unlock=`"your account"`
      --miner.etherbase=`"your account"`

```shell
$ docker-compose up -d
``` 

### Connection between nodes.

You can get the enode information with `admin.nodeInfo.enode` at geth console.

```shell
$ docker exec -it node2 /bin/sh
$ geth attach
> admin.addPeer("enode://8fd82f9fc8039cc9c36d407ed6789e366189a369cb8165244ab74e214012ba2e96fa7eee2c20ec6c4ff67102b70296c263fa70d68134bd2d7aac290e14a2a1ac@172.15.200.2:30303?discport=0")
> admin.peers
``` 

## Blockscout

Run blockscout.

```shell
$ docker-compose -f ./docker-compose-blockscout.yml up -d
```

## Prometheus

Run prometheus.

```shell
$ docker-compose up -d
```

## Remix

Remix IDE tool which can edit&deploy the smartcontract. Connect to http://localhost:8080.
 
```shell
$ docker-compose up -d
``` 

Run the shell from the source location. 

```shell
remixd -s . --remix-ide http://localhost:8080
```

## api server

Run api server

```shell
$ npm run start
```