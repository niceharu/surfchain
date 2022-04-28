# Structure

| use           | Description                                                |
| :-----------: | ---------------------------------------------------------- |
| `geth`        | Ethereum CLI client |
| `server`      | nodejs server based web3 |
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
> admin.addPeer("enode://c6b4c5ba394dc58e8203e8c722bec4d4b0b0023857e68b7b2d6de619731d9c6327a136dbc1729c77f76b0b712984a0de54807abccadda846643a4c3fc11b7cb4@172.16.254.2:30303?discport=0")
> admin.peers
``` 

## blockscout

Run blockscout.

```shell
$ docker-compose -f ./docker-compose-blockscout.yml up -d
``` 

## prometheus

Run prometheus.

```shell
$ docker-compose up -d
```

### remix

Remix IDE tool which can edit&deploy the smartcontract. Connect to http://localhost:8080.

```shell
$ docker-compose up -d
``` 

Run the shell from the source location. 

```shell
remixd -s . --remix-ide http://localhost:8080
``` 