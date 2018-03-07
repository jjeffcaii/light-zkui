# Light Zookeeper UI (WARNING: Still in developing!!!)
a zookeeper webui implements with golang.

## Screenshot

![screenshot1](./doc/images/screenshot-1.png "screenshot1")

![screenshot2](./doc/images/screenshot-2.png "screenshot2")


## Docker

### Build Image

``` shell
$ make img=YOUR_IMAGE_NAME
```

### Run

``` shell
$ docker run -p 8080:8080 -e "ZK_URL=your-zk-1,your-zk-2,your-zk-3" jjeffcaii/light-zkui
```
